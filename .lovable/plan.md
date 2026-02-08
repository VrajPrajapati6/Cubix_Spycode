

# 🎮 Cubix: Spycode — Minecraft-Themed Scoreboard Website

## Overview
A Minecraft-themed live scoreboard website for Team CSI's "Spycode" event, featuring 3 round scoreboards and an admin panel. Built with React + Vite + Tailwind + Supabase backend.

---

## 🎨 Design & Theme
- **Minecraft pixel aesthetic** using "Press Start 2P" and "Silkscreen" Google Fonts
- Blocky UI elements with stone/obsidian textures via CSS gradients and borders
- Color palette: **Green** (Skulls/scores), **Red** (Freeze/danger), **Blue** (Shields), **Gold** (Top ranks)
- Pixel-art borders, blocky buttons, XP-bar-style progress indicators
- Creeper/Redstone accents and animated particle effects

---

## 🌍 Public Pages (View Only)

### 1. Landing Page (`/`)
- Minecraft-style hero with event branding: **Cubix → Spycode**
- Three big blocky buttons linking to each round's scoreboard
- Animated pixel blocks/particles in the background

### 2. Round 1 Scoreboard (`/round1`)
- Simple leaderboard: Rank, Team ID, Team Name, Skulls
- Sorted by highest Skulls, auto-refreshes every 5-10 seconds

### 3. Round 2 Scoreboard (`/round2`)
- Same structure as Round 1 with visual emphasis on progression
- Rank, Team ID, Team Name, Skulls

### 4. Round 3 — Grand Finale Scoreboard (`/round3`) ⭐
- **Most visually dynamic page**
- Fields: Rank, Team ID, Team Name, Skulls, Firewall Shields (0-3 as shield icons), Freeze Status
- Status badges: **ACTIVE** (green), **FROZEN** (red with ❄️), **SHIELDED** (blue)
- Live freeze countdown timer (minutes:seconds) synced with backend timestamp
- Freeze timer persists across page refreshes
- Auto-refresh every 5 seconds

---

## 🛠️ Admin Panel (Private)

### Admin Login (`/admin`)
- Simple email/password login via Supabase Auth
- Admin role verified server-side using a `user_roles` table

### Admin Dashboard (`/admin/dashboard`)
- Tab navigation: **Round 1 | Round 2 | Round 3**
- Per-round controls:

**All Rounds:**
- ➕ Add Team (ID, Name, Starting Skulls)
- ✏️ Update Team: Add/Subtract Skulls
- ❌ Remove Team

**Round 3 Only (extra controls):**
- 🛡️ Increase/Decrease Shields (0-3)
- ❄️ Freeze Team for X minutes (stores freeze end timestamp in DB)

---

## 🗄️ Backend (Supabase)

### Database Tables
- **teams** — team_id, team_name, round (1/2/3), skulls, shields (round 3), freeze_until (timestamp, round 3)
- **user_roles** — for admin role verification

### Key Behaviors
- Scoreboards poll the database every 5-10 seconds for updates
- Freeze timer: admin sets duration → backend stores `freeze_until` timestamp → frontend calculates remaining time and auto-resets display when expired
- No websockets needed — simple polling

---

## 📱 Responsiveness
- Desktop-first design, responsive down to tablet/mobile for spectators viewing on phones

