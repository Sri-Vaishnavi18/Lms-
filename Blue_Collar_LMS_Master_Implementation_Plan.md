# Master Implementation Plan: Next-Gen Frontline & Blue-Collar LMS

---

## 1. The 7 Target Frontline Worker Sectors
1. **Construction Workers:** Masons, painters, welders, tile workers, concrete workers, and helpers.
2. **Skilled Technical Workers:** Electricians, plumbers, carpenters, mechanics, and HVAC technicians.
3. **Manufacturing & Factory Workers:** Machine operators, assembly-line workers, production workers, and quality inspectors.
4. **Transportation & Logistics Workers:** Truck drivers, delivery agents, forklift operators, warehouse workers, and loaders.
5. **Agricultural Workers:** Farmers, farm labourers, harvesters, dairy workers, and plantation workers.
6. **Cleaning & Maintenance Workers:** Housekeeping staff, cleaners, sanitation workers, gardeners, and maintenance staff.
7. **Hospitality & Service Workers:** Cooks, kitchen assistants, hotel housekeeping staff, laundry workers, and catering staff.

---

## 2. 4-Tier Skill Level Taxonomy & Milestone Progression
* **Tier 1: Unskilled:** Helpers, Cleaners, Loaders. Focused on zero-text visual safety, PPE compliance, and basic hazard identification. **Bronze Milestone.**
* **Tier 2: Semi-Skilled:** Assembly line, Machine tenders, Delivery agents. Standard Operating Procedures (SOPs), machine pre-checks, swipe decision quizzes. **Silver Milestone.**
* **Tier 3: Skilled:** Electricians, Welders, Masons, Plumbers, Cooks. Advanced technical procedures, practical photo proof assignments, supervisor verified sign-offs. **Gold Milestone.**
* **Tier 4: Highly-Skilled:** Quality inspectors, CNC specialists, HVAC diagnosticians. Precision calibration, defect diagnostics, audio voice explanations. **Master Milestone.**

---

## 3. Resolving Flaws of iGOT Karmayogi & Legacy Corporate LMSs
* **Drop-off from Text-Heavy Bureaucratic Content:** Replaced with 2–3 minute microlearning videos and vernacular audio.
* **Complex Email & Password Login:** Replaced with zero-email Phone OTP (SMS/WhatsApp) and 1-second Camera QR badge scan.
* **Theoretical Multiple-Choice Guessing:** Replaced with practical field assignments (Photo proof uploads of completed work, recorded audio explanations, and supervisor on-site checkoffs).
* **Network Dead Zones in Rural/Basement Sites:** Replaced with true Offline-First PWA storage via IndexedDB.
* **Lack of On-Site Equipment Training:** Machine-mounted QR stickers trigger instant 45-second pre-operation checklists.
* **Shop Floor Phone Prohibitions:** Supervisor "Toolbox Talk" group mode streams drills to an entire crew with 1-click bulk attendance.

---

## 4. 11 Native Indian Languages Support
Dynamic instant UI translation and dual-track voiceover narration ("Tap to Listen"):
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

## 5. Admin Dual-View Analytics & Module Builder
* **Category-Wise Tracking:** Site-wide heatmap showing completion and compliance percentages across all 7 sectors and 4 skill tiers.
* **Person-Wise Tracking:** Individual worker drill-down showing completed modules, assignment scores, photos, and active licenses.
* **Skill Module Upload Builder:** Allows admin to upload video lessons, assign sectors, select skill tiers (Unskilled $\to$ Highly-Skilled), and attach multilingual audio tracks.
* **Printable QR Code Generator:** Generates equipment QR stickers and worker ID login badges.
* **OSHA & Labor Inspection Export:** One-click PDF/CSV audit reports with digital timestamps and signatures.

---

## 6. Role-Based Access Control (RBAC) Matrix

| Capability / Route | Worker (`WORKER`) | Supervisor (`SUPERVISOR`) | Admin (`ADMIN`) |
| :--- | :---: | :---: | :---: |
| Access Sector-Specific Dashboard | ✅ | ✅ | ✅ |
| Watch Micro-Lessons with Vernacular Audio | ✅ | ✅ | ✅ |
| Take Visual Tap & Swipe Quizzes | ✅ | ❌ | ❌ |
| Submit Photo Proof & Audio Assignments | ✅ | ❌ | ❌ |
| View Personal Skill Passport & QR Badge | ✅ | ❌ | ❌ |
| Conduct Morning Toolbox Talk (Group Mode) | ❌ | ✅ | ✅ |
| 1-Click Crew Attendance Sign-Off | ❌ | ✅ | ✅ |
| On-Site Observation Audit & Signature Pad | ❌ | ✅ | ✅ |
| Review & Grade Worker Practical Assignments | ❌ | ✅ | ✅ |
| Upload Skill-Based Modules & Audio Tracks | ❌ | ❌ | ✅ |
| View Category-Wise & Person-Wise Analytics | ❌ | Shift-Level | Site-Wide |
| Generate Machine QR Code Stickers | ❌ | ❌ | ✅ |
| Export OSHA/Regulatory Compliance Reports | ❌ | ❌ | ✅ |

