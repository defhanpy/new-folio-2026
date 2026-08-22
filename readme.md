# Ilhan Awafi — 3D Portfolio 2026

![image info](./static/social/share-image.png)

Portfolio 3D interaktif berbasis **Three.js WebGPU** + **Rapier Physics** dengan backend real-time **Go WebSocket** + **PostgreSQL**. Dikustomisasi dari [Bruno Simon's folio-2025](https://github.com/brunosimon/folio-2025).

**Live:** [defhanpy.dev](https://defhanpy.dev)

---

## Tech Stack

**Frontend:**
- Three.js 0.183 (WebGPU renderer + TSL node materials)
- Rapier3D (WASM physics engine)
- Vite 7 (build tool)
- GSAP (animation)
- Howler.js (spatial audio)
- msgpack-lite (binary serialization)

**Backend:**
- Go 1.22 + gorilla/websocket
- PostgreSQL 16
- msgpack v5 (binary protocol)
- Docker Compose

---

## Features

- **3D World** — navigasi interaktif dengan mobil, terrain, cuaca dinamis (hujan/salju/petir), day/night cycle
- **Whispers** — visitor bisa tinggalkan pesan di posisi 3D (max 30, real-time sync)
- **Circuit Leaderboard** — balapan mobil + leaderboard global (reset harian UTC)
- **Cookie Counter** — counter klik global sinkron live
- **Cataclysm** — event tornado komunal
- **13 World Areas** — Projects, Certifications, Career, Social, Bowling, Achievements, dll
- **i18n** — Bahasa Indonesia + English
- **35+ Achievements** — unlock vehicle skins
- **Gamepad + Touch** support

---

## Project Structure

```
new-folio-2026/
├── sources/              # Frontend source
│   ├── index.html        # Single-page HTML (UI, menu, modals)
│   ├── index.js          # Entry point
│   ├── Game/
│   │   ├── Game.js       # Singleton orchestrator
│   │   ├── Server.js     # WebSocket client (msgpack)
│   │   ├── Menu.js       # Hamburger menu
│   │   ├── World/
│   │   │   ├── Whispers.js
│   │   │   └── Areas/    # 13+ interactive areas
│   │   └── ...
│   ├── data/             # projects, lab, achievements, social
│   └── i18n/             # translations.js, LanguageToggle.js
├── server/               # Go WebSocket backend
│   ├── main.go           # HTTP server + WS upgrade
│   ├── hub.go            # Client management + message routing
│   ├── db.go             # PostgreSQL CRUD + migrations
│   ├── models.go         # Message type structs
│   ├── Dockerfile        # Multi-stage build
│   └── docker-compose.yml
├── static/               # GLB models, textures, sounds, UI
├── resources/            # Source files (PSD, EXR, GarageBand)
├── docs/                 # Documentation
├── .env                  # Environment variables
├── .env.example          # Template
├── vite.config.js        # Vite configuration
└── package.json
```

---

## Local Development

### Prerequisites

- Node.js 20+
- Docker + Docker Compose
- Go 1.22+ (opsional, kalau mau run backend tanpa Docker)

### 1. Clone & Install

```bash
git clone https://github.com/defhanpy/new-folio-2026.git
cd new-folio-2026
npm install --legacy-peer-deps
```

### 2. Setup Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SERVER_URL=ws://localhost:8006/ws
VITE_WHISPERS_COUNT=30
VITE_MUSIC=1
VITE_LOG=1
```

> **Note:** Kalau akses dari device lain di network, ganti `localhost` dengan IP server (contoh: `ws://192.168.1.9:8006/ws`).

### 3. Start Backend (Docker)

```bash
cd server
docker compose up -d --build
```

Ini akan jalankan:
- **PostgreSQL** di port `5433` (mapped dari container `5432`)
- **WebSocket server** di port `8006` (mapped dari container `8080`)

Health check:
```bash
curl http://localhost:8006/
# → {"status":"online","service":"defhanpy-folio-websocket"}
```

### 4. Start Frontend

```bash
npm run dev
```

Buka `http://localhost:5173` (atau port yang Vite pilih).

### 5. Verify Connection

- Buka hamburger menu → **Circuit** → harusnya leaderboard muncul (bukan "Server offline")
- Buka hamburger menu → **Whispers** → form input harus muncul
- Buka browser console → cek class `is-server-online` di `<html>`

---

## Backend API (WebSocket)

**Endpoint:** `ws://localhost:8006/ws`
**Protocol:** Binary (msgpack), bukan JSON

### Incoming Messages (Client → Server)

| Type | Fields | Description |
|------|--------|-------------|
| `whispersInsert` | uuid, message, countryCode, x, y, z | Place whisper di 3D space |
| `circuitInsert` | uuid, tag (3 char), countryCode, duration | Submit lap time |
| `cookiesInsert` | amount | Increment cookie counter |
| `cataclysmInsert` | — | Increment cataclysm counter |

### Outgoing Messages (Server → All Clients)

| Type | Fields | Trigger |
|------|--------|---------|
| `init` | whispers[], circuitLeaderboard[], cookiesCount, cataclysmCount, cataclysmProgress | Client connect |
| `whispersInsert` | whispers[] | New whisper placed |
| `circuitUpdate` | circuitLeaderboard[] | New lap submitted |
| `cookiesUpdate` | cookiesCount | Cookie clicked |
| `cataclysmUpdate` | cataclysmCount, cataclysmProgress | Cataclysm incremented |

### Database Schema

```sql
-- Whisper messages
CREATE TABLE whispers (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(64),
    message VARCHAR(255) NOT NULL,
    country_code VARCHAR(8) DEFAULT '',
    x DOUBLE PRECISION, y DOUBLE PRECISION, z DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Racing leaderboard
CREATE TABLE circuit_scores (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(64),
    tag VARCHAR(8) NOT NULL,
    country_code VARCHAR(8) DEFAULT '',
    duration INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Global counters
CREATE TABLE counters (
    key VARCHAR(64) PRIMARY KEY,
    value BIGINT DEFAULT 0
);
```

---

## Deploy Frontend ke Vercel

### Option A: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Build
npm run build

# Deploy (preview)
vercel deploy

# Deploy (production)
vercel deploy --prod
```

### Option B: Via Vercel Dashboard

1. Push repo ke GitHub
2. Buka [vercel.com/new](https://vercel.com/new)
3. Import repo `defhanpy/new-folio-2026`
4. Settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install --legacy-peer-deps`
5. Environment Variables:
   ```
   VITE_SERVER_URL=wss://api.defhanpy.dev/ws
   VITE_WHISPERS_COUNT=30
   VITE_MUSIC=1
   VITE_COMPRESSED=1
   ```
6. Deploy

### Option C: Auto-deploy dari GitHub

1. Connect repo ke Vercel (Option B step 1-5)
2. Setiap push ke `main` → auto deploy
3. Preview deploy per PR

### Custom Domain

1. Vercel Dashboard → Project → Settings → Domains
2. Tambah `defhanpy.dev`
3. Update DNS records sesuai instruksi Vercel

### Build Optimization

```bash
# Compress GLB models & textures (GPU-friendly KTX/ETC1S)
npm run compress

# Build production
npm run build
```

> **Important:** Set `VITE_COMPRESSED=1` di Vercel agar load compressed assets (`.ktx2`, compressed `.glb`).

---

## Deploy Backend (Production)

Backend perlu server sendiri (VPS/cloud) karena WebSocket + PostgreSQL.

### Option A: Docker Compose di VPS

```bash
# SSH ke VPS
ssh user@your-vps

# Clone repo
git clone https://github.com/defhanpy/new-folio-2026.git
cd new-folio-2026/server

# Build & run
docker compose up -d --build
```

### Option B: Railway / Fly.io

1. Push server/ ke repo terpisah (atau monorepo)
2. Connect ke Railway/Fly.io
3. Set environment variables:
   ```
   PORT=8080
   DATABASE_URL=postgres://user:pass@host:5432/folio_db?sslmode=disable
   ```
4. Tambah PostgreSQL addon

### Reverse Proxy (Nginx)

```nginx
server {
    listen 443 ssl;
    server_name api.defhanpy.dev;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /ws {
        proxy_pass http://localhost:8006;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }

    location / {
        proxy_pass http://localhost:8006;
    }
}
```

Update frontend `.env`:
```
VITE_SERVER_URL=wss://api.defhanpy.dev/ws
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_SERVER_URL` | — | WebSocket backend URL (`ws://` atau `wss://`) |
| `VITE_WHISPERS_COUNT` | `30` | Max whispers yang ditampilkan |
| `VITE_MUSIC` | `1` | Enable background music |
| `VITE_LOG` | `1` | Enable console logging |
| `VITE_COMPRESSED` | — | Set `1` untuk load compressed assets |
| `VITE_GAME_PUBLIC` | — | Public game mode |
| `VITE_DAY_CYCLE_PROGRESS` | — | Force day cycle position (0-1) |
| `VITE_YEAR_CYCLE_PROGRESS` | — | Force year cycle position (0-1) |
| `VITE_PLAYER_SPAWN` | — | Override spawn area |
| `VITE_ANALYTICS_TAG` | — | Google Analytics tag |

---

## Credits

Based on [Bruno Simon's folio-2025](https://github.com/brunosimon/folio-2025) (MIT License).
Customized and extended by [Ilhan Awafi](https://github.com/defhanpy).

---

## License

MIT License — see [license.md](./license.md)
