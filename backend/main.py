"""
Arun1x Portfolio Backend
FastAPI + MongoDB + Cloudinary

Flow:
  Upload .docx / .md / .txt
    → Extract text content
    → Extract images from .docx → upload each to Cloudinary → get CDN URL
    → Store markdown (with Cloudinary URLs) + metadata in MongoDB
    → Frontend fetches writeup → renders markdown + Cloudinary images

Install:
    pip install fastapi uvicorn motor pymongo python-docx python-multipart python-dotenv cloudinary

Run:
    uvicorn main:app --reload --port 8000

.env required:
    MONGO_URI=mongodb+srv://...
    DB_NAME=portfolio_db
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from docx import Document as DocxDocument
from dotenv import load_dotenv
from io import BytesIO
import cloudinary
import cloudinary.uploader
import asyncio
import os, re

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
load_dotenv()

MONGO_URI  = os.getenv("MONGO_URI",  "mongodb://localhost:27017")
DB_NAME    = os.getenv("DB_NAME",    "portfolio_db")
CDN_NAME   = os.getenv("CLOUDINARY_CLOUD_NAME",  "")
CDN_KEY    = os.getenv("CLOUDINARY_API_KEY",      "")
CDN_SECRET = os.getenv("CLOUDINARY_API_SECRET",   "")

for var, val in [("MONGO_URI", MONGO_URI), ("DB_NAME", DB_NAME),
                 ("CLOUDINARY_CLOUD_NAME", CDN_NAME),
                 ("CLOUDINARY_API_KEY", CDN_KEY),
                 ("CLOUDINARY_API_SECRET", CDN_SECRET)]:
    if not val:
        raise RuntimeError(f"{var} is not set. Check your .env file.")

# Configure Cloudinary
cloudinary.config(
    cloud_name = CDN_NAME,
    api_key    = CDN_KEY,
    api_secret = CDN_SECRET,
    secure     = True,
)

print(f"[CONFIG] MongoDB  → {MONGO_URI[:50]}...")
print(f"[CONFIG] DB       → {DB_NAME}")
print(f"[CONFIG] Cloudinary → cloud={CDN_NAME}")

ALLOWED_EXTENSIONS = {".txt", ".md", ".docx"}
MAX_FILE_MB        = 20   # raised since docx with images can be larger

# ─────────────────────────────────────────────
# APP
# ─────────────────────────────────────────────
app = FastAPI(title="Arun1x Portfolio API", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# DATABASE
# ─────────────────────────────────────────────
client = None
db     = None

@app.on_event("startup")
async def startup():
    global client, db
    try:
        client = AsyncIOMotorClient(
            MONGO_URI,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=10000,
        )
        db = client[DB_NAME]
        await client.admin.command("ping")
        print(f"[OK] MongoDB Atlas connected — {DB_NAME}")
        await db.writeups.create_index("slug", unique=True)
        await db.writeups.create_index("platform")
    except Exception as e:
        print(f"[ERROR] MongoDB connection failed: {e}")
        raise

@app.on_event("shutdown")
async def shutdown():
    client.close()

def fix_id(doc: dict) -> dict:
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

def slugify(title: str) -> str:
    s = title.lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s.strip())
    return s[:80]

# ─────────────────────────────────────────────
# CLOUDINARY HELPER
# ─────────────────────────────────────────────
def upload_image_to_cloudinary(img_bytes: bytes, ext: str, folder: str, filename: str) -> str:
    """
    Upload raw image bytes to Cloudinary.
    Returns the secure CDN URL.
    folder   : e.g. "writeups/mr-robot-ctf"
    filename : e.g. "image_1"
    """
    # Cloudinary accepts a BytesIO stream directly
    result = cloudinary.uploader.upload(
        BytesIO(img_bytes),
        folder         = f"portfolio/writeups/{folder}",
        public_id      = filename,
        resource_type  = "image",
        format         = ext if ext != "jpg" else "jpg",
        overwrite      = True,
        transformation = [
            # Auto quality + format (WebP on supporting browsers)
            {"quality": "auto", "fetch_format": "auto"},
            # Max width 1400px, never upscale
            {"width": 1400, "crop": "limit"},
        ]
    )
    return result["secure_url"]

# ─────────────────────────────────────────────
# FILE PARSERS
# ─────────────────────────────────────────────
def parse_txt(data: bytes) -> str:
    return data.decode("utf-8", errors="replace")

def parse_md(data: bytes) -> str:
    return data.decode("utf-8", errors="replace")

def parse_docx(data: bytes, slug: str) -> str:
    """
    Convert .docx → Markdown.
    Images are uploaded to Cloudinary; their CDN URLs replace base64.

    Process:
      1. Extract all images from .docx relationships
      2. Upload each image to Cloudinary under portfolio/writeups/{slug}/
      3. Map each paragraph's image reference → Cloudinary URL
      4. Walk paragraphs → build markdown, inserting ![alt](cloudinary_url)
    """
    doc = DocxDocument(BytesIO(data))

    # Step 1 — collect raw image bytes keyed by relationship id
    raw_images = {}   # rId → {"bytes": bytes, "ext": str}
    for rid, rel in doc.part.rels.items():
        if "image" in rel.reltype:
            ext = rel.target_ref.split(".")[-1].lower()
            if ext in ("jpg", "jpeg"): ext = "jpg"
            elif ext == "png":         ext = "png"
            elif ext == "gif":         ext = "gif"
            elif ext == "webp":        ext = "webp"
            else:                      ext = "png"   # fallback
            raw_images[rid] = {
                "bytes": rel.target_part.blob,
                "ext":   ext,
            }

    print(f"  [docx] Found {len(raw_images)} image(s) — uploading to Cloudinary...")

    # Step 2 — upload all images to Cloudinary, collect URLs
    cloudinary_urls = {}   # rId → CDN URL
    for idx, (rid, img) in enumerate(raw_images.items(), start=1):
        try:
            url = upload_image_to_cloudinary(
                img_bytes = img["bytes"],
                ext       = img["ext"],
                folder    = slug,
                filename  = f"img_{idx}",
            )
            cloudinary_urls[rid] = url
            print(f"  [cloudinary] img_{idx} → {url}")
        except Exception as e:
            print(f"  [cloudinary] FAILED to upload img_{idx}: {e}")
            # Fall back to a placeholder so content still renders
            cloudinary_urls[rid] = ""

    # Step 3 — map paragraph index → rId
    para_image = {}
    for i, para in enumerate(doc.paragraphs):
        for elem in para._element.iter():
            tag = elem.tag.split("}")[-1] if "}" in elem.tag else elem.tag
            if tag == "blip":
                embed = elem.get(
                    "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed"
                )
                if embed and embed in cloudinary_urls:
                    para_image[i] = embed

    # Step 4 — walk paragraphs and build markdown
    lines = []
    for i, para in enumerate(doc.paragraphs):
        # Insert image markdown before the paragraph it belongs to
        if i in para_image:
            rid = para_image[i]
            url = cloudinary_urls.get(rid, "")
            if url:
                lines.append(f"![screenshot]({url})")
            lines.append("")   # blank line after image

        text  = para.text.strip()
        style = para.style.name if para.style else ""

        if not text:
            lines.append("")
            continue

        if   "Heading 1" in style: lines.append(f"# {text}")
        elif "Heading 2" in style: lines.append(f"## {text}")
        elif "Heading 3" in style: lines.append(f"### {text}")
        elif "Heading 4" in style: lines.append(f"#### {text}")
        elif "List Bullet" in style: lines.append(f"- {text}")
        elif "List Number" in style: lines.append(f"1. {text}")
        elif "Code" in style or any(
            r.font.name and "Courier" in r.font.name
            for r in para.runs if r.font.name
        ):
            lines.append(f"```\n{text}\n```")
        else:
            out = ""
            for run in para.runs:
                t = run.text
                if not t: continue
                if run.bold and run.italic: t = f"***{t}***"
                elif run.bold:              t = f"**{t}**"
                elif run.italic:            t = f"*{t}*"
                out += t
            lines.append(out.strip() or text)

    # Tables
    for tbl in doc.tables:
        rows = tbl.rows
        if not rows: continue
        headers = [c.text.strip() for c in rows[0].cells]
        lines.append("| " + " | ".join(headers) + " |")
        lines.append("| " + " | ".join(["---"] * len(headers)) + " |")
        for row in rows[1:]:
            cells = [c.text.strip() for c in row.cells]
            lines.append("| " + " | ".join(cells) + " |")
        lines.append("")

    return "\n".join(lines)

def extract_content(filename: str, data: bytes, slug: str) -> str:
    """Route to correct parser. .docx gets Cloudinary image upload."""
    ext = os.path.splitext(filename)[1].lower()
    if   ext == ".txt":  return parse_txt(data)
    elif ext == ".md":   return parse_md(data)
    elif ext == ".docx": return parse_docx(data, slug)
    raise ValueError(f"Unsupported file type: {ext}")

# ─────────────────────────────────────────────
# WRITEUP — UPLOAD FILE
# ─────────────────────────────────────────────
@app.post("/api/writeups/upload", status_code=201, tags=["Writeups"])
async def upload_writeup(
    file:           UploadFile = File(...),
    title:          str        = Form(...),
    platform:       str        = Form(...),
    platform_label: str        = Form(...),
    excerpt:        str        = Form(...),
    difficulty:     str        = Form(...),
    category:       str        = Form(""),
    tags:           str        = Form(""),
):
    """
    Upload .txt / .md / .docx walkthrough.
    - Images extracted from .docx → uploaded to Cloudinary → CDN URLs stored in MongoDB
    - Text content stored as clean Markdown in MongoDB
    - No base64 blobs in the database
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"Type '{ext}' not allowed. Use: .txt .md .docx")

    raw = await file.read()
    if len(raw) > MAX_FILE_MB * 1024 * 1024:
        raise HTTPException(413, f"File exceeds {MAX_FILE_MB}MB limit")

    # Build unique slug FIRST (needed as Cloudinary folder name)
    base = slugify(title)
    slug, n = base, 1
    while await db.writeups.find_one({"slug": slug}):
        slug = f"{base}-{n}"; n += 1

    print(f"[upload] Processing '{title}' → slug='{slug}'")

    # Parse file — this uploads images to Cloudinary for .docx
    try:
        content = await asyncio.get_event_loop().run_in_executor(
            None, extract_content, file.filename, raw, slug
        )
    except Exception as e:
        raise HTTPException(422, f"Could not parse file: {e}")

    # Count how many Cloudinary images ended up in the content
    img_count = content.count("![")

    doc_data = {
        "title":          title,
        "platform":       platform,
        "platform_label": platform_label,
        "excerpt":        excerpt,
        "difficulty":     difficulty,
        "category":       category,
        "tags":           [t.strip() for t in tags.split(",") if t.strip()],
        "content":        content,           # clean markdown with CDN URLs
        "file_name":      file.filename,
        "file_type":      ext,
        "slug":           slug,
        "image_count":    img_count,         # how many Cloudinary images
        "date":           datetime.utcnow().strftime("%Y-%m-%d"),
        "created_at":     datetime.utcnow(),
        "views":          0,
    }

    result = await db.writeups.insert_one(doc_data)
    print(f"[upload] Saved to MongoDB — id={result.inserted_id}, images={img_count}")

    return {
        "id":          str(result.inserted_id),
        "slug":        slug,
        "image_count": img_count,
        "message":     f"'{title}' uploaded — {img_count} image(s) on Cloudinary",
    }

