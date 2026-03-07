/* === DATA === */
const PROJECTS = [
  {
    tag: "TOOL // PYTHON",
    title: "AutoRecon-NG",
    desc: "Automated reconnaissance framework that chains nmap, gobuster, nikto and more. Outputs structured reports in JSON/HTML.",
    stack: ["Python", "Nmap", "Gobuster", "MongoDB"],
    github: "#", demo: "#"
  },
  {
    tag: "TOOL // WEB",
    title: "SQLi Hunter",
    desc: "Automated SQL injection detection and exploitation tool with support for blind, time-based and union-based attacks.",
    stack: ["Python", "BeautifulSoup", "Requests", "Flask"],
    github: "#", demo: "#"
  },
  {
    tag: "PLATFORM // FULLSTACK",
    title: "CTF Tracker Dashboard",
    desc: "Personal dashboard to track CTF progress, flag submissions, writeup drafts and skill heatmaps across multiple platforms.",
    stack: ["React", "FastAPI", "MongoDB", "TailwindCSS"],
    github: "#", demo: "#"
  },
  {
    tag: "TOOL // NETWORK",
    title: "PacketSniffer Pro",
    desc: "Lightweight packet capture and analysis tool with protocol dissection and export to PCAP. Built with Scapy.",
    stack: ["Python", "Scapy", "Tkinter", "SQLite"],
    github: "#", demo: "#"
  },
  {
    tag: "TOOL // OSINT",
    title: "SocialGhost",
    desc: "OSINT aggregator that pivots from a username across 300+ platforms, generates relationship graphs and exports reports.",
    stack: ["Python", "Neo4j", "FastAPI", "JS"],
    github: "#", demo: "#"
  },
  {
    tag: "SCRIPT // CRYPTO",
    title: "CipherBreaker",
    desc: "Classical cipher analysis toolkit supporting Vigenere, Caesar, ROT13, XOR and frequency analysis with auto-detect.",
    stack: ["Python", "NumPy", "Flask"],
    github: "#", demo: "#"
  },
];

const WRITEUPS = [
  { platform: "tryhackme", platformLabel: "TryHackMe", title: "Mr. Robot CTF — Full Walkthrough", excerpt: "Root the machine inspired by Mr. Robot. Covers WordPress exploitation, privilege escalation via SUID binaries.", date: "2024-12-15", diff: "medium" },
  { platform: "portswigger", platformLabel: "PortSwigger", title: "SQL Injection — UNION Attack Lab", excerpt: "Step-by-step exploitation of a UNION-based SQL injection to extract database contents from the backend.", date: "2024-12-10", diff: "easy" },
  { platform: "daily", platformLabel: "Daily", title: "Understanding SSRF in Cloud Environments", excerpt: "Server-Side Request Forgery attacks targeting AWS metadata endpoints. Real-world case studies and mitigations.", date: "2024-12-08", diff: "hard" },
  { platform: "picoctf", platformLabel: "PicoCTF", title: "Forensics: Wireshark doo dooo", excerpt: "Network traffic analysis challenge. Filtering HTTP streams, following TCP, extracting credentials from cleartext.", date: "2024-12-05", diff: "easy" },
  { platform: "tryhackme", platformLabel: "TryHackMe", title: "Blue — EternalBlue MS17-010", excerpt: "Classic Windows exploitation using the NSA EternalBlue exploit. SMB exploitation and Meterpreter post-exploitation.", date: "2024-12-01", diff: "medium" },
  { platform: "portswigger", platformLabel: "PortSwigger", title: "XSS: DOM-Based Vulnerabilities", excerpt: "Exploiting DOM sinks in JavaScript code. Bypassing WAF filters and chaining with CSRF for account takeover.", date: "2024-11-28", diff: "hard" },
  { platform: "daily", platformLabel: "Daily", title: "Active Directory Attack Paths", excerpt: "Kerberoasting, AS-REP Roasting and Pass-the-Hash attacks in a simulated enterprise Active Directory environment.", date: "2024-11-25", diff: "hard" },
  { platform: "picoctf", platformLabel: "PicoCTF", title: "Binary Exploitation: Buffer Overflow 1", excerpt: "Classic stack buffer overflow to overwrite return address and redirect execution to win function.", date: "2024-11-20", diff: "medium" },
];

