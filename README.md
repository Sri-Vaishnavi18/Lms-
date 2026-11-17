# Frontline & Blue-Collar Learning Management System (LMS)
**Pure JavaScript / TypeScript Architecture (Node.js + Express & Next.js 14+ PWA)**

---

## 🚀 Quick Start Guide

To run both the **Backend API** and **Frontend Web/PWA Portals**, simply double-click:
* **`start-dev.bat`** (or run `.\start-dev.ps1` in PowerShell)

Or start each service manually in two separate terminal windows:

### Terminal 1: Backend Server (Node.js & Express)
```bash
cd backend
npm run dev
# Running at http://localhost:5000
```

### Terminal 2: Frontend Client (Next.js PWA & Portals)
```bash
cd frontend
npm run dev
# Running at http://localhost:3000
```

---

## 🔑 Pre-Seeded Demo Accounts & Credentials

The SQLite database (`backend/prisma/dev.db`) is already seeded with realistic frontline data:

| Role | Name | Phone Number | Badge ID | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Worker (Assembly)** | **Ramesh Kumar** | `+919876543210` | `BC-1001` | Pre-configured in Heavy Assembly, Hindi preferred. |
| **Worker (Logistics)** | **Suresh Patel** | `+919876543211` | `BC-1002` | Warehouse forklift operator. |
| **Worker (Welding)** | **Anil Verma** | `+919876543212` | `BC-1003` | Fabrication line operator. |
| **Shift Supervisor** | **David Miller** | `+919876543299` | `SUP-5001` | Shift Foreman (conducts morning Toolbox Talks). |
| **EHS Safety Lead** | **Sarah Jenkins** | `+919876543000` | `ADM-9001` | Corporate & Plant EHS Administrator. |

* **Demo SMS/WhatsApp OTP:** Enter `1234` for any phone number.

---

## 📱 Key Front-End Experiences & Engines

### ⚡ 1. YouTube Shorts Vertical Microlearning Engine (`/shorts` or `/worker/shorts`)
* **9:16 Fullscreen Vertical Snap-Scroll Feed:** Swipe up/down (or arrow keys) through bite-sized 45–60s video demonstrations.
* **11 Native Indian Languages Switcher:** Instant audio track switching (Hindi, Telugu, Tamil, Kannada, Marathi, Bengali, Gujarati, Malayalam, Odia, Punjabi, English) with speech synthesis and voiceover equalizer.
* **Interactive Floating Action Bar:**
  * **❤️ Like Button:** Social proof with live counter and animated heart burst.
  * **🎯 30-Sec Instant Quiz:** Pop-up micro-check right over the video with a 30s countdown clock, instant visual feedback, and +50 XP skill reward.
  * **💬 Ask Shift Foreman:** Voice note recorder for low-literacy workers with mother-tongue audio questions.
  * **📥 Offline Save:** 1-tap download into device IndexedDB for no-connectivity basement/site zones.
  * **🔄 Machine QR Share:** Shop-floor quick launch QR code.
* **Split-Screen Badging:** Interactive **Wrong Way ❌ vs. Right Way ✔️** visual alerts.

### 📚 2. Udemy & Coursera Standard Course Catalog & Player (`/courses` & `/courses/:id`)
* **Standardized 7-Sector Navigation:** Construction, Skilled Technical, Manufacturing, Logistics, Agriculture, Cleaning, Hospitality.
* **4-Skill Tier Progression:** Tier 1 (Unskilled), Tier 2 (Semi-Skilled), Tier 3 (Skilled), Tier 4 (Highly-Skilled).
* **Udemy-Style Course Cards:** Star ratings, reviews, enrolled worker counts, duration badges, and **Wage Incentive Milestones** (e.g. *"Tier 2 Unlock: +₹1,500/mo allowance"*).
* **Coursera-Style Course Player & Syllabus Drawer:** Collapsible lesson drawer, video scrubber, interactive tabs (Overview, Practical Assignment, Quiz, Skill Passport, Q&A).

### 📸 3. Practical Field Assignments Engine
* **Photo Proof Upload:** Frontline operators upload camera photos of their executed work (safety harness, LOTO padlock, machine setup).
* **Mother-Tongue Voice Notes:** Low-literacy workers record audio explanations rather than typing text.
* **Supervisor Review Queue:** Shift foremen review photo and voice evidence and sign off with their digital signature.

---

## 📱 Worker Mobile PWA Screens

* **Worker Login (`/worker/login`):** Zero-email login via Phone OTP or 1-second Camera Badge Scan (`BC-1001`).
* **Worker Home (`/worker/dashboard`):** Features "Today's Required Safety Bite" (2-minute video), floating "Tap to Listen" audio narration, and quick actions.
* **Microlearning Video Player (`/worker/learn/:id`):** Fast video playback with dual-audio switcher (English, हिंदी, Español) and visual Wrong ❌ vs. Right ✔️ cues.
* **Interactive Visual Quiz (`/worker/quiz/:id`):** "Spot the Hazard" interactive tap canvas (touch 3 hazards directly on the image) and instant score.
* **Machine JIT QR Scanner (`/worker/scan`):** Camera viewfinder scanning equipment QR stickers (e.g., `MACH-FORK-04`) to launch 45-second machine SOPs.
* **My Skill Passport (`/worker/passport`):** Digital employee ID card with generated QR code and certified safety qualification badges.
* **Offline Manager (`/worker/offline`):** 1-Click "Download All Modules" (~25 MB) and offline sync upload queue.

---

## 💻 Back-End Screens (Supervisor & Admin Management Portal)

* **Supervisor Shift Roster (`/supervisor/dashboard`):** Real-time clearance status for all 3 workers on shift.
* **Toolbox Talk Group Mode (`/supervisor/toolbox`):** Tablet fullscreen player to show the 2-minute safety drill to the entire crew + 1-click bulk attendance confirmation.
* **Practical On-the-Job Verification (`/supervisor/practical`):** 30-second observation checklist with interactive digital signature canvas.
* **Safety & Compliance Matrix (`/admin/compliance`):** Heatmap showing compliance percentages by department and plant location.
* **Machine Asset Registry (`/admin/assets`):** Machinery list with generated high-resolution QR codes ready to print as weatherproof stickers.
* **OSHA Compliance Audit Reports (`/admin/audit`):** Printable, tamper-proof audit dossier with timestamps and signatures.

---

## 🛠️ Project Structure

```
LMS/
├── backend/                       # Node.js + Express REST API (Port 5000)
│   ├── prisma/schema.prisma       # SQLite/PostgreSQL schema
│   ├── prisma/seed.ts             # Seeding script
│   ├── src/controllers/           # auth, module, quiz, sync, supervisor, admin
│   ├── src/services/              # QR generator, sync resolver, audit reports
│   └── src/server.ts              # Express initialization
│
├── frontend/                      # Next.js 14+ PWA (Port 3000)
│   ├── public/manifest.json       # PWA manifest
│   ├── src/app/(worker)/          # Worker mobile screens
│   ├── src/app/(supervisor)/      # Supervisor tablet screens
│   ├── src/app/(admin)/           # EHS admin screens
│   ├── src/components/            # Touch canvas, QR scanner, audio narrator
│   └── src/lib/                   # IndexedDB (Dexie.js) & offline sync worker
│
└── shared/                        # Shared TypeScript interfaces
    └── types.ts
```

