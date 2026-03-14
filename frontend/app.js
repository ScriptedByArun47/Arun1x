/* ============================================================
   Arun1x — Cybersecurity Portfolio · app.js
   ============================================================
   DEPLOYMENT CONFIG — change API_BASE to your deployed backend URL
   e.g. "https://arun1x-api.onrender.com"  or  "https://api.yourdomain.com"
   ============================================================ */
const API_BASE = "https://arun1x-backend.onrender.com";

/* ============================================================
   PROJECTS — edit to add / update your own
   ============================================================ */
const PROJECTS = [
  {
    tag:    "FRAMEWORK // PENTESTING",
    title:  "PENTURION",
    desc:   "Automated web pentesting framework (in development). Chains reconnaissance, enumeration, vulnerability scanning and exploitation workflows into a modular pipeline.",
    stack:  ["Python", "Bash", "Nmap", "Gobuster", "SQLmap", "Metasploit"],
    github: "https://github.com/ScriptedByArun47/Penturion.git",
    demo:   "#",
  },
  {
    tag:    "APPLICATION // PYTHON",
    title:  "Adaptive Weather Monitor",
    desc:   "Real-time weather application with adaptive UI themes, ambient audio, and animated transitions. Integrates OpenWeather API for live geolocation, temperature, and atmospheric data.",
    stack:  ["Python", "KivyMD", "OpenWeather API"],
    github: "https://github.com/ScriptedByArun47/WeatherApp2.0.git",
    demo:   "#",
  },
  {
    tag:    "TOOL // REDTEAM",
    title:  "Advanced Reverse Shell",
    desc:   "Controlled reverse shell for penetration testing — supports remote command execution, secure file transfer, privilege checks, and persistence mechanisms.",
    stack:  ["Python", "TCP Networking", "Windows", "Linux"],
    github: "https://github.com/ScriptedByArun47/Silent_SHELL.git",
    demo:   "#",
  },
  {
    tag:    "PLATFORM // FULLSTACK",
    title:  "Cybersecurity Portfolio",
    desc:   "This site. Full-stack portfolio with FastAPI backend, MongoDB storage, Cloudinary image CDN, file upload for walkthroughs, CTF tracker, and writeup reader.",
    stack:  ["HTML", "CSS", "JS", "FastAPI", "MongoDB", "Cloudinary"],
    github: "https://github.com/ScriptedByArun47/Arun1x.git",
    demo:   "#",
  },
];

/* ============================================================
   CTF CHALLENGES — edit / extend as you complete more
   ============================================================ */
const CTF_CHALLENGES = [
  { id:"001", name:"Pickle Rick",              platform:"TryHackMe",  category:"Web / LFI",       diff:"easy",   status:"solved"   },
  { id:"002", name:"SQL Injection UNION Lab",  platform:"PortSwigger",category:"SQLi",             diff:"easy",   status:"solved"   },
  { id:"003", name:"Wireshark doo dooo",       platform:"PicoCTF",    category:"Forensics",        diff:"easy",   status:"solved"   },
  { id:"004", name:"Buffer Overflow 1",        platform:"PicoCTF",    category:"Binary Exploit",   diff:"medium", status:"solved"   },
  { id:"005", name:"XSS DOM-Based",            platform:"PortSwigger",category:"XSS",              diff:"hard",   status:"solved"   },
  { id:"006", name:"Mr. Robot",                platform:"TryHackMe",  category:"Web / PrivEsc",    diff:"medium", status:"solved"   },
  { id:"007", name:"Blind SQLi Time-Based",    platform:"PortSwigger",category:"SQLi",             diff:"hard",   status:"progress" },
  { id:"008", name:"ConvertMyVideo",           platform:"TryHackMe",  category:"Web / Cmd Inject", diff:"medium", status:"solved"   },
];

/* ============================================================
   SKILLS
   ============================================================ */
