# Folio 2025 v2 — Modification Plan
> Source: brunosimon/folio-2025 @ 41046b5 (Remove 2026 Easter)
> Created: 2026-08-22

---

## Overview

Modifikasi Bruno Simon's 3D portfolio (Three.js + WebGPU + Rapier physics + Vite) untuk personal portfolio Ilhan Awafi (defhanpy). Semua perubahan di bawah ini pernah dikerjakan sebelumnya tapi hilang karena tidak pernah di-commit ke git.

---

## 1. Meta & Branding

**File:** `sources/index.html`

**Yang diubah:**
- `<title>` → "Ilhan Awafi — Portfolio | Backend Engineer & Fullstack Developer"
- `<meta name="description">` → deskripsi spesifik (nama + kampus + projects)
- `<meta name="keywords">` → 12 terms (Ilhan Awafi, portfolio, backend, fullstack, dll)
- `<link rel="canonical">` → `https://defhanpy.dev/`
- `<link rel="alternate" hreflang>` → `en`, `id`, `x-default`
- OG tags: `og:title`, `og:description`, `og:url` → `https://defhanpy.dev/`
- Twitter tags: `twitter:title`, `twitter:description`, `twitter:url`
- JSON-LD Person schema (name, url, sameAs GitHub/LinkedIn/IG/TikTok)
- Hapus Google Analytics (jika ada)
- Apple mobile web app title → "Defhanpy"

---

## 2. Personal Data

### 2a. Social Links
**File:** `sources/data/social.js`

**Yang diubah:**
- X → `https://x.com/defhanpy`
- GitHub → `https://github.com/defhanpy`
- LinkedIn → `https://www.linkedin.com/in/ilhanawafi/`
- Instagram → `https://www.instagram.com/defhanpy/`
- Email → `mailto:ilhanawafi1@gmail.com`
- Bluesky, Youtube, Twitch, Discord → landing setiap platform sosmed tersebut

### 2b. Console Log
**File:** `sources/data/consoleLog.js`

**Yang diubah:**
- ASCII art: "DEFHANPY PORTFOLIO" (ganti "BRUNO PORTFOLIO")
- Socials section: update links ke defhanpy
- Intro text: personalisasi
- Keep: Three.js credit, debug info, source code link

### 2c. Home Content
**File:** `sources/index.html`

**Yang diubah:**
- Nama: "Ilhan Awafi"
- Role: "Backend Engineer and AI Enthusiast"
- Deskripsi: personal intro

---

## 3. Projects

**File:** `sources/data/projects.js`

