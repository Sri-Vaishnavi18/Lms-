import { SHORTS_DATABASE, ShortVideo } from './shortsData';

export interface CourseQuiz {
  id: string;
  title: string;
  type: 'SPOT_THE_HAZARD' | 'SWIPE_DECISION' | 'TIME_TRIAL';
  question: string;
  imageUrl?: string;
  hazardTargets?: { id: string; x: number; y: number; label: string }[];
  options: { text: string; isCorrect: boolean; explanation: string }[];
}

export interface PracticalAssignment {
  id: string;
  title: string;
  instructions: string;
  requiredProof: string;
  sampleImageUrl: string;
  voiceNotePrompt: string;
}

export interface CatalogCourse {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  sector: string;
  sectorLabel: string;
  sectorIcon: string;
  skillTier: string;
  tierLabel: string;
  tierBadgeClass: string;
  thumbnailUrl: string;
  instructor: {
    name: string;
    role: string;
    organization: string;
    avatar: string;
  };
  rating: number;
  reviewsCount: number;
  enrolledCount: number;
  totalDurationMinutes: number;
  lessonsCount: number;
  hasPracticalAssignment: boolean;
  wageIncentive: string;
  modules: {
    id: string;
    title: string;
    durationMinutes: number;
    type: 'VIDEO' | 'LIVE' | 'QUIZ' | 'ASSIGNMENT';
    videoUrl?: string;
  }[];
  relatedShorts: ShortVideo[];
  relatedQuizzes: CourseQuiz[];
  practicalAssignment: PracticalAssignment;
}