const CTF_CHALLENGES = [
  { id: "001", name: "Pickle Rick", platform: "TryHackMe", category: "Web / LFI", diff: "easy", status: "solved" },
  { id: "002", name: "SQL Injection UNION (Lab 1)", platform: "PortSwigger", category: "SQLi", diff: "easy", status: "solved" },
  { id: "003", name: "Wireshark doo dooo", platform: "PicoCTF", category: "Forensics", diff: "easy", status: "solved" },
  { id: "004", name: "Buffer Overflow 1", platform: "PicoCTF", category: "Binary Exploit", diff: "medium", status: "solved" },
  { id: "005", name: "XSS DOM-Based", platform: "PortSwigger", category: "XSS", diff: "hard", status: "solved" },
  { id: "006", name: "Mr. Robot", platform: "TryHackMe", category: "Web / PrivEsc", diff: "medium", status: "solved" },
  { id: "007", name: "Blind SQLi Time-Based", platform: "PortSwigger", category: "SQLi", diff: "hard", status: "progress" },
  { id: "008", name: "ROP Emporium ret2win", platform: "PicoCTF", category: "Binary Exploit", diff: "hard", status: "progress" },
];

const OFFENSIVE_SKILLS = [
  { name: "Penetration Testing", pct: 85 },
  { name: "Network Exploitation", pct: 78 },
  { name: "Privilege Escalation", pct: 82 },
  { name: "Reverse Engineering", pct: 65 },
];
const WEB_SKILLS = [
  { name: "SQL Injection", pct: 90 },
  { name: "XSS / CSRF", pct: 88 },
  { name: "SSRF / XXE", pct: 75 },
  { name: "Auth Bypass", pct: 80 },
];
const TOOLS = ["Burp Suite","Metasploit","Nmap","Wireshark","Gobuster","Hashcat","SQLMap","Hydra","John","Ghidra","pwndbg","BloodHound"];
const CERTS = [
  { icon: "🏆", name: "eJPT", issuer: "eLearnSecurity" },
  { icon: "🔐", name: "Google Cybersecurity", issuer: "Google / Coursera" },
  { icon: "🎯", name: "TryHackMe – Hacker", issuer: "TryHackMe" },
  { icon: "🕸️", name: "Web Security – Expert", issuer: "PortSwigger Academy" },
];

/* === BOOT SEQUENCE === */
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

/* === HERO TERMINAL === */
const terminalLines = [
  { text: "kali@0xH4X:~$ whoami", delay: 200, color: "#00ff88" },
  { text: "0xH4X — Security Researcher", delay: 400 },
  { text: "kali@0xH4X:~$ cat skills.txt", delay: 800, color: "#00ff88" },
  { text: "► Web Application Pentesting", delay: 300 },
  { text: "► Network Exploitation", delay: 200 },
  { text: "► CTF Challenges (TryHackMe, PortSwigger, PicoCTF)", delay: 200 },
  { text: "► Python Tooling & Automation", delay: 200 },
  { text: "kali@0xH4X:~$ ls writeups/", delay: 800, color: "#00ff88" },
  { text: "tryhackme/  portswigger/  picoctf/  daily/", delay: 300, color: "#00cfff" },
  { text: "kali@0xH4X:~$ echo $STATUS", delay: 700, color: "#00ff88" },
  { text: "Actively learning. Always hacking. ✓", delay: 300, color: "#ffaa00" },
  { text: "kali@0xH4X:~$ █", delay: 600, color: "#00ff88" },
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

/* === RENDER FUNCTIONS === */
function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  grid.innerHTML = PROJECTS.map(p => `
    <div class="project-card">
      <div class="project-links">
        <a href="${p.github}" class="project-link-btn">GH</a>
        <a href="${p.demo}" class="project-link-btn">↗</a>
      </div>
      <div class="project-tag">${p.tag}</div>
      <div class="project-title">${p.title}</div>
      <div class="project-desc">${p.desc}</div>
      <div class="project-stack">${p.stack.map(s => `<span class="stack-tag">${s}</span>`).join("")}</div>
    </div>
  `).join("");
}

