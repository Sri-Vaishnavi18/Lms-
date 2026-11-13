import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting LMS 360 Database Seeding with 7 Sectors, Live Sessions & Assignments...');

  // Clean existing data
  await prisma.attendance.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.completion.deleteMany();
  await prisma.practicalAudit.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.machineAsset.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Core Users Across 7 Sectors
  const worker1 = await prisma.user.create({
    data: {
      phoneNumber: '+919876543210',
      badgeId: 'BC-1001',
      fullName: 'Ramesh Kumar',
      role: 'WORKER',
      status: 'ACTIVE',
      password: '1234',
      sector: 'CONSTRUCTION',
      trade: 'Mason & Scaffolder',
      skillTier: 'SKILLED',
      preferredLanguage: 'hi', // Hindi
      siteLocation: 'Metro Rail Project Site 4',
      department: 'Civil Infrastructure',
    },
  });

  const worker2 = await prisma.user.create({
    data: {
      phoneNumber: '+919876543211',
      badgeId: 'BC-1002',
      fullName: 'Suresh Patel',
      role: 'WORKER',
      status: 'ACTIVE',
      password: '1234',
      sector: 'LOGISTICS',
      trade: 'Forklift Operator',
      skillTier: 'SEMI_SKILLED',
      preferredLanguage: 'en',
      siteLocation: 'Central Fulfillment Hub',
      department: 'Warehouse & Yard Logistics',
    },
  });

  const worker3 = await prisma.user.create({
    data: {
      phoneNumber: '+919876543212',
      badgeId: 'BC-1003',
      fullName: 'Anil Verma',
      role: 'WORKER',
      status: 'ACTIVE',
      password: '1234',
      sector: 'MANUFACTURING',
      trade: '5-Axis CNC Mill Operator',
      skillTier: 'HIGHLY_SKILLED',
      preferredLanguage: 'hi',
      siteLocation: 'Plant Alpha - Main Assembly',
      department: 'Precision Machining',
    },
  });

  const worker4 = await prisma.user.create({
    data: {
      phoneNumber: '+919876543213',
      badgeId: 'BC-1004',
      fullName: 'Pooja Sharma',
      role: 'WORKER',
      status: 'ACTIVE',
      password: '1234',
      sector: 'SKILLED_TECHNICAL',
      trade: 'High Voltage Electrician & HVAC',
      skillTier: 'SKILLED',
      preferredLanguage: 'hi',
      siteLocation: 'Substation Gamma',
      department: 'Electrical & Utilities',
    },
  });

  const worker5 = await prisma.user.create({
    data: {
      phoneNumber: '+919876543214',
      badgeId: 'BC-1005',
      fullName: 'Balwant Singh',
      role: 'WORKER',
      status: 'ACTIVE',
      password: '1234',
      sector: 'AGRICULTURE',
      trade: 'Harvester & Tractor Specialist',
      skillTier: 'SEMI_SKILLED',
      preferredLanguage: 'pa',
      siteLocation: 'Agri-Zone North Sector',
      department: 'Heavy Machinery Harvesting',
    },
  });

  const worker6 = await prisma.user.create({
    data: {
      phoneNumber: '+919876543215',
      badgeId: 'BC-1006',
      fullName: 'Sunita Devi',
      role: 'WORKER',
      status: 'ACTIVE',
      password: '1234',
      sector: 'CLEANING_MAINTENANCE',
      trade: 'Sanitation & HazCom Technician',
      skillTier: 'UNSKILLED',
      preferredLanguage: 'hi',
      siteLocation: 'Cleanroom Complex Beta',
      department: 'Sanitation & Facility Care',
    },
  });

  const worker7 = await prisma.user.create({
    data: {
      phoneNumber: '+919876543216',
      badgeId: 'BC-1007',
      fullName: 'Mohammed Rafiq',
      role: 'WORKER',
      status: 'ACTIVE',
      password: '1234',
      sector: 'HOSPITALITY_SERVICE',
      trade: 'Commercial Kitchen Steward',
      skillTier: 'SEMI_SKILLED',
      preferredLanguage: 'ta',
      siteLocation: 'Corporate Dining Hall',
      department: 'Culinary & Food Safety',
    },
  });

  const supervisor = await prisma.user.create({
    data: {
      phoneNumber: '+919876543299',
      badgeId: 'SUP-5001',
      fullName: 'David Miller (Shift Foreman)',
      role: 'SUPERVISOR',
      status: 'ACTIVE',
      password: '1234',
      sector: 'MANUFACTURING',
      trade: 'Shift Supervisor',
      skillTier: 'HIGHLY_SKILLED',
      preferredLanguage: 'en',
      siteLocation: 'Plant Alpha - Main Assembly',
      department: 'Heavy Assembly & Operations',
    },
  });

  const admin = await prisma.user.create({
    data: {
      phoneNumber: '+919876543000',
      badgeId: 'ADM-9001',
      fullName: 'Sarah Jenkins (EHS Lead)',
      role: 'ADMIN',
      status: 'ACTIVE',
      password: 'admin123',
      sector: 'MANUFACTURING',
      trade: 'Safety Director',
      skillTier: 'HIGHLY_SKILLED',
      preferredLanguage: 'en',
      siteLocation: 'Corporate HQ & Plant Alpha',
      department: 'Environmental Health & Safety',
    },
  });

  console.log('✅ Created 9 Core Users across all 7 Sectors + Supervisor & Admin');

  // 2. Create Courses across Sectors with Skill Tiers
  const courseConstruction = await prisma.course.create({
    data: {
      title: 'Scaffolding & Working at Heights Safety 2026',
      category: 'EHS',
      sector: 'CONSTRUCTION',
      skillTier: 'UNSKILLED',
      description: 'Foundational height safety, mandatory harness checks, and perimeter debris prevention.',
    },
  });

  const courseMachining = await prisma.course.create({
    data: {
      title: 'CNC Mill & Stamping Press Lockout-Tagout (LOTO)',
      category: 'MACHINE_SOP',
      sector: 'MANUFACTURING',
      skillTier: 'SKILLED',
      description: 'Zero mechanical energy isolation, lockout padlock verification, and live safety checks.',
    },
  });

  const courseLogistics = await prisma.course.create({
    data: {
      title: 'Counterbalance Forklift & Yard Safety Protocol',
      category: 'MACHINE_SOP',
      sector: 'LOGISTICS',
      skillTier: 'SEMI_SKILLED',
      description: 'Pre-shift horn/brake inspection, load center limits, and pedestrian blind spot management.',
    },
  });

  const courseLiveMasterclass = await prisma.course.create({
    data: {
      title: 'Plant Safety Live Masterclasses & Daily Toolbox Talks',
      category: 'EHS',
      sector: 'MANUFACTURING',
      skillTier: 'HIGHLY_SKILLED',
      description: 'Live interactive streaming sessions with master trainers and certified site engineers.',
    },
  });

  // 3. Create Modules (Recorded and Live Sessions)
  const modHeightSafety = await prisma.module.create({
    data: {
      courseId: courseConstruction.id,
      title: '3-Point Contact & Fall Harness Pre-Use Check',
      durationSeconds: 120,
      sessionType: 'RECORDED',
      sector: 'CONSTRUCTION',
      skillTier: 'UNSKILLED',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      audioTracks: JSON.stringify({
        en: '/audio/en/fire-pass.mp3',
        hi: '/audio/hi/fire-pass.mp3',
        ta: '/audio/ta/fire-pass.mp3',
        te: '/audio/te/fire-pass.mp3',
      }),
    },
  });

  const modForkliftRecorded = await prisma.module.create({
    data: {
      courseId: courseLogistics.id,
      title: 'Forklift 45-Second Daily Pre-Shift Circle Check',
      durationSeconds: 150,
      sessionType: 'RECORDED',
      sector: 'LOGISTICS',
      skillTier: 'SEMI_SKILLED',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      audioTracks: JSON.stringify({
        en: '/audio/en/fire-pass.mp3',
        hi: '/audio/hi/fire-pass.mp3',
      }),
    },
  });

  const modLotoLive = await prisma.module.create({
    data: {
      courseId: courseMachining.id,
      title: 'Live Workshop: High-Voltage LOTO & Stored Pressure Bleed',
      durationSeconds: 1800,
      sessionType: 'LIVE',
      sector: 'MANUFACTURING',
      skillTier: 'SKILLED',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      liveSessionUrl: 'https://meet.jit.si/LMS360-Live-Safety-Session',
      liveStartTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // In 2 hours
      liveInstructor: 'Er. Rajesh Kulkarni (Chief Safety Inspector)',
      audioTracks: JSON.stringify({ en: '/audio/en/fire-pass.mp3' }),
    },
  });

  const modToolboxLive = await prisma.module.create({
    data: {
      courseId: courseLiveMasterclass.id,
      title: 'Morning Shift Toolbox Talk: Heat Stress & Chemical HazCom',
      durationSeconds: 900,
      sessionType: 'LIVE',
      sector: 'CONSTRUCTION',
      skillTier: 'SEMI_SKILLED',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      liveSessionUrl: 'https://meet.jit.si/LMS360-Shift-Toolbox-Live',
      liveStartTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      liveInstructor: 'David Miller (Shift Foreman)',
      audioTracks: JSON.stringify({ en: '/audio/en/fire-pass.mp3' }),
    },
  });

  // 4. Create Assignments for Modules
  const assign1 = await prisma.assignment.create({
    data: {
      moduleId: modHeightSafety.id,
      title: 'Fall Arrest Full-Body Harness Photo Verification',
      type: 'PHOTO_PROOF',
      instructions: 'Wear your full-body safety harness, latch the dorsal D-ring, and take a photo selfie in front of the site safety mirror before boarding the scaffold.',
      requiredProof: 'Clear photo showing dorsal D-ring, leg buckle tension, and hard hat chin strap fastened.',
    },
  });

  const assign2 = await prisma.assignment.create({
    data: {
      moduleId: modForkliftRecorded.id,
      title: 'Forklift Fork Heel & Hydraulic Hose Inspection',
      type: 'PHOTO_PROOF',
      instructions: 'Inspect the forklift hydraulic fluid lines for leaks and measure fork heel thickness. Take a clear photo of the inspection tag.',
      requiredProof: 'Photo of daily pre-shift inspection checklist signed on clipboard.',
    },
  });

  // 5. Create Submissions
  await prisma.assignmentSubmission.create({
    data: {
      assignmentId: assign1.id,
      userId: worker1.id,
      proofUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=600&auto=format&fit=crop&q=80',
      notes: 'Harness inspected with Foreman David Miller. Double lanyard attached.',
      status: 'APPROVED',
      score: 100,
      feedback: 'Excellent buckle tension and chin strap alignment.',
      reviewedBy: supervisor.fullName,
    },
  });

  await prisma.assignmentSubmission.create({
    data: {
      assignmentId: assign2.id,
      userId: worker2.id,
      proofUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
      notes: 'Hydraulic hoses inspected. Tire pressure at 110 PSI.',
      status: 'PENDING',
      score: null,
      feedback: null,
      reviewedBy: null,
    },
  });

  // 6. Create Visual Quizzes
  await prisma.quiz.create({
    data: {
      moduleId: modHeightSafety.id,
      type: 'SPOT_THE_HAZARD',
      promptAudio: JSON.stringify({
        en: 'Touch 3 hazards on the construction platform before climbing.',
        hi: 'चढ़ने से पहले निर्माण मंच पर 3 खतरों को स्क्रीन पर स्पर्श करें।',
      }),
      questionData: JSON.stringify({
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
        hazardTargets: [
          { id: 'h1', name: 'Missing Toe Board Guardrail', xPercent: 24, yPercent: 42, radiusPercent: 12, explanation: 'Scaffolding requires an OSHA toe board to prevent falling tools.' },
          { id: 'h2', name: 'Loose Electrical Power Cord', xPercent: 68, yPercent: 78, radiusPercent: 14, explanation: 'Trip hazard and electrocution risk near puddles.' },
          { id: 'h3', name: 'Unlatched Safety Snap-Hook', xPercent: 48, yPercent: 28, radiusPercent: 10, explanation: 'Double-locking snap hook must be fully engaged.' },
        ],
      }),
    },
  });

  // 7. Seed Attendance Records
  const todayStr = new Date().toISOString().split('T')[0];
  await prisma.attendance.create({
    data: {
      userId: worker1.id,
      date: todayStr,
      type: 'TOOLBOX_TALK',
      status: 'PRESENT',
      verifiedBy: supervisor.badgeId,
    },
  });

  await prisma.attendance.create({
    data: {
      userId: worker2.id,
      date: todayStr,
      type: 'SHIFT_START',
      status: 'PRESENT',
      verifiedBy: supervisor.badgeId,
    },
  });

  await prisma.attendance.create({
    data: {
      userId: worker3.id,
      date: todayStr,
      type: 'TOOLBOX_TALK',
      status: 'PRESENT',
      verifiedBy: supervisor.badgeId,
    },
  });

  // 8. Seed Completions
  await prisma.completion.create({
    data: {
      userId: worker1.id,
      moduleId: modHeightSafety.id,
      score: 100,
      isPassed: true,
      completedAt: new Date(),
      isOfflineSynced: false,
    },
  });

  await prisma.completion.create({
    data: {
      userId: worker3.id,
      moduleId: modHeightSafety.id,
      score: 95,
      isPassed: true,
      completedAt: new Date(),
      isOfflineSynced: true,
    },
  });

  // 9. Seed Machine Assets with QR Codes
  await prisma.machineAsset.create({
    data: {
      qrCodeId: 'MACH-FORK-04',
      name: 'Counterbalance Forklift Truck #04',
      plantLocation: 'Logistics Bay 3',
      linkedModuleId: modForkliftRecorded.id,
    },
  });

  await prisma.machineAsset.create({
    data: {
      qrCodeId: 'MACH-CNC-12',
      name: '5-Axis CNC Precision Machining Center #12',
      plantLocation: 'Plant Alpha - Machine Shop',
      linkedModuleId: modLotoLive.id,
    },
  });

  console.log('🎉 Seeding Complete! LMS 360 database populated with 7 Sectors, Live Sessions, Quizzes, Assignments, and Attendance.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
