# 0xH4X — Cybersecurity Portfolio

A full-stack cybersecurity portfolio website with terminal aesthetics, CTF tracking, writeups, and project showcase.

---

## 📁 Structure

```
cybersec-portfolio/
├── index.html          ← Main HTML
├── style.css           ← Full CSS (dark terminal theme)
├── app.js              ← Frontend JavaScript
└── backend/
    ├── main.py         ← FastAPI + MongoDB backend
    └── requirements.txt
```

---

## 🖥️ Frontend

Open `index.html` directly in a browser for the static frontend.

**Tech:** Vanilla HTML/CSS/JS · Share Tech Mono · Rajdhani · Exo 2 (Google Fonts)

**Sections:**
- Boot screen terminal animation
- Hero with live terminal simulation + animated counters
- Projects showcase with hex-clip cards
- Write-ups with platform filter (TryHackMe, PortSwigger, PicoCTF, Daily)
- CTF challenges table with difficulty badges
- Skills with animated progress bars + tools grid
- Contact form

---

## ⚙️ Backend (FastAPI + MongoDB)

### 1. Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Start MongoDB
```bash
# Local MongoDB
mongod --dbpath /data/db

# OR via Docker
docker run -d -p 27017:27017 --name mongo mongo:latest
```

### 3. (Optional) Create .env file
```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=portfolio_db
```

### 4. Run the backend
```bash
uvicorn main:app --reload --port 8000
```

### 5. API Docs
Visit: **http://localhost:8000/docs** (Swagger UI auto-generated)

---

## 🔌 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/writeups` | List writeups (filter: `?platform=tryhackme`) |
| POST | `/api/writeups` | Create writeup |
| PUT | `/api/writeups/{id}` | Update writeup |
| DELETE | `/api/writeups/{id}` | Delete writeup |
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project |
| GET | `/api/ctf` | List CTF challenges |
| POST | `/api/ctf` | Add CTF challenge |
| GET | `/api/skills` | List skills |
| POST | `/api/skills` | Add skill |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/stats` | Portfolio summary stats |

---

## 🚀 Deployment Tips

- **Frontend:** Deploy to Netlify / Vercel / GitHub Pages
- **Backend:** Deploy to Railway / Render / VPS  
- **MongoDB:** Use MongoDB Atlas free tier for cloud DB
- Update `MONGO_URI` env var on your hosting platform
- Update fetch URL in `app.js` from `/api/contact` to your backend URL

---

## 🎨 Customization

Edit `app.js` to update:
- `PROJECTS` array — your real projects
- `WRITEUPS` array — your real writeups (or fetch from `/api/writeups`)
- `CTF_CHALLENGES` — your real CTF list
- `OFFENSIVE_SKILLS` / `WEB_SKILLS` — your skill levels (0–100)

---