**Yang diubah:**
- Hapus semua project Bruno
- Ganti dengan 9 project Ilhan (urutan sesuai prioritas):
  1. Sipadu ITSM — internal (#)
  2. Sister UIJ — internal (#)
  3. API Development — internal (#)
  4. SBR Distributor
  5. Water Monitoring
  6. RSS Drying System
  7. Madju Jaya
  8. PMB UIJ
  9. PMB ITSM

**Format per project:**
```js
{
    title: 'Short Name',           // max ~15 char, tampil di billboard 3D
    titleSmall: ['Line1', 'Line2'], // side signs
    url: 'https://...',            // '#' = internal only
    attributes: { role: '...', at: '...' },
    distinctions: [],
    images: ['name.ktx', ...]      // KTX format
}
```

**File:** `sources/Game/World/Areas/ProjectsArea.js`

**Yang diubah:**
- Handle internal URL `#` → tampilkan "Internal Only", disable click
- Patch di ~line 1022: `const urlText = url === '#' ? 'Internal Only' : url.replace(...)`
- Patch di ~line 1033: `if(url && url !== '#')` guard click

**Images:** `static/projects/images/`
- Convert semua screenshot ke KTX (960x540)
- File: sipadu-1/2/3.ktx, sister-1/2/3.ktx, api-1.ktx, sbr-landing.ktx, water-monitoring-1.ktx, Record-Pengasapan.ktx, madjujaya.ktx, pmb-uij.ktx, pmb-itsm.ktx

---

## 4. Lab → Certifications

**File:** `sources/data/lab.js`

**Yang diubah:**
- Hapus semua lab Bruno
- Ganti dengan 6 sertifikasi:
  1. Junior Web Developer — BNSP (2025)
  2. Water Innovation Challenge — Perumdam (2023)
  3. Javascript Basic — Dicoding (2023)
  4. Smart Detection YOLO — DK3P Jatim (2026)
  5. Computer Network Fundamental — Udemy (2023)
  6. Python Programmer 2025 — Udemy (2025)

**Format:**
```js
{
    title: 'Cert Name',
    description: 'Description',
    url: 'https://...',
    urlDisplay: 'short.label',  // optional, untuk billboard
    image: 'name.ktx',         // null jika tidak ada
    imageMini: 'name-mini.ktx' // null jika tidak ada
}
```

**File:** `sources/Game/Map.js`
- Portal rename: "Lab" → "Certifications"

**File:** `sources/Game/World/Areas/LabArea.js`
- Handle `image: null` (3 tempat: loadSibling, images.update, mini.startLoading)
- `urlDisplay` support: `this.url.textCanvas.updateText(urlDisplay || url.replace(...))`

**Images:** `static/lab/images/`
- Convert ke KTX (960x540) + mini thumbnails

---

## 5. Achievements

**File:** `sources/data/achievements.js`
- Keep Bruno's 38 achievements (user milih keep)

**File:** `sources/Game/Achievements.js`
- Translate names & descriptions ke Indonesian
- Translate reset button states (confirm, definitely, done)
- Translate unlock tooltip

**i18n keys:** `ach_${name}_${total}_name` + `ach_${name}_${total}_desc` (76 keys total)

---

## 6. Favicon

**Directory:** `static/favicons/`
- Ganti semua favicon Bruno → logo Defhanpy
- Files: favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, dll

---

## 7. Server Features (disable/strip)

**File:** `sources/Game/World/World.js`
- Guard Whispers init: `if(import.meta.env.VITE_SERVER_URL) this.whispers = new Whispers()`

**File:** `sources/index.html`
- Hide whispers nav button: `style="display:none"`
- Hide whispers preview: `style="display:none"`
- Hide whispers content: `style="display:none"`

**Tidak perlu ubah:**
- Circuit leaderboard — sudah hidden via `.online-element` CSS
- Circuit race — works locally
- Easter/Tornado/Cookie — no server = no messages = safe

---

## 8. Career Timeline

**File:** `sources/Game/World/Areas/CareerArea.js`

**Yang diubah:**
- `year.start = 2008` → `2018`
- `year.span = 17` → `8` (2018-2026)
- `year.size = 17` (tetap, untuk Z distance mapping)
- Formula: `yearCurrent = 2018 + floor(offset * 8 / 17)`

**Textures:** `static/career/`
- 6 PNG + 6 KTX (240×60px, Press Start 2P font, red title + white subtitle)
- Filename mapping (GLB expects these names):
  - careerHetic → THE BEGINNING / FIRST STEPS IN TECH
  - careerFreelancer → IT MINDSET / LEARN, ADAPT, INNOVATE
  - careerUzik → EXPLORATION / EXPLORING TECH WORLD
  - careerIRLTeacher → THE IT JOURNEY / BUILDING FOUNDATION
  - careerImmersiveGarden → GROWTH / SKILLS IN PRACTICE
  - careerOnlineTeacher → PROFESSIONAL JOURNEY / IT PRO PATH

**File:** `sources/Game/Game.js`
- Resource entries untuk career textures (lines ~166-171)

---

## 9. Tech Stack

**File:** `sources/Game/Map.js`
- Portal rename: "Behind the Scene" → "Tech Stack"

**File:** `sources/Game/World/Areas/BehindTheSceneArea.js`
- Portal label: "Tech Stack"

**File:** `sources/index.html`
- Replace Behind the Scene content dengan Tech Stack:
  - Languages: Python, Go, JavaScript, PHP, SQL
  - Frameworks: Laravel, Express.js, Gin, Three.js, Next.js
  - Tools: Docker, Git, Linux, Nginx, PostgreSQL, Redis
  - Other: REST APIs, WebSocket, IoT, Microservices
- Signed: "— Ilhan Awafi"
- Credit Bruno Simon di bottom home page

---

## 10. i18n (EN/ID)

### 10a. translations.js
**File:** `sources/i18n/translations.js` (NEW)

~190 keys per language. Categories:
- `home*` — welcome, intro, description, fun, credit
- `options*` — title, audio, quality, stuck, respawn, reset, renderer, server status
- `controls*` — tab names, key descriptions, mobile controls
- `circuit*` — title, offline, no-score, restart, end, controls, your-time, sorry, submit
- `tech*` — title, description, languages, frameworks, tools, other
- `whispers*` — title, description, your-message (disabled tapi tetap translate)
- `map_*` — pin names (achievements, lab, career, dll)
- `portal_*` — 15 portal labels
- `ach_*_name` + `ach_*_desc` — 76 achievement keys
- Touch buttons: interact, unstuck

**Style:** Casual Indonesian, "aku" bukan "saya", singkat, playful.

### 10b. LanguageToggle.js
**File:** `sources/i18n/LanguageToggle.js` (NEW)

Exports:
- `initLanguageToggle()` — create button + apply initial lang
- `getCurrentLanguage()` — returns 'en' or 'id'
- `setLanguage(lang)` — programmatic switch
- Re-export `translations` (CRITICAL: tanpa ini, import di Options.js/Achievements.js/Map.js fail)

Button: fixed position, top-right (right: 60px), dark semi-transparent, z-index 1000. Shows opposite lang code. Saves to localStorage('language'). Dispatches languagechange CustomEvent.

### 10c. HTML Integration
**File:** `sources/index.html`
- `data-i18n="key"` pada ~80+ elements (textContent)
- `data-i18n-html="key"` untuk elements dengan `<strong>`, `<a>` tags
- `data-i18n-placeholder="key"` untuk input placeholders

### 10d. Game Integration
**File:** `sources/Game/Map.js`
- Import getCurrentLanguage, translations
- Translate pin names di setLocations()
- Add languagechange listener untuk dynamic update

**File:** `sources/Game/Achievements.js`
- Import i18n
- Translate names, descriptions, reset button states

**File:** `sources/Game/Options.js`
- Import i18n
- Translate server status, quality toggle, renderer tooltip

**File:** `sources/Game/InteractivePoints.js`
- Add `translationKey` parameter ke create() (9th arg)
- Store canvas/texture references per item
- `updateLabels()` method — dispose/recreate texture + rebuild TSL material
- languagechange listener

**File:** `sources/index.js`
- Import + call `initLanguageToggle()` sebelum `new Game()`

### 10e. All 15 Area Files
Pass `translationKey` sebagai 9th arg ke `interactivePoints.create()`:
- AchievementsArea.js
- BehindTheSceneArea.js
- BowlingArea.js (3 calls)
- CareerArea.js
- CircuitArea.js
- CookieArea.js
- EasterArea.js
- LabArea.js
- LandingArea.js (3 calls)
- ProjectsArea.js
- SocialArea.js
- TimeMachineArea.js

---

## 11. Landing Area

**File:** `sources/Game/World/Areas/LandingArea.js`

**Yang diubah:**
- Hide "BRUNO SIMON" 3D letters: `reference.visible = false` di setLetters() loop
- Physics colliders tetap aktif (harmless, letters invisible)

---

## 12. Git & Deploy

- [ ] Commit semua perubahan ke local main
- [ ] Force push ke `defhanpy/folio-2025-v2` (GitHub)
- [ ] Vercel deploy: `vercel deploy --prod --name folio-v2 --yes`
- [ ] Verify live di `folio-v2-zeta.vercel.app`