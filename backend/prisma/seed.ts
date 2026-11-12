import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Blue-Collar LMS Database Seeding...');

  // Clean existing data
  await prisma.completion.deleteMany();
  await prisma.practicalAudit.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.machineAsset.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Core Users
  const worker1 = await prisma.user.create({
    data: {
      phoneNumber: '+919876543210',
      badgeId: 'BC-1001',
      fullName: 'Ramesh Kumar',
      role: 'WORKER',
      preferredLanguage: 'hi', // Hindi
      siteLocation: 'Plant Alpha - Main Assembly',
      department: 'Heavy Assembly',
    },
  });

  const worker2 = await prisma.user.create({
    data: {
      phoneNumber: '+919876543211',
      badgeId: 'BC-1002',
      fullName: 'Suresh Patel',
      role: 'WORKER',
      preferredLanguage: 'en',
      siteLocation: 'Plant Alpha - Main Assembly',
      department: 'Logistics & Warehouse',
    },
  });

  const worker3 = await prisma.user.create({
    data: {
      phoneNumber: '+919876543212',
      badgeId: 'BC-1003',
      fullName: 'Anil Verma',
      role: 'WORKER',
      preferredLanguage: 'hi',
      siteLocation: 'Plant Alpha - Main Assembly',
      department: 'Heavy Assembly',
    },
  });

  const supervisor = await prisma.user.create({
    data: {
      phoneNumber: '+919876543299',
      badgeId: 'SUP-5001',
      fullName: 'David Miller (Shift Foreman)',
      role: 'SUPERVISOR',
      preferredLanguage: 'en',
      siteLocation: 'Plant Alpha - Main Assembly',
      department: 'Operations & Safety',
    },
  });

  const admin = await prisma.user.create({
    data: {
      phoneNumber: '+919876543000',
      badgeId: 'ADM-9001',
      fullName: 'Sarah Jenkins (EHS Lead)',
      role: 'ADMIN',
      preferredLanguage: 'en',
      siteLocation: 'Corporate HQ & Plant Alpha',
      department: 'Environmental Health & Safety',
    },
  });

  console.log('✅ Created 5 Core Users (Workers, Supervisor, Admin)');

  // 2. Create Pillar 1: Environment, Health & Safety (EHS)
  const ehsCourse = await prisma.course.create({
    data: {
      title: 'Workplace Safety & Hazard Control (EHS)',
      category: 'EHS',
      modules: {
        create: [
          {
            title: 'Personal Protective Equipment (PPE) & Fall Harness',
            durationSeconds: 135, // 2m 15s
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            audioTracks: JSON.stringify({
              en: '/audio/en/ppe-harness.mp3',
              hi: '/audio/hi/ppe-harness.mp3',
              es: '/audio/es/ppe-harness.mp3',
            }),
            quizzes: {
              create: [
                {
                  type: 'SPOT_THE_HAZARD',
                  promptAudio: JSON.stringify({
                    en: '/audio/en/quiz-spot-hazard.mp3',
                    hi: '/audio/hi/quiz-spot-hazard.mp3',
                  }),
                  questionData: JSON.stringify({
                    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80',
                    hazardTargets: [
                      {
                        id: 'hz-1',
                        name: 'Unfastened Safety Harness Lanyard',
                        xPercent: 48,
                        yPercent: 42,
                        radiusPercent: 12,
                        explanation: 'Worker on scaffold has harness lanyard disconnected from life-line!',
                      },
                      {
                        id: 'hz-2',
                        name: 'Missing Hard Hat / Helmet',
                        xPercent: 52,
                        yPercent: 20,
                        radiusPercent: 10,
                        explanation: 'Worker under high scaffolding without hard hat.',
                      },
                      {
                        id: 'hz-3',
                        name: 'Exposed Electrical Cable on Wet Ground',
                        xPercent: 25,
                        yPercent: 82,
                        radiusPercent: 14,
                        explanation: 'Frayed wire lying in a water puddle creates electrocution hazard.',
                      },
                    ],
                  }),
                },
              ],
            },
          },
          {
            title: 'Fire Safety & The P.A.S.S. Extinguisher Method',
            durationSeconds: 110, // 1m 50s
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            audioTracks: JSON.stringify({
              en: '/audio/en/fire-pass.mp3',
              hi: '/audio/hi/fire-pass.mp3',
            }),
            quizzes: {
              create: [
                {
                  type: 'SWIPE_DECISION',
                  promptAudio: JSON.stringify({
                    en: '/audio/en/quiz-swipe-tools.mp3',
                  }),
                  questionData: JSON.stringify({
                    swipeCards: [
                      {
                        id: 'sc-1',
                        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
                        caption: 'Fire Extinguisher with pressure needle in GREEN zone and safety pin intact.',
                        isSafe: true,
                        explanation: 'Green zone indicates full operational pressure.',
                      },
                      {
                        id: 'sc-2',
                        imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
                        caption: 'Fire hose with cracked rubber and missing spray nozzle.',
                        isSafe: false,
                        explanation: 'Damaged fire hose will rupture under pressure.',
                      },
                    ],
                  }),
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 3. Create Pillar 2: Machine Operations & SOPs
  const machineCourse = await prisma.course.create({
    data: {
      title: 'Machine Standard Operating Procedures (SOPs)',
      category: 'MACHINE_SOP',
      modules: {
        create: [
          {
            title: 'Forklift Pre-Shift Walkaround Check',
            durationSeconds: 120,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            audioTracks: JSON.stringify({
              en: '/audio/en/forklift-sop.mp3',
              hi: '/audio/hi/forklift-sop.mp3',
            }),
          },
          {
            title: 'Lockout / Tagout (LOTO) Zero-Energy Protocol',
            durationSeconds: 150,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            audioTracks: JSON.stringify({
              en: '/audio/en/loto-sop.mp3',
              hi: '/audio/hi/loto-sop.mp3',
            }),
          },
        ],
      },
    },
  });

  // 4. Create Pillar 3: Quality 5S
  await prisma.course.create({
    data: {
      title: '5S Shop Floor Organization & Defect Identification',
      category: 'QUALITY_5S',
      modules: {
        create: [
          {
            title: '5S Daily Routine: Sort, Shine & Standardize',
            durationSeconds: 95,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
            audioTracks: JSON.stringify({
              en: '/audio/en/5s-routine.mp3',
            }),
          },
        ],
      },
    },
  });

  console.log('✅ Created 3 Courses & 5 Microlearning Modules with Quizzes');

  // 5. Create Machine Assets for QR Triggers
  const allModules = await prisma.module.findMany();
  const forkliftModule = allModules.find((m) => m.title.includes('Forklift'));
  const lotoModule = allModules.find((m) => m.title.includes('Lockout'));

  if (forkliftModule) {
    await prisma.machineAsset.create({
      data: {
        qrCodeId: 'MACH-FORK-04',
        name: 'High-Reach Electric Forklift #04',
        plantLocation: 'Bay B - Warehouse Logistics',
        linkedModuleId: forkliftModule.id,
      },
    });
  }

  if (lotoModule) {
    await prisma.machineAsset.create({
      data: {
        qrCodeId: 'MACH-CNC-12',
        name: '5-Axis Heavy CNC Mill #12',
        plantLocation: 'Shop Floor 1 - Machining Line',
        linkedModuleId: lotoModule.id,
      },
    });
  }

  // 6. Record Initial Completion for Worker 1 (Ramesh)
  const firstModule = allModules[0];
  if (firstModule) {
    await prisma.completion.create({
      data: {
        userId: worker1.id,
        moduleId: firstModule.id,
        score: 100,
        isPassed: true,
        isOfflineSynced: false,
      },
    });

    await prisma.practicalAudit.create({
      data: {
        workerId: worker1.id,
        supervisorId: supervisor.id,
        checklistName: 'PPE & Safety Harness Physical Fit Check',
        passed: true,
        notes: 'Proper 3-point harness check observed before ascending.',
        signatureUrl: 'data:image/svg+xml;utf8,<svg>Verified-DavidMiller</svg>',
      },
    });
  }

  console.log('✅ Seeded Initial Machine Assets & Verified Audit History');
  console.log('🎉 Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