# ─────────────────────────────────────────────
# WRITEUP — LIST (cards, no content)
# ─────────────────────────────────────────────
@app.get("/api/writeups", tags=["Writeups"])
async def list_writeups(platform: Optional[str] = None, limit: int = 50, skip: int = 0):
    q = {}
    if platform and platform != "all":
        q["platform"] = platform
    cursor = db.writeups.find(q, {"content": 0}).sort("created_at", -1).skip(skip).limit(limit)
    docs   = [fix_id(d) async for d in cursor]
    return {"writeups": docs, "total": await db.writeups.count_documents(q)}

# ─────────────────────────────────────────────
# WRITEUP — FULL PAGE (with content + CDN images)
# ─────────────────────────────────────────────
@app.get("/api/writeups/{slug}", tags=["Writeups"])
async def get_writeup(slug: str):
    doc = await db.writeups.find_one({"slug": slug})
    if not doc:
        try:
            doc = await db.writeups.find_one({"_id": ObjectId(slug)})
        except Exception:
            pass
    if not doc:
        raise HTTPException(404, "Writeup not found")
    await db.writeups.update_one({"_id": doc["_id"]}, {"$inc": {"views": 1}})
    return fix_id(doc)

@app.delete("/api/writeups/{slug}", tags=["Writeups"])
async def delete_writeup(slug: str):
    # Optionally: delete Cloudinary folder too
    # cloudinary.api.delete_resources_by_prefix(f"portfolio/writeups/{slug}/")
    r = await db.writeups.delete_one({"slug": slug})
    if r.deleted_count == 0:
        raise HTTPException(404, "Writeup not found")
    return {"deleted": True}

