"""
0xH4X Portfolio Backend
FastAPI + MongoDB
Run: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr, Field
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime
from typing import Optional, List
import os

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME   = os.getenv("DB_NAME", "portfolio_db")

app = FastAPI(title="0xH4X Portfolio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# DATABASE
# ─────────────────────────────────────────────
client: AsyncIOMotorClient = None
db = None

@app.on_event("startup")
async def startup():
    global client, db
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    print(f"✓ Connected to MongoDB: {MONGO_URI}/{DB_NAME}")

@app.on_event("shutdown")
async def shutdown():
    client.close()

def fix_id(doc: dict) -> dict:
    """Convert ObjectId to string for JSON serialization."""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

# ─────────────────────────────────────────────
# SCHEMAS
# ─────────────────────────────────────────────
class WriteupIn(BaseModel):
    title: str
    platform: str          # tryhackme | portswigger | picoctf | daily
    platform_label: str
    excerpt: str
    content: str           # Full markdown content
    difficulty: str        # easy | medium | hard
    category: str
    tags: List[str] = []

class WriteupOut(WriteupIn):
    id: str
    date: str
    slug: str

class ProjectIn(BaseModel):
    title: str
    tag: str
    description: str
    stack: List[str]
    github_url: str = ""
    demo_url: str = ""

class CTFIn(BaseModel):
    name: str
    platform: str
    category: str
    difficulty: str        # easy | medium | hard
    status: str            # solved | progress
    writeup_id: Optional[str] = None

class ContactIn(BaseModel):
    name: str
    email: str
    message: str

class SkillIn(BaseModel):
    name: str
    category: str          # offensive | web | tool | cert
    level: Optional[int] = None   # 0-100 for bars
    icon: Optional[str] = None
    issuer: Optional[str] = None  # for certs

# ─────────────────────────────────────────────
# ROUTES — WRITEUPS
# ─────────────────────────────────────────────
@app.get("/api/writeups", tags=["Writeups"])
async def get_writeups(platform: Optional[str] = None, limit: int = 20, skip: int = 0):
    """Fetch all writeups, optionally filtered by platform."""
    query = {}
    if platform and platform != "all":
        query["platform"] = platform
    cursor = db.writeups.find(query).sort("date", -1).skip(skip).limit(limit)
    writeups = [fix_id(doc) async for doc in cursor]
    return {"writeups": writeups, "total": await db.writeups.count_documents(query)}

@app.get("/api/writeups/{writeup_id}", tags=["Writeups"])
async def get_writeup(writeup_id: str):
    """Fetch a single writeup by ID."""
    doc = await db.writeups.find_one({"_id": ObjectId(writeup_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Writeup not found")
    return fix_id(doc)

@app.post("/api/writeups", status_code=201, tags=["Writeups"])
async def create_writeup(data: WriteupIn):
    """Create a new writeup."""
    slug = data.title.lower().replace(" ", "-").replace("/", "-")
    doc = {
        **data.dict(),
        "slug": slug,
        "date": datetime.utcnow().strftime("%Y-%m-%d"),
        "created_at": datetime.utcnow(),
        "views": 0,
    }
    result = await db.writeups.insert_one(doc)
    return {"id": str(result.inserted_id), "slug": slug}

@app.put("/api/writeups/{writeup_id}", tags=["Writeups"])
async def update_writeup(writeup_id: str, data: WriteupIn):
    result = await db.writeups.update_one(
        {"_id": ObjectId(writeup_id)},
        {"$set": {**data.dict(), "updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Writeup not found")
    return {"updated": True}

@app.delete("/api/writeups/{writeup_id}", tags=["Writeups"])
async def delete_writeup(writeup_id: str):
    result = await db.writeups.delete_one({"_id": ObjectId(writeup_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Writeup not found")
    return {"deleted": True}

# ─────────────────────────────────────────────
# ROUTES — PROJECTS
# ─────────────────────────────────────────────
@app.get("/api/projects", tags=["Projects"])
async def get_projects():
    cursor = db.projects.find().sort("created_at", -1)
    return {"projects": [fix_id(doc) async for doc in cursor]}

@app.post("/api/projects", status_code=201, tags=["Projects"])
async def create_project(data: ProjectIn):
    doc = {**data.dict(), "created_at": datetime.utcnow()}
    result = await db.projects.insert_one(doc)
    return {"id": str(result.inserted_id)}

@app.put("/api/projects/{project_id}", tags=["Projects"])
async def update_project(project_id: str, data: ProjectIn):
    result = await db.projects.update_one(
        {"_id": ObjectId(project_id)},
        {"$set": {**data.dict(), "updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"updated": True}

@app.delete("/api/projects/{project_id}", tags=["Projects"])
async def delete_project(project_id: str):
    result = await db.projects.delete_one({"_id": ObjectId(project_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"deleted": True}

# ─────────────────────────────────────────────
# ROUTES — CTF CHALLENGES
# ─────────────────────────────────────────────
@app.get("/api/ctf", tags=["CTF"])
async def get_ctf_challenges(platform: Optional[str] = None, status: Optional[str] = None):
    query = {}
    if platform: query["platform"] = platform
    if status:   query["status"] = status
    cursor = db.ctf.find(query).sort("created_at", -1)
    return {"challenges": [fix_id(doc) async for doc in cursor]}

@app.post("/api/ctf", status_code=201, tags=["CTF"])
async def create_ctf(data: CTFIn):
    doc = {**data.dict(), "created_at": datetime.utcnow()}
    result = await db.ctf.insert_one(doc)
    return {"id": str(result.inserted_id)}

@app.put("/api/ctf/{ctf_id}", tags=["CTF"])
async def update_ctf(ctf_id: str, data: CTFIn):
    result = await db.ctf.update_one(
        {"_id": ObjectId(ctf_id)},
        {"$set": {**data.dict(), "updated_at": datetime.utcnow()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return {"updated": True}

# ─────────────────────────────────────────────
# ROUTES — SKILLS
# ─────────────────────────────────────────────
@app.get("/api/skills", tags=["Skills"])
async def get_skills():
    cursor = db.skills.find().sort("level", -1)
    return {"skills": [fix_id(doc) async for doc in cursor]}

@app.post("/api/skills", status_code=201, tags=["Skills"])
async def add_skill(data: SkillIn):
    result = await db.skills.insert_one({**data.dict(), "created_at": datetime.utcnow()})
    return {"id": str(result.inserted_id)}

# ─────────────────────────────────────────────
# ROUTES — CONTACT
# ─────────────────────────────────────────────
@app.post("/api/contact", status_code=201, tags=["Contact"])
async def submit_contact(data: ContactIn):
    """Store incoming contact message in MongoDB."""
    doc = {
        "name": data.name,
        "email": data.email,
        "message": data.message,
        "received_at": datetime.utcnow(),
        "read": False,
    }
    result = await db.messages.insert_one(doc)
    return {"id": str(result.inserted_id), "status": "received"}

@app.get("/api/contact/messages", tags=["Contact"])
async def get_messages():
    """Admin: fetch all contact messages."""
    cursor = db.messages.find().sort("received_at", -1)
    return {"messages": [fix_id(doc) async for doc in cursor]}

# ─────────────────────────────────────────────
# ROUTES — STATS
# ─────────────────────────────────────────────
@app.get("/api/stats", tags=["Stats"])
async def get_stats():
    """Return portfolio summary stats."""
    return {
        "writeups":   await db.writeups.count_documents({}),
        "projects":   await db.projects.count_documents({}),
        "ctf_solved": await db.ctf.count_documents({"status": "solved"}),
        "ctf_total":  await db.ctf.count_documents({}),
    }

# ─────────────────────────────────────────────
# SERVE STATIC FILES (Frontend)
# ─────────────────────────────────────────────
# Uncomment when deploying frontend + backend together:
# app.mount("/", StaticFiles(directory="frontend", html=True), name="static")

# ─────────────────────────────────────────────
# RUN
# ─────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
