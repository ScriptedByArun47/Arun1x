# Arun1x — Cybersecurity Portfolio

> TryHackMe Top 2% · Pentesting · OWASP · SOC · Python Security Tools

Live → [arun1x.vercel.app](https://arun1x.vercel.app)

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | HTML · CSS · Vanilla JS |
| Backend | Python · FastAPI |
| Database | MongoDB Atlas |
| Image CDN | Cloudinary |
| Frontend Host | Vercel |
| Backend Host | Render |

---

## Project Structure

```
website/
├── backend/
│   ├── main.py
│   ├── admin.html
│   ├── requirements.txt
│   ├── runtime.txt
│   └── Procfile
├── frontend/
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   └── Writeup.html
├── .gitignore
└── README.md
```

---

## Features

- Terminal boot screen with hacker aesthetic
- Writeup reader with Cloudinary image rendering
- CTF challenge tracker
- Skills & certifications showcase
- Contact form
- Admin dashboard for content management

---

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
python -m http.server 3000
```

---

## Deployment

### Backend → Render
- Root Directory: `backend`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend → Vercel
- Root Directory: `frontend`
- Framework: `Other`

---

*Built by [ArunKumar L](https://github.com/ScriptedByArun47) · Stay paranoid. Keep hacking.*