# ─────────────────────────────────────────────
# PROJECTS
# ─────────────────────────────────────────────
class ProjectIn(BaseModel):
    title: str;       tag: str;        description: str
    stack: list;      github_url: str = ""; demo_url: str = ""

@app.get("/api/projects", tags=["Projects"])
async def get_projects():
    return {"projects": [fix_id(d) async for d in db.projects.find().sort("created_at", -1)]}

@app.post("/api/projects", status_code=201, tags=["Projects"])
async def create_project(data: ProjectIn):
    r = await db.projects.insert_one({**data.dict(), "created_at": datetime.utcnow()})
    return {"id": str(r.inserted_id)}

@app.delete("/api/projects/{pid}", tags=["Projects"])
async def delete_project(pid: str):
    r = await db.projects.delete_one({"_id": ObjectId(pid)})
    if r.deleted_count == 0: raise HTTPException(404, "Not found")
    return {"deleted": True}

# ─────────────────────────────────────────────
# CTF
# ─────────────────────────────────────────────
class CTFIn(BaseModel):
    name: str;        platform: str;   category: str
    difficulty: str;  status: str;     writeup_slug: Optional[str] = None

@app.get("/api/ctf", tags=["CTF"])
async def get_ctf(platform: Optional[str] = None, status: Optional[str] = None):
    q = {}
    if platform: q["platform"] = platform
    if status:   q["status"]   = status
    return {"challenges": [fix_id(d) async for d in db.ctf.find(q).sort("created_at", -1)]}

