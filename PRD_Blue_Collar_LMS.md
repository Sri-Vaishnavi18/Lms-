# Product Requirements Document (PRD)
## Frontline & Blue-Collar Learning Management System (LMS)
### Pure JavaScript / TypeScript Full-Stack Architecture

---

## Document Control
* **Project Name:** Frontline & Blue-Collar Learning Management System (LMS)
* **Document Version:** 1.1.0
* **Architecture:** Decoupled Frontend (Next.js PWA + Admin Portal) & Backend (Node.js + Express REST API)
* **Primary Language:** JavaScript / TypeScript across the entire stack
* **Target Audience:** Blue-collar laborers, site foremen/supervisors, and EHS safety managers.

---

## 1. Executive Summary & Architecture Overview

The system is built as a **decoupled, full-stack JavaScript / TypeScript application**:
1. **Frontend (`/frontend`):** Next.js 14+ PWA delivering touch-friendly, mobile-first interfaces for frontline workers and desktop/tablet dashboards for supervisors and administrators.
2. **Backend (`/backend`):** Node.js + Express.js RESTful API engine managing relational data with Prisma ORM, handling high-concurrency offline sync queues, dynamic QR generation, and OSHA audit reporting.
3. **Shared Types (`/shared`):** Shared TypeScript interfaces ensuring strict data consistency across both client and server.

---

## 2. Directory & Project Structure

```
LMS/
├── backend/                             # [BACKEND: Node.js, Express & TypeScript]
│   ├── prisma/
│   │   ├── schema.prisma                # Relational database models (Users, Modules, Quizzes, Audits)
│   │   └── seed.ts                      # Seed data (5 core pillars: EHS, SOPs, 5S, Conduct, Digital)
│   ├── src/
│   │   ├── controllers/                 # Express request handlers
│   │   │   ├── auth.controller.ts       # Phone OTP & QR badge login handlers
│   │   │   ├── module.controller.ts     # Video lessons, audio tracks, and courses
│   │   │   ├── quiz.controller.ts       # "Spot the Hazard" and visual quiz handlers
│   │   │   ├── sync.controller.ts       # Offline sync queue & conflict resolution engine
│   │   │   ├── supervisor.controller.ts # Toolbox Talk group attendance & practical audits
│   │   │   └── admin.controller.ts      # Compliance matrix, asset QR generator, audit exports
│   │   ├── routes/                      # REST API route endpoints
│   │   │   ├── auth.routes.ts           # /api/v1/auth
│   │   │   ├── module.routes.ts         # /api/v1/modules
│   │   │   ├── quiz.routes.ts           # /api/v1/quizzes
│   │   │   ├── sync.routes.ts           # /api/v1/sync
│   │   │   ├── supervisor.routes.ts     # /api/v1/supervisor
│   │   │   └── admin.routes.ts          # /api/v1/admin
│   │   ├── services/                    # Core business logic
│   │   │   ├── qr.service.ts            # Dynamic QR generation for machinery & ID badges
│   │   │   ├── sync.service.ts          # Idempotent offline event synchronization
│   │   │   └── report.service.ts        # PDF audit dossier & CSV generation
│   │   ├── middlewares/                 # Auth verification, role checks (Worker/Supervisor/Admin)
│   │   ├── db/
│   │   │   └── prisma.ts                # Prisma client singleton
│   │   └── server.ts                    # Express app initialization & server startup
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                            # [FRONTEND: Next.js 14+ PWA & Admin Portal]
│   ├── public/
│   │   ├── icons/                       # PWA icons (192x192, 512x512)
│   │   └── manifest.json                # PWA manifest
│   ├── src/
│   │   ├── app/
│   │   │   ├── (worker)/                # [WORKER MOBILE PWA SCREENS]
│   │   │   │   ├── login/page.tsx       # Phone OTP & QR Badge scan login
│   │   │   │   ├── dashboard/page.tsx   # Daily shift safety bite & quick actions
│   │   │   │   ├── learn/[id]/page.tsx  # Microlearning video player with dual-audio switcher
│   │   │   │   ├── quiz/[id]/page.tsx   # "Spot the Hazard" canvas & swipe decision cards
│   │   │   │   ├── scan/page.tsx        # Machine SOP camera QR scanner
│   │   │   │   ├── passport/page.tsx    # Digital skill badges & license expiry cards
│   │   │   │   └── offline/page.tsx     # Download manager & pending sync queue
│   │   │   │
│   │   │   ├── (supervisor)/            # [SUPERVISOR TABLET SCREENS]
│   │   │   │   ├── dashboard/page.tsx   # Shift crew roster & compliance tracker
│   │   │   │   ├── toolbox/page.tsx     # Morning group video player & 1-click attendance
│   │   │   │   └── practical/page.tsx   # On-site observation checklist & signature pad
│   │   │   │
│   │   │   ├── (admin)/                 # [ADMIN DESKTOP SCREENS]
│   │   │   │   ├── compliance/page.tsx  # Site-wide compliance heatmap matrix
│   │   │   │   ├── builder/page.tsx     # Visual course builder & hazard coordinate mapper
│   │   │   │   ├── assets/page.tsx      # Machine asset registry & printable QR sheets
│   │   │   │   ├── roster/page.tsx      # Worker profiles & batch ID badge generator
│   │   │   │   └── audit/page.tsx       # One-click OSHA PDF/CSV export engine
│   │   │   │
│   │   │   ├── layout.tsx               # Root layout with offline service worker registration
│   │   │   └── page.tsx                 # Landing redirect
│   │   ├── components/
│   │   │   ├── AudioNarrator.tsx        # "Tap to Listen" floating voiceover button
│   │   │   ├── HazardCanvas.tsx         # Interactive touch canvas for hazard tap detection
│   │   │   ├── QRCameraScanner.tsx      # Fast HTML5 camera QR reader
│   │   │   ├── SignaturePad.tsx         # Digital supervisor signature canvas
│   │   │   └── OfflineIndicator.tsx     # Status pill showing online/offline/syncing
│   │   └── lib/
│   │       ├── db.ts                    # IndexedDB instance (Dexie.js) for local caching
│   │       ├── syncEngine.ts            # Client-side sync worker for background upload
│   │       └── api.ts                   # Fetch wrapper connecting to the Node.js backend
│   ├── package.json
│   └── tailwind.config.ts
│
└── shared/                              # [SHARED TYPES: TypeScript]
    └── types.ts                         # Shared interfaces (User, Module, Quiz, SyncPayload)
```