const OFFENSIVE_SKILLS = [
  { name:"Reconnaissance & Enumeration",  pct:88 },
  { name:"Vulnerability Scanning",        pct:85 },
  { name:"Exploitation Workflows",        pct:78 },
  { name:"Linux Administration",          pct:82 },
];
const WEB_SKILLS = [
  { name:"OWASP Top 10 Testing",          pct:85 },
  { name:"Input / Session Testing",       pct:80 },
  { name:"Directory & Param Enumeration", pct:88 },
  { name:"Network Traffic Analysis",      pct:82 },
];
const TOOLS = [
  "Nmap","Burp Suite","Metasploit","Wireshark",
  "SQLmap","Hydra","Netcat","John the Ripper",
  "Python","Bash","Javascript","Linux",
];
const CERTS = [
  { icon:"🛡️", name:"Ethical Hacking & Bug Hunting", issuer:"Cyfotok Infosec"       },
  { icon:"🎯", name:"TryHackMe — Top 2% Hacker",     issuer:"TryHackMe"             },
  { icon:"🤖", name:"SIH 2025 Selected",              issuer:"Smart India Hackathon"  },
  { icon:"🏆", name:"HackRx 6.0 Pre-Finals",          issuer:"Bajaj Finserv"         },
];

/* ============================================================
   BOOT SEQUENCE
   ============================================================ */
const bootLines = [
  "BIOS v2.1.0 — Initializing secure boot...",
  "Loading kernel modules [▓▓▓▓▓▓▓▓▓▓] 100%",
  "Starting network services... [ OK ]",
  "Mounting encrypted volumes... [ OK ]",
  "Loading firewall rules (iptables)... [ OK ]",
  "Establishing VPN tunnel... [ OK ]",
  "Checking for rootkits... CLEAN",
  "Launching portfolio interface...",
  "Access granted. Welcome, operator.",
];

async function runBoot() {
  const log = document.getElementById("boot-log");
  for (const line of bootLines) {
    await sleep(Math.random() * 120 + 60);
    log.innerHTML += `<div><span style="color:var(--accent2)">[${timestamp()}]</span> ${line}</div>`;
  }
  await sleep(600);
  document.getElementById("boot-screen").classList.add("hide");
  document.getElementById("boot-screen").addEventListener("transitionend", () => {
    document.getElementById("boot-screen").style.display = "none";
  });
}

/* ============================================================
   HERO TERMINAL ANIMATION
   ============================================================ */
const terminalLines = [
  { text:"kali@Arun1x:~$ whoami",                                        delay:200, color:"#00ff88" },
  { text:"ArunKumar L — Aspiring Cybersecurity Engineer  | B.Tech IT",               delay:400 },
  { text:"kali@Arun1x:~$ cat skills.txt",                                delay:800, color:"#00ff88" },
  { text:"► Reconnaissance, Enumeration, Exploitation",                  delay:300 },
  { text:"► OWASP Top 10 · Burp Suite · Metasploit",                     delay:200 },
  { text:"► TryHackMe Top 2% · 120+ labs completed",                     delay:200 },
  { text:"► Python · Bash · JavaScript Scripting",                       delay:200 },
  { text:"kali@Arun1x:~$ ls projects/",                                  delay:800, color:"#00ff88" },
  { text:"PENTURION/  reverse-shell/  weather-app/",                     delay:300, color:"#00cfff" },
  { text:"kali@Arun1x:~$ cat target.txt",                                delay:700, color:"#00ff88" },
  { text:"Target: Cybersecurity Intern / Penetration Tester Intern",            delay:300, color:"#ffaa00" },
  { text:"kali@Arun1x:~$ █",                                             delay:600, color:"#00ff88" },
];

async function runTerminal() {
  const body = document.getElementById("heroTerminal");
  if (!body) return;
  for (const line of terminalLines) {
    await sleep(line.delay);
    const div = document.createElement("div");
    div.style.color = line.color || "var(--text)";
    div.style.opacity = "0";
    div.style.transition = "opacity 0.3s";
    div.textContent = line.text;
    body.appendChild(div);
    requestAnimationFrame(() => { div.style.opacity = "1"; });
    body.scrollTop = body.scrollHeight;
  }
}

/* ============================================================
   RENDER — PROJECTS
   ============================================================ */