function renderWriteups(filter = "all") {
  const grid = document.getElementById("writeupsGrid");
  const data = filter === "all" ? WRITEUPS : WRITEUPS.filter(w => w.platform === filter);
  grid.innerHTML = data.map(w => `
    <div class="writeup-card">
      <div class="writeup-meta">
        <span class="writeup-platform platform-${w.platform === "tryhackme" ? "thm" : w.platform === "portswigger" ? "ps" : w.platform === "picoctf" ? "pico" : "daily"}">${w.platformLabel}</span>
        <span class="writeup-date">${w.date}</span>
      </div>
      <div class="writeup-title">${w.title}</div>
      <div class="writeup-excerpt">${w.excerpt}</div>
      <div class="writeup-diff diff-${w.diff}">
        <div class="diff-dot"></div>
        <span class="diff-label">${w.diff.toUpperCase()}</span>
      </div>
    </div>
  `).join("");
}

function renderCTF() {
  const body = document.getElementById("ctfTableBody");
  body.innerHTML = CTF_CHALLENGES.map(c => `
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

function renderSkills() {
  const renderBars = (containerId, skills) => {
    document.getElementById(containerId).innerHTML = skills.map(s => `
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
  renderBars("webSkills", WEB_SKILLS);

  document.getElementById("toolsGrid").innerHTML = TOOLS.map(t => `<div class="tool-tag">${t}</div>`).join("");

  document.getElementById("certsList").innerHTML = CERTS.map(c => `
    <div class="cert-item">
      <span class="cert-icon">${c.icon}</span>
      <div>
        <div class="cert-name">${c.name}</div>
        <div class="cert-issuer">${c.issuer}</div>
      </div>
    </div>
  `).join("");
}

/* === SKILL BAR ANIMATION === */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll(".skill-bar-fill").forEach(bar => {
        bar.style.width = bar.dataset.pct + "%";
      });
    }
  });
}, { threshold: 0.3 });

/* === COUNT UP === */
function animateCounters() {
  document.querySelectorAll(".stat-num").forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}

/* === FILTERS === */
document.addEventListener("click", e => {
  if (e.target.classList.contains("filter-btn")) {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    renderWriteups(e.target.dataset.filter);
  }
});

/* === NAV ACTIVE STATE === */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove("active"));
      const active = document.querySelector(`.nav-link[data-section="${e.target.id}"]`);
      if (active) active.classList.add("active");
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navObserver.observe(s));

/* === MOBILE NAV === */
document.getElementById("navToggle").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("open");
});

/* === CONTACT FORM === */
document.getElementById("sendBtn").addEventListener("click", async () => {
  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const msg = document.getElementById("contactMsg").value.trim();
  const status = document.getElementById("formStatus");

  if (!name || !email || !msg) {
    status.textContent = "// ERROR: All fields required.";
    status.style.color = "var(--accent3)";
    return;
  }

  status.textContent = "// Transmitting...";
  status.style.color = "var(--accent4)";

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message: msg })
    });
    if (res.ok) {
      status.textContent = "// Message transmitted successfully. ✓";
      status.style.color = "var(--accent)";
      document.getElementById("contactName").value = "";
      document.getElementById("contactEmail").value = "";
      document.getElementById("contactMsg").value = "";
    } else {
      status.textContent = "// Server error. Try again.";
      status.style.color = "var(--accent3)";
    }
  } catch {
    status.textContent = "// Network error — check backend server.";
    status.style.color = "var(--accent3)";
  }
});

/* === FOOTER TIME === */
function updateTime() {
  document.getElementById("footerTime").textContent = new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";
}

/* === UTILITIES === */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const timestamp = () => new Date().toTimeString().substring(0, 8);

/* === INIT === */
async function init() {
  await runBoot();
  renderProjects();
  renderWriteups();
  renderCTF();
  renderSkills();
  updateTime();
  setInterval(updateTime, 1000);

  // Observe skills section
  const skillsSection = document.getElementById("skills");
  if (skillsSection) skillObserver.observe(skillsSection);

  // Counter animation on hero visible
  const heroObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); heroObserver.disconnect(); }
  }, { threshold: 0.5 });
  heroObserver.observe(document.getElementById("home"));

  // Run terminal after boot
  setTimeout(runTerminal, 600);
}

document.addEventListener("DOMContentLoaded", init);