---

## 3. Frontend Pages Breakdown (Worker & Field Operative Facing)

These screens run as a lightweight **Mobile Progressive Web App (PWA)**, with minimum 48px touch targets, zero-email authentication, and audio narration in regional languages:

1. **Page F-1: Welcome & Zero-Email Auth (`/worker/login`)**
   * Phone number input with 4-digit SMS / WhatsApp OTP.
   * "Scan My Employee QR Badge" button using phone camera.
   * Regional language switcher with spoken audio greeting.
2. **Page F-2: Worker Home & Daily Shift Dashboard (`/worker/dashboard`)**
   * Prominent "Today's Required Safety Bite" card (duration: ~2m 15s).
   * Floating "Listen in My Language" button that reads the entire screen aloud.
   * Quick action buttons for Camera QR scanner and Offline Download manager.
3. **Page F-3: Microlearning Video Player (`/worker/learn/[id]`)**
   * Ultra-fast video stream with dual audio track switcher (change language without re-downloading).
   * Visual cues: Wrong Way ❌ vs. Right Way ✔️.
4. **Page F-4: Interactive Visual Quiz (`/worker/quiz/[id]`)**
   * "Spot the Hazard" interactive tap canvas (tap 3 hazards directly on the image).
   * "Swipe Card" flashcard decision engine (Swipe right = Safe, Swipe left = Unsafe).
5. **Page F-5: Machine Just-in-Time (JIT) QR Scanner (`/worker/scan`)**
   * Camera viewfinder scanning equipment QR stickers to open instant 45-second machine SOPs.
6. **Page F-6: My Skill Passport & Certifications (`/worker/passport`)**
   * Digital skill cards (Forklift, Fire Safety, HazCom) with color-coded expiry badges.
7. **Page F-7: Offline Cache & Sync Manager (`/worker/offline`)**
   * "Download Today's Shift Modules" button (~25 MB total).
   * Storage gauge and queue of pending offline quiz completions.

---

## 4. Backend Pages Breakdown (Supervisor & Admin Management Facing)

These screens run as a responsive **desktop and tablet management portal**:

1. **Page B-1: Admin & Supervisor Secure Login (`/admin/login`)**
   * Enterprise email/password credentials with 2FA and role routing.
2. **Page B-2: Supervisor Crew & Shift Dashboard (`/supervisor/dashboard`)**
   * Active shift crew roster showing real-time certified vs. pending worker counts.
3. **Page B-3: Supervisor "Toolbox Talk" Group Mode (`/supervisor/toolbox`)**
   * Fullscreen tablet player for morning safety drills.
   * 1-Click bulk attendance confirmation for 10–30 workers.
4. **Page B-4: Supervisor Practical On-the-Job Verification (`/supervisor/practical`)**
   * 30-second observation checklist with digital supervisor signature capture.
5. **Page B-5: EHS Safety & Compliance Matrix Dashboard (`/admin/compliance`)**
   * Plant-wide heatmap showing training completion by plant location, department, and shift.
   * Critical alerts for workers operating equipment with expired certificates.
6. **Page B-6: Course, Video & Visual Quiz Builder (`/admin/builder`)**
   * No-code authoring editor to upload videos, attach audio tracks, and draw "Spot the Hazard" bounding boxes.