function renderProjects() {
  document.getElementById("projectsGrid").innerHTML = PROJECTS.map(p => `
    <div class="project-card">
      <div class="project-links">
        <a href="${p.github}" target="_blank" class="project-link-btn">GH</a>
        <a href="${p.demo}"   target="_blank" class="project-link-btn">↗</a>
      </div>
      <div class="project-tag">${p.tag}</div>
      <div class="project-title">${p.title}</div>
      <div class="project-desc">${p.desc}</div>
      <div class="project-stack">${p.stack.map(s=>`<span class="stack-tag">${s}</span>`).join("")}</div>
    </div>
  `).join("");
}

/* ============================================================
   RENDER — WRITEUPS  (fetches from API, falls back to empty)
   ============================================================ */
function platformClass(p) {
  return p === "tryhackme" ? "thm" : p === "portswigger" ? "ps" : p === "picoctf" ? "pico" : "daily";
}

function renderWriteupCards(data) {
  const grid = document.getElementById("writeupsGrid");
  if (!data.length) {
    grid.innerHTML = `<div style="font-family:var(--font-mono);color:var(--text-dim);font-size:0.85rem;padding:2rem 0">
      // No writeups yet. Upload your first walkthrough via the API.</div>`;
    return;
  }
  grid.innerHTML = data.map(w => `
    <a class="writeup-card" href="writeup.html?slug=${w.slug || w._id}" style="text-decoration:none;display:block;">
      <div class="writeup-meta">
        <span class="writeup-platform platform-${platformClass(w.platform)}">${w.platform_label}</span>
        <span class="writeup-date">${w.date}</span>
      </div>
      <div class="writeup-title">${w.title}</div>
      <div class="writeup-excerpt">${w.excerpt}</div>
      <div class="writeup-footer">
        <div class="writeup-diff diff-${w.difficulty}">
          <div class="diff-dot"></div>
          <span class="diff-label">${(w.difficulty||"").toUpperCase()}</span>
        </div>
        <div class="writeup-tags">${(w.tags||[]).map(t=>`<span class="wtag">#${t}</span>`).join("")}</div>
        <span class="read-more-btn">READ FULL →</span>
      </div>
    </a>`
  ).join("");
}

async function fetchWriteups(filter = "all") {
  const grid = document.getElementById("writeupsGrid");
  grid.innerHTML = `<div style="font-family:var(--font-mono);color:var(--text-dim);font-size:0.8rem;padding:1rem 0">// Loading writeups...</div>`;
  try {
    const url  = filter === "all" ? `${API_BASE}/api/writeups` : `${API_BASE}/api/writeups?platform=${filter}`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error("API error");
    const json = await res.json();
    renderWriteupCards(json.writeups || []);
  } catch {
    renderWriteupCards([]);
  }
}

function renderWriteups(filter = "all") { fetchWriteups(filter); }

/* ============================================================
   RENDER — CTF TABLE
   ============================================================ */
function renderCTF() {
  document.getElementById("ctfTableBody").innerHTML = CTF_CHALLENGES.map(c => `
    <tr>
      <td style="color:var(--text-dim)">#${c.id}</td>
      <td>${c.name}</td>
      <td>${c.platform}</td>
      <td style="color:var(--accent2)">${c.category}</td>
      <td><span class="diff-badge diff-${c.diff}">${c.diff.toUpperCase()}</span></td>
      <td class="status-${c.status}">${c.status === "solved" ? "✓ SOLVED" : "⟳ IN PROGRESS"}</td>
    </tr>
  `).join("");
}

/* ============================================================
   RENDER — SKILLS
   ============================================================ */
function renderSkills() {
  const renderBars = (id, skills) => {
    document.getElementById(id).innerHTML = skills.map(s => `
      <div class="skill-bar-item">
        <div class="skill-bar-label">
          <span class="skill-name">${s.name}</span>
          <span class="skill-pct">${s.pct}%</span>
        </div>
        <div class="skill-bar-track">
          <div class="skill-bar-fill" data-pct="${s.pct}" style="width:0%"></div>
        </div>
      </div>
    `).join("");
  };
  renderBars("offensiveSkills", OFFENSIVE_SKILLS);
  renderBars("webSkills",       WEB_SKILLS);

  document.getElementById("toolsGrid").innerHTML  = TOOLS.map(t=>`<div class="tool-tag">${t}</div>`).join("");
  document.getElementById("certsList").innerHTML  = CERTS.map(c=>`
    <div class="cert-item">
      <span class="cert-icon">${c.icon}</span>
      <div>
        <div class="cert-name">${c.name}</div>
        <div class="cert-issuer">${c.issuer}</div>
      </div>
    </div>
  `).join("");
}

/* ============================================================
   SKILL BAR ANIMATION (scroll-triggered)
   ============================================================ */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll(".skill-bar-fill").forEach(bar => {
        bar.style.width = bar.dataset.pct + "%";
      });
    }
  });
}, { threshold: 0.3 });

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCounters() {
  document.querySelectorAll(".stat-num").forEach(el => {
    const target = parseInt(el.dataset.count);
    let current  = 0;
    const step   = target / 40;
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}

/* ============================================================
   FILTER BUTTONS
   ============================================================ */
document.addEventListener("click", e => {
  if (e.target.classList.contains("filter-btn")) {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    renderWriteups(e.target.dataset.filter);
  }
});

/* ============================================================
   NAV ACTIVE STATE
   ============================================================ */
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
      const a = document.querySelector(`.nav-link[data-section="${e.target.id}"]`);
      if (a) a.classList.add("active");
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll("section[id]").forEach(s => navObserver.observe(s));

/* ============================================================
   MOBILE NAV
   ============================================================ */
document.getElementById("navToggle").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("open");
});