@app.post("/api/ctf", status_code=201, tags=["CTF"])
async def create_ctf(data: CTFIn):
    r = await db.ctf.insert_one({**data.dict(), "created_at": datetime.utcnow()})
    return {"id": str(r.inserted_id)}

# ─────────────────────────────────────────────
# SKILLS
# ─────────────────────────────────────────────
class SkillIn(BaseModel):
    name: str;  category: str;  level: Optional[int] = None
    icon: Optional[str] = None; issuer: Optional[str] = None

@app.get("/api/skills", tags=["Skills"])
async def get_skills():
    return {"skills": [fix_id(d) async for d in db.skills.find().sort("level", -1)]}

@app.post("/api/skills", status_code=201, tags=["Skills"])
async def add_skill(data: SkillIn):
    r = await db.skills.insert_one({**data.dict(), "created_at": datetime.utcnow()})
    return {"id": str(r.inserted_id)}

# ─────────────────────────────────────────────
# CONTACT
# ─────────────────────────────────────────────
class ContactIn(BaseModel):
    name: str;  email: str;  message: str

@app.post("/api/contact", status_code=201, tags=["Contact"])
async def contact(data: ContactIn):
    r = await db.messages.insert_one({**data.dict(), "received_at": datetime.utcnow(), "read": False})
    return {"id": str(r.inserted_id), "status": "received"}

# ─────────────────────────────────────────────
# STATS
# ─────────────────────────────────────────────
@app.get("/api/stats", tags=["Stats"])
async def stats():
    return {
        "writeups":   await db.writeups.count_documents({}),
        "projects":   await db.projects.count_documents({}),
        "ctf_solved": await db.ctf.count_documents({"status": "solved"}),
        "ctf_total":  await db.ctf.count_documents({}),
    }

# ─────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)