7. **Page B-7: Machine Asset & Printable QR Code Generator (`/admin/assets`)**
   * Machine registry generating printable weatherproof QR stickers for shop-floor equipment.
8. **Page B-8: Workforce Roster & Digital ID Badge Management (`/admin/roster`)**
   * Worker directory with batch printing of wallet-sized employee ID cards with login QR codes.
9. **Page B-9: Regulatory Compliance & One-Click Audit Export (`/admin/audit`)**
   * 1-Click OSHA-compliant PDF audit dossier with timestamps and digital signatures.
10. **Page B-10: System Settings & Integrations (`/admin/settings`)**
    * WhatsApp/SMS gateway configuration, offline cache limits, and payroll webhooks.

---

## 5. Backend RESTful API Endpoints (Node.js & Express)

| Endpoint | Method | Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/otp/send` | `POST` | Public | Dispatches SMS / WhatsApp OTP to worker phone. |
| `/api/v1/auth/otp/verify` | `POST` | Public | Validates OTP and issues session token. |
| `/api/v1/auth/qr-login` | `POST` | Public | Authenticates worker directly via badge QR code. |
| `/api/v1/modules` | `GET` | Worker/Sup | Lists assigned microlearning modules with multilingual audio. |
| `/api/v1/modules/:id` | `GET` | Worker/Sup | Fetches single module details, video stream, and quizzes. |
| `/api/v1/sync/completions` | `POST` | Worker | Receives batch of offline quiz completions and updates database. |
| `/api/v1/supervisor/toolbox` | `POST` | Supervisor | Submits bulk attendance for morning group safety drill. |
| `/api/v1/supervisor/practical` | `POST` | Supervisor | Records practical observation checklist and supervisor signature. |
| `/api/v1/admin/compliance-matrix` | `GET` | Admin | Aggregates compliance percentages by plant, shift, and department. |
| `/api/v1/admin/assets/generate-qr` | `POST` | Admin | Generates printable QR sticker sheets for equipment. |
| `/api/v1/admin/reports/audit-pdf` | `GET` | Admin | Generates legally verifiable OSHA compliance PDF audit dossier. |

---

## 6. Database Schema (Prisma ORM)

```prisma
datasource db {
  provider = "sqlite" // Seamlessly switchable to "postgresql" for production
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  WORKER
  SUPERVISOR
  ADMIN
}

enum QuizType {
  SPOT_THE_HAZARD
  SWIPE_DECISION
  SEQUENCE_ORDER
}

model User {
  id                String            @id @default(uuid())
  phoneNumber       String            @unique
  badgeId           String            @unique
  fullName          String
  role              Role              @default(WORKER)
  preferredLanguage String            @default("en")
  siteLocation      String
  department        String
  completions       Completion[]
  supervisorAudits  PracticalAudit[]  @relation("SupervisorAudits")
  workerAudits      PracticalAudit[]  @relation("WorkerAudits")
  createdAt         DateTime          @default(now())
}

model Course {
  id          String   @id @default(uuid())
  title       String
  category    String   // EHS, MACHINE_SOP, QUALITY_5S, CONDUCT
  modules     Module[]
  createdAt   DateTime @default(now())
}

model Module {
  id              String       @id @default(uuid())
  courseId        String
  course          Course       @relation(fields: [courseId], references: [id])
  title           String
  durationSeconds Int
  videoUrl        String
  audioTracks     String       // JSON-stringified: {"en": "url_en", "hi": "url_hi"}
  quizzes         Quiz[]
  completions     Completion[]
}

model Quiz {
  id            String   @id @default(uuid())
  moduleId      String
  module        Module   @relation(fields: [moduleId], references: [id])
  type          QuizType
  promptAudio   String   // JSON-stringified: {"en": "url_en", "hi": "url_hi"}
  questionData  String   // JSON-stringified: Image URL, coordinates, card deck
}

model Completion {
  id              String   @id @default(uuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  moduleId        String
  module          Module   @relation(fields: [moduleId], references: [id])
  score           Int
  isPassed        Boolean  @default(false)
  completedAt     DateTime @default(now())
  isOfflineSynced Boolean  @default(false)
}

model PracticalAudit {
  id             String   @id @default(uuid())
  workerId       String
  worker         User     @relation("WorkerAudits", fields: [workerId], references: [id])
  supervisorId   String
  supervisor     User     @relation("SupervisorAudits", fields: [supervisorId], references: [id])
  checklistName  String
  passed         Boolean
  signatureUrl   String
  verifiedAt     DateTime @default(now())
}

model MachineAsset {
  id             String   @id @default(uuid())
  qrCodeId       String   @unique
  name           String
  plantLocation  String
  linkedModuleId String
  createdAt      DateTime @default(now())
}
```

---
*Product Requirements Document (PRD) v1.1.0 • Pure JavaScript/TypeScript Full-Stack Architecture*