/* Smooth scroll for nav links without # */
document.querySelectorAll(".nav-link, .btn-primary, .btn-secondary").forEach(link => {
  link.addEventListener("click", e => {
    const href = link.getAttribute("href");
    const section = document.getElementById(href);
    if (section) {
      e.preventDefault();
      section.scrollIntoView({ behavior: "smooth" });
      document.querySelector(".nav-links").classList.remove("open");
    }
  });
});

/* ============================================================
   CONTACT FORM
   ============================================================ */
document.getElementById("sendBtn").addEventListener("click", async () => {
  const name   = document.getElementById("contactName").value.trim();
  const email  = document.getElementById("contactEmail").value.trim();
  const msg    = document.getElementById("contactMsg").value.trim();
  const status = document.getElementById("formStatus");

  if (!name || !email || !msg) {
    status.textContent = "// ERROR: All fields required.";
    status.style.color = "var(--accent3)";
    return;
  }

  status.textContent = "// Transmitting...";
  status.style.color = "var(--accent4)";

  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, email, message: msg }),
    });
    if (res.ok) {
      status.textContent = "// Message transmitted successfully. ✓";
      status.style.color = "var(--accent)";
      document.getElementById("contactName").value  = "";
      document.getElementById("contactEmail").value = "";
      document.getElementById("contactMsg").value   = "";
    } else {
      status.textContent = "// Server error. Try again.";
      status.style.color = "var(--accent3)";
    }
  } catch {
    status.textContent = "// Network error — backend unreachable.";
    status.style.color = "var(--accent3)";
  }
});

/* ============================================================
   FOOTER CLOCK
   ============================================================ */
function updateTime() {
  document.getElementById("footerTime").textContent =
    new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";
}

/* ============================================================
   UTILITIES
   ============================================================ */
const sleep     = ms => new Promise(r => setTimeout(r, ms));
const timestamp = () => new Date().toTimeString().substring(0, 8);

/* ============================================================
   INIT
   ============================================================ */
async function init() {
  await runBoot();

  renderProjects();
  renderWriteups();
  renderCTF();
  renderSkills();
  updateTime();
  setInterval(updateTime, 1000);

  const skillsSection = document.getElementById("skills");
  if (skillsSection) skillObserver.observe(skillsSection);

  const heroObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); heroObserver.disconnect(); }
  }, { threshold: 0.5 });
  heroObserver.observe(document.getElementById("home"));

  setTimeout(runTerminal, 600);
}

document.addEventListener("DOMContentLoaded", init);