export const COURSES_CATALOG: CatalogCourse[] = [
  {
    id: 'course-const-01',
    title: 'Scaffolding & Working at Heights Safety Masterclass',
    subtitle: 'Comprehensive 100% tie-off protocols, harness pre-use inspection, and perimeter debris prevention.',
    category: 'EHS',
    sector: 'CONSTRUCTION',
    sectorLabel: 'Construction',
    sectorIcon: '🏗️',
    skillTier: 'UNSKILLED',
    tierLabel: 'Tier 1: Unskilled',
    tierBadgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=800&auto=format&fit=crop&q=80',
    instructor: {
      name: 'Er. Rajesh Kulkarni',
      role: 'Chief EHS Safety Director',
      organization: 'National Safety Council India',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    rating: 4.9,
    reviewsCount: 2410,
    enrolledCount: 14850,
    totalDurationMinutes: 18,
    lessonsCount: 4,
    hasPracticalAssignment: true,
    wageIncentive: 'Unlocks Tier 2: Semi-Skilled Scaffolder & +₹1,200/mo Site Allowance',
    modules: [
      { id: 'm-const-1', title: 'Full-Body Harness Pre-Use Check & D-Ring Inspection', durationMinutes: 4, type: 'VIDEO', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
      { id: 'm-const-2', title: '3-Point Contact on Vertical Scaffolding Ladders', durationMinutes: 3, type: 'VIDEO', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
      { id: 'm-const-3', title: 'Spot-the-Hazard: Unsecured Toe Boards & Fall Zone', durationMinutes: 5, type: 'QUIZ' },
      { id: 'm-const-4', title: 'Practical Field Proof: Photo of Double Lanyard Tie-off', durationMinutes: 6, type: 'ASSIGNMENT' },
    ],
    relatedShorts: SHORTS_DATABASE.filter((s) => s.courseId === 'course-const-01'),
    relatedQuizzes: [
      {
        id: 'quiz-c1-01',
        title: 'Spot the Height Safety Violation',
        type: 'SPOT_THE_HAZARD',
        question: 'Identify the fatal hazard on the scaffolding work platform.',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
        options: [
          { text: 'Worker climbing ladder with full paint bucket in one hand (violating 3-point rule)', isCorrect: true, explanation: 'Correct! Both hands must be free for ladder grip; tools must be hoisted.' },
          { text: 'Worker wearing high-visibility orange vest', isCorrect: false, explanation: 'High-visibility vests are required PPE.' },
          { text: 'Scaffolding couplers tightened with steel spanner', isCorrect: false, explanation: 'Couplers must be tightened properly.' },
        ],
      },
      {
        id: 'quiz-c1-02',
        title: 'Harness D-Ring Pre-Check Speed Quiz',
        type: 'TIME_TRIAL',
        question: 'What is the maximum allowed fall arrest lanyard deceleration distance?',
        options: [
          { text: '1.75 meters (approx 5.7 feet)', isCorrect: true, explanation: 'Correct per IS 3696 & OSHA standards.' },
          { text: '5.0 meters', isCorrect: false, explanation: 'Excessive distance causes ground strike.' },
          { text: 'No limit as long as rope does not snap', isCorrect: false, explanation: 'Shock load must be arrested.' },
        ],
      },
    ],
    practicalAssignment: {
      id: 'assign-const-01',
      title: 'Scaffolding Double Lanyard 100% Tie-Off Proof',
      instructions: 'While safely anchored on a working platform, take a photo showing your harness rear dorsal D-ring securely fastened to an overhead anchorage line.',
      requiredProof: 'Clear site photo showing harness leg straps adjusted and lanyard carabiner locked.',
      sampleImageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=800&auto=format&fit=crop&q=80',
      voiceNotePrompt: 'Record a 15-second voice note explaining the 3-point ladder contact rule in your native language.',
    },
  },
  {
    id: 'course-log-03',
    title: 'Counterbalance Forklift & Yard Logistics Operator',
    subtitle: 'Pre-shift horn and brake circle checks, load center dynamics, and pedestrian blind spot safety.',
    category: 'MACHINE_SOP',
    sector: 'LOGISTICS',
    sectorLabel: 'Transportation & Logistics',
    sectorIcon: '🚚',
    skillTier: 'SEMI_SKILLED',
    tierLabel: 'Tier 2: Semi-Skilled',
    tierBadgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    instructor: {
      name: 'Vikram Sengupta',
      role: 'Warehouse Operations Superintendent',
      organization: 'National Logistics Board',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    rating: 4.92,
    reviewsCount: 3120,
    enrolledCount: 22100,
    totalDurationMinutes: 20,
    lessonsCount: 4,
    hasPracticalAssignment: true,
    wageIncentive: 'Unlocks Certified Heavy Forklift Pilot & +₹1,800/mo Shift Differential',
    modules: [
      { id: 'm-log-1', title: 'Forklift 45-Second Daily Pre-Shift Circle Check', durationMinutes: 4, type: 'VIDEO', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
      { id: 'm-log-2', title: 'Reverse Blind Spots & 2-Beep Horn Protocol', durationMinutes: 4, type: 'VIDEO', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
      { id: 'm-log-3', title: 'Swipe-Decision: Stable vs Unstable Pallet Stacks', durationMinutes: 6, type: 'QUIZ' },
      { id: 'm-log-4', title: 'Practical Proof: Photo of Pre-Shift Inspection Sheet', durationMinutes: 6, type: 'ASSIGNMENT' },
    ],
    relatedShorts: SHORTS_DATABASE.filter((s) => s.courseId === 'course-log-03'),
    relatedQuizzes: [
      {
        id: 'quiz-l1-01',
        title: 'Forklift Reversing Safety Protocol',
        type: 'TIME_TRIAL',
        question: 'What is mandatory before moving a forklift backwards down a busy warehouse aisle?',
        options: [
          { text: 'Sound horn twice and look in direction of travel', isCorrect: true, explanation: 'Correct! Alerts pedestrians in blind spots.' },
          { text: 'Accelerate to quickly clear the pedestrian crossing', isCorrect: false, explanation: 'High speed increases braking distance.' },
          { text: 'Only monitor the front mast', isCorrect: false, explanation: 'You must look where the machine is traveling.' },
        ],
      },
    ],
    practicalAssignment: {
      id: 'assign-log-01',
      title: 'Forklift Pre-Shift Walkaround Circle Check',
      instructions: 'Perform the daily walkaround and take a photo of the signed physical inspection tag showing tire pressure, hydraulic fluid, and horn operation.',
      requiredProof: 'Photo of the forklift steering wheel lockout tag or daily inspection log.',
      sampleImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
      voiceNotePrompt: 'Record an audio note describing what you do if hydraulic fluid level is below MIN mark.',
    },
  },
  {
    id: 'course-mfg-02',
    title: 'CNC Mill & Stamping Press Lockout-Tagout (LOTO)',
    subtitle: 'Zero mechanical and pneumatic energy isolation, personal padlock rules, and arc flash avoidance.',
    category: 'MACHINE_SOP',
    sector: 'MANUFACTURING',
    sectorLabel: 'Manufacturing & Machining',
    sectorIcon: '🏭',
    skillTier: 'SKILLED',
    tierLabel: 'Tier 3: Skilled',
    tierBadgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    instructor: {
      name: 'Anil Verma',
      role: 'Precision Machining & Tooling Lead',
      organization: 'Central Tool Training Institute',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
    },
    rating: 4.85,
    reviewsCount: 1890,
    enrolledCount: 9400,
    totalDurationMinutes: 25,
    lessonsCount: 5,
    hasPracticalAssignment: true,
    wageIncentive: 'Unlocks Tier 4: Master Lead Operator & +₹2,500/mo Machinist Allowance',
    modules: [
      { id: 'm-mfg-1', title: 'The 6 Steps of Zero Energy Mechanical Isolation', durationMinutes: 5, type: 'VIDEO', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' },
      { id: 'm-mfg-2', title: 'Applying Personal Red Padlock & Danger Tag', durationMinutes: 4, type: 'VIDEO', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' },
      { id: 'm-mfg-3', title: 'Live Demonstration: High-Voltage LOTO & Stored Pressure Bleed', durationMinutes: 8, type: 'LIVE' },
      { id: 'm-mfg-4', title: 'Spot-the-Hazard: Unisolated Air Reservoir Valve', durationMinutes: 4, type: 'QUIZ' },
      { id: 'm-mfg-5', title: 'Practical Proof: Photo of Affixed LOTO Lock & Tag', durationMinutes: 4, type: 'ASSIGNMENT' },
    ],
    relatedShorts: SHORTS_DATABASE.filter((s) => s.courseId === 'course-mfg-02'),
    relatedQuizzes: [
      {
        id: 'quiz-m1-01',
        title: 'CNC Spindle Chip Hook Safety',
        type: 'TIME_TRIAL',
        question: 'What is the required procedure for removing curly swarf from a CNC bed?',
        options: [
          { text: 'Wait for complete spindle stop, use brass hook and safety glasses', isCorrect: true, explanation: 'Correct! Never use bare hands or cotton rags.' },
          { text: 'Grab quickly with gloved hand while spindle idles', isCorrect: false, explanation: 'Extreme laceration and amputation hazard.' },
          { text: 'Use compressed air to blow swarf towards aisle', isCorrect: false, explanation: 'Air jets fling metal shrapnel at nearby workers.' },
        ],
      },
    ],
    practicalAssignment: {
      id: 'assign-mfg-01',
      title: 'Machine LOTO Padlock Verification Proof',
      instructions: 'Take a clear photograph of your personal red LOTO padlock and danger tag affixed to the main pneumatic/electrical disconnect of the CNC machine.',
      requiredProof: 'Photo showing lock shank engaged and danger tag with your name and shift date.',
      sampleImageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
      voiceNotePrompt: 'Record a voice note stating your name, badge ID, and verifying you bled stored air pressure.',
    },
  },
  {
    id: 'course-tech-04',
    title: 'High-Voltage Switchgear & Substation Arc Flash Safety',
    subtitle: '415V to 11kV distribution board maintenance, calibrated multimeter zero-voltage checks, and NFPA 70E PPE.',
    category: 'EHS',
    sector: 'SKILLED_TECHNICAL',
    sectorLabel: 'Skilled Technical',
    sectorIcon: '⚡',
    skillTier: 'HIGHLY_SKILLED',
    tierLabel: 'Tier 4: Master Lead',
    tierBadgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    thumbnailUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    instructor: {
      name: 'Pooja Sharma',
      role: 'Certified High Voltage Electrical Engineer',
      organization: 'Power Grid Safety Council',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    rating: 4.95,
    reviewsCount: 1450,
    enrolledCount: 6800,
    totalDurationMinutes: 24,
    lessonsCount: 4,
    hasPracticalAssignment: true,
    wageIncentive: 'Unlocks Chief Substation In-Charge & +₹3,200/mo Master Electrician Pay',
    modules: [
      { id: 'm-tech-1', title: 'Arc Flash Boundary Calculation & Category 4 Suits', durationMinutes: 6, type: 'VIDEO', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
      { id: 'm-tech-2', title: 'Zero Voltage Proving Unit & Calibrated Multimeter Protocol', durationMinutes: 5, type: 'VIDEO', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
      { id: 'm-tech-3', title: 'Spot-the-Hazard: Ungrounded Phase Busbar', durationMinutes: 5, type: 'QUIZ' },
      { id: 'm-tech-4', title: 'Practical Proof: Upload Photo of 3-Phase Multimeter 0.0V', durationMinutes: 8, type: 'ASSIGNMENT' },
    ],
    relatedShorts: SHORTS_DATABASE.filter((s) => s.courseId === 'course-tech-04'),
    relatedQuizzes: [
      {
        id: 'quiz-t1-01',
        title: 'Zero Voltage Proving Protocol',
        type: 'TIME_TRIAL',
        question: 'What is the required order of tests for verifying dead circuits (Live-Dead-Live)?',
        options: [
          { text: 'Test known live proving unit -> Test work circuit -> Retest live proving unit', isCorrect: true, explanation: 'Correct! Proves meter was functioning before and after test.' },
          { text: 'Touch busbar quickly with back of fingers', isCorrect: false, explanation: 'Causes fatal electrocution.' },
          { text: 'Rely on green indicator light on panel door', isCorrect: false, explanation: 'Indicator bulb could be burnt out.' },
        ],
      },
    ],
    practicalAssignment: {
      id: 'assign-tech-01',
      title: '3-Phase Multimeter 0.0V Verification',
      instructions: 'Take a photograph showing your calibrated CAT IV multimeter reading 0.0V across all three phases with earth clamp grounded.',
      requiredProof: 'Clear photo of multimeter screen showing 0.00V and insulated 1000V probe tips.',
      sampleImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
      voiceNotePrompt: 'Record a voice note stating voltage reading and confirmation of earth ground discharge.',
    },
  },
  {
    id: 'course-agri-05',
    title: 'Harvester Tractor & PTO Machinery Operational Safety',
    subtitle: 'Rotating shaft bell guards, hydraulic implements locking pins, and roll-over protection structure (ROPS).',
    category: 'MACHINE_SOP',
    sector: 'AGRICULTURE',
    sectorLabel: 'Agricultural & Allied',
    sectorIcon: '🌾',
    skillTier: 'SEMI_SKILLED',
    tierLabel: 'Tier 2: Semi-Skilled',
    tierBadgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    thumbnailUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
    instructor: {
      name: 'Balwant Singh',
      role: 'Senior Farm Machinery Safety Officer',
      organization: 'Agricultural Mechanization Board',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    },
    rating: 4.88,
    reviewsCount: 980,
    enrolledCount: 5200,
    totalDurationMinutes: 16,
    lessonsCount: 3,
    hasPracticalAssignment: true,
    wageIncentive: 'Unlocks Certified Harvester Pilot & +₹1,400/mo Equipment Allowance',
    modules: [
      { id: 'm-agri-1', title: 'Tractor PTO Shaft Master Bell Guard Pre-Check', durationMinutes: 5, type: 'VIDEO', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4' },
      { id: 'm-agri-2', title: 'Hydraulic Hitch Positive Lock & Pressure Release', durationMinutes: 4, type: 'VIDEO', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4' },
      { id: 'm-agri-3', title: 'Practical Proof: Photo of PTO Guard Retaining Chain Secured', durationMinutes: 7, type: 'ASSIGNMENT' },
    ],
    relatedShorts: SHORTS_DATABASE.filter((s) => s.courseId === 'course-agri-05'),
    relatedQuizzes: [
      {
        id: 'quiz-a1-01',
        title: 'PTO Shaft Rotation Danger',
        type: 'TIME_TRIAL',
        question: 'At 540 RPM, how fast will a tractor PTO wrap loose cloth or hair?',
        options: [
          { text: 'In approximately 0.1 seconds (faster than human blink)', isCorrect: true, explanation: 'Correct! Clothing is entangled instantly.' },
          { text: 'Takes 15-20 seconds', isCorrect: false, explanation: 'Untrue; rotational torque is instantaneous.' },
        ],
      },
    ],
    practicalAssignment: {
      id: 'assign-agri-01',
      title: 'PTO Shield & Retaining Chain Check',
      instructions: 'Take a photo showing the yellow plastic PTO master bell shield intact and the anti-spin retaining chain hooked to the tractor frame.',
      requiredProof: 'Photo showing undamaged yellow guard and locking pin.',
      sampleImageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
      voiceNotePrompt: 'Record a voice note describing how you test the guard rotates freely by hand with engine off.',
    },
  },
  {
    id: 'course-clean-06',
    title: 'Industrial Chemical Handling & Bio-Hazard Sanitation',
    subtitle: 'Acid dilution safety (A&W rule), PPE decontamination, and OSHA compliant HazCom labeling.',
    category: 'EHS',
    sector: 'CLEANING_MAINTENANCE',
    sectorLabel: 'Cleaning & Maintenance',
    sectorIcon: '🧹',
    skillTier: 'UNSKILLED',
    tierLabel: 'Tier 1: Unskilled',
    tierBadgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop&q=80',
    instructor: {
      name: 'Sunita Devi',
      role: 'Sanitation Compliance Supervisor',
      organization: 'Facility Services Federation',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    },
    rating: 4.82,
    reviewsCount: 1640,
    enrolledCount: 8900,
    totalDurationMinutes: 15,
    lessonsCount: 3,
    hasPracticalAssignment: true,
    wageIncentive: 'Unlocks Tier 2: Hazardous Sanitation Technician & +₹1,100/mo Pay',
    modules: [
      { id: 'm-clean-1', title: 'The A&W Rule: Adding Acid into Water Safely', durationMinutes: 4, type: 'VIDEO', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4' },
      { id: 'm-clean-2', title: 'Spot-the-Hazard: Unlabeled Secondary Chemical Container', durationMinutes: 5, type: 'QUIZ' },
      { id: 'm-clean-3', title: 'Practical Proof: Photo of SDS Label & Eye Wash Clearance', durationMinutes: 6, type: 'ASSIGNMENT' },
    ],
    relatedShorts: SHORTS_DATABASE.filter((s) => s.courseId === 'course-clean-06'),
    relatedQuizzes: [
      {
        id: 'quiz-cl1-01',
        title: 'Chemical Dilution Protocol',
        type: 'TIME_TRIAL',
        question: 'What happens if you pour water directly into a bucket of concentrated acid?',
        options: [
          { text: 'Causes an exothermic violent acid eruption splashing face and eyes', isCorrect: true, explanation: 'Correct! Always add acid slowly to water (A&W rule).' },
          { text: 'Dissolves peacefully without heat', isCorrect: false, explanation: 'Exothermic reaction boils water instantly.' },
        ],
      },
    ],
    practicalAssignment: {
      id: 'assign-clean-01',
      title: 'SDS GHS Label & Eyewash Station Clearance',
      instructions: 'Take a photo of the OSHA GHS warning label affixed to your dilution spray bottle and verify unobstructed access to the emergency eyewash.',
      requiredProof: 'Photo showing GHS pictograms and clear path to safety wash station.',
      sampleImageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop&q=80',
      voiceNotePrompt: 'Record a voice note explaining how long you flush eyes in an emergency (minimum 15 mins).',
    },
  },
  {
    id: 'course-hosp-07',
    title: 'Commercial Kitchen Food Safety & Hot Oil Fire Protocol',
    subtitle: 'Deep fryer boil-over mitigation, Class K wet chemical fire suppression, and cold chain temperature logs.',
    category: 'EHS',
    sector: 'HOSPITALITY_SERVICE',
    sectorLabel: 'Hospitality & Service',
    sectorIcon: '🍳',
    skillTier: 'SKILLED',
    tierLabel: 'Tier 3: Skilled',
    tierBadgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    instructor: {
      name: 'Chef Anthony Murmu',
      role: 'Executive Chef & Food Safety Auditor',
      organization: 'Culinary Hygiene Guild',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    rating: 4.91,
    reviewsCount: 2050,
    enrolledCount: 11200,
    totalDurationMinutes: 19,
    lessonsCount: 4,
    hasPracticalAssignment: true,
    wageIncentive: 'Unlocks Station Lead Cook & +₹1,600/mo Hygiene Incentive',
    modules: [
      { id: 'm-hosp-1', title: 'Commercial Deep Fryer Ice Chunk Hazard Mitigation', durationMinutes: 4, type: 'VIDEO', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
      { id: 'm-hosp-2', title: 'Operating Class K Wet Chemical Fire Extinguishers', durationMinutes: 4, type: 'VIDEO', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' },
      { id: 'm-hosp-3', title: 'Spot-the-Hazard: Cross Contamination on Cutting Boards', durationMinutes: 5, type: 'QUIZ' },
      { id: 'm-hosp-4', title: 'Practical Proof: Photo of HACCP Refrigerator Temperature Log', durationMinutes: 6, type: 'ASSIGNMENT' },
    ],
    relatedShorts: SHORTS_DATABASE.filter((s) => s.courseId === 'course-hosp-07'),
    relatedQuizzes: [
      {
        id: 'quiz-h1-01',
        title: 'Deep Fryer Boiling Oil Safety',
        type: 'TIME_TRIAL',
        question: 'What is the required action if a commercial fryer catches fire?',
        options: [
          { text: 'Cut gas/power, deploy Class K wet chemical extinguisher, NEVER use water', isCorrect: true, explanation: 'Correct! Water on oil fires causes violent explosive fireball.' },
          { text: 'Throw a bucket of cold water over the hot oil', isCorrect: false, explanation: 'Creates a catastrophic fireball explosion.' },
        ],
      },
    ],
    practicalAssignment: {
      id: 'assign-hosp-01',
      title: 'HACCP Deep Fryer Temperature & Oil Filter Check',
      instructions: 'Take a photo of the fryer digital thermometer showing temperature between 175°C and 190°C and verify the Class K fire extinguisher inspection tag.',
      requiredProof: 'Photo of the oil thermometer reading and class K extinguisher inspection tag.',
      sampleImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      voiceNotePrompt: 'Record a voice note explaining how you shake off ice crystals before dropping fries in oil.',
    },
  },
];
