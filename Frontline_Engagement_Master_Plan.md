# Master Implementation Plan: Next-Gen Frontline LMS
## Hybrid Architecture: Coursera/Udemy Structure + YouTube Shorts Microlearning Engine

---

## 1. System Vision & Core Paradigms

1. **Coursera & Udemy Style Exterior:**
   * Clean, modular course catalog with search and sector filtering (7 Frontline Sectors).
   * Structured syllabus with collapsible lesson drawer, progress meters, and milestone tracking.
   * Wage incentive counters (e.g. *"Complete Tier 2 $\to$ Qualified for Senior Operator & ₹1,500/mo allowance"*).
   * Verifiable Digital Skill Passport and official printable certificates.

2. **YouTube Shorts / Instagram Reels Style Interior (`/shorts`):**
   * Fullscreen 9:16 vertical video feed with snap-scroll gestures (swipe up/down to next micro-lesson).
   * Floating action buttons (Audio language switcher, 30-sec instant quiz popup, ask-supervisor voice note, like counter, offline save).
   * Split-screen badging: **Wrong Way ❌ vs. Right Way ✔️**.
   * Machine QR trigger integration: Scanning equipment QR stickers directly opens that machine's vertical 45-second Short.

---

## 2. The 7 Industry Sectors & 4-Tier Skill Level Taxonomy

| Sector | Target Roles | Skill Tiers | Primary Hands-On Assignment |
| :--- | :--- | :--- | :--- |
| **1. Construction** | Masons, painters, welders, tile workers, concrete workers, helpers | Tier 1 to Tier 3 | Photo proof of level alignment & welded seam |
| **2. Skilled Technical** | Electricians, plumbers, carpenters, mechanics, HVAC technicians | Tier 2 to Tier 4 | Circuit wiring photo + Voice diagnostic explanation |
| **3. Manufacturing** | Machine operators, assembly-line, production, quality inspectors | Tier 2 to Tier 4 | Machine pre-check walkaround + Defect detection |
| **4. Logistics & Transport** | Truck drivers, delivery agents, forklift operators, loaders | Tier 1 to Tier 3 | Forklift walkaround & pallet load balance photo |
| **5. Agriculture** | Farmers, farm labourers, harvesters, dairy & plantation workers | Tier 1 to Tier 2 | Pesticide PPE verification & safety voice note |
| **6. Cleaning & Maintenance**| Cleaners, sanitation staff, gardeners, facility maintenance | Tier 1 to Tier 2 | Chemical HazCom pictogram check & hygiene log |
| **7. Hospitality & Services** | Cooks, kitchen assistants, hotel housekeeping, laundry, catering | Tier 1 to Tier 3 | Food safety temp check & hygiene photo proof |

---

## 3. Multilingual Engine: 11 Native Indian Languages
Instant language switching across the entire UI and dual-track voiceover ("Tap to Listen"):
* English
* हिंदी (Hindi)
* தமிழ் (Tamil)
* తెలుగు (Telugu)
* ಕನ್ನಡ (Kannada)
* বাংলা (Bengali)
* मराठी (Marathi)
* ગુજરાતી (Gujarati)
* മലയാളം (Malayalam)
* ଓଡ଼ିଆ (Odia)
* ਪੰਜਾਬੀ (Punjabi)

---

## 4. Hands-on Practical Field Assignments Engine
1. **Photo Proof Submission:** Worker takes a camera photo of physical work (welded seam, wire termination, tile alignment). Compressed on-device (<500 KB) and submitted to supervisor review queue.
2. **Audio Voice Response:** Low-literacy workers tap "Record Audio" and speak for 30–60 seconds in their native dialect explaining emergency cutoff or machine pre-check steps.
3. **Interactive Spot the Hazard:** Canvas-based interactive image where workers tap on safety hazards.

---

## 5. Admin & Management Portal
* **Category-Wise Tracking:** Site-wide heatmap showing completion and compliance percentages across all 7 sectors and 4 skill tiers.
* **Person-Wise Tracking:** Individual worker drill-down showing completed modules, assignment photo proofs, scores, and active credentials.
* **Admin Shorts & Course Studio:** Upload 9:16 vertical videos, attach audio tracks across 11 Indian languages, configure quiz coordinates, and set skill tier.
* **Supervisor Shift Tablet Mode:** Morning Toolbox Talk player with 1-click group attendance confirmation and practical observation signature canvas.
* **1-Click OSHA / Labor Audit Export:** Downloadable, tamper-proof PDF audit dossier containing verified completion timestamps and digital signatures.
