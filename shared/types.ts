export type Role = 'WORKER' | 'SUPERVISOR' | 'ADMIN';

export type QuizType = 'SPOT_THE_HAZARD' | 'SWIPE_DECISION' | 'SEQUENCE_ORDER';

export interface User {
  id: string;
  phoneNumber: string;
  badgeId: string;
  fullName: string;
  role: Role;
  preferredLanguage: string;
  siteLocation: string;
  department: string;
  createdAt: string;
}

export interface AudioTrackMap {
  [languageCode: string]: string; // e.g. "en": "/audio/en/fire-pass.mp3", "hi": "/audio/hi/fire-pass.mp3"
}

export interface HazardCoordinate {
  id: string;
  name: string;
  xPercent: number; // 0 to 100 percentage of image width
  yPercent: number; // 0 to 100 percentage of image height
  radiusPercent: number; // acceptable tap zone radius
  explanation: string;
}

export interface SwipeCard {
  id: string;
  imageUrl: string;
  caption: string;
  isSafe: boolean; // swipe right = true, swipe left = false
  explanation: string;
}

export interface QuizQuestionData {
  imageUrl?: string;
  hazardTargets?: HazardCoordinate[];
  swipeCards?: SwipeCard[];
  sequenceItems?: { id: string; stepNumber: number; text: string; imageUrl?: string }[];
}

export interface Quiz {
  id: string;
  moduleId: string;
  type: QuizType;
  promptAudio: AudioTrackMap;
  questionData: QuizQuestionData;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  durationSeconds: number;
  videoUrl: string;
  audioTracks: AudioTrackMap;
  quizzes?: Quiz[];
  category?: string;
}

export interface Course {
  id: string;
  title: string;
  category: 'EHS' | 'MACHINE_SOP' | 'QUALITY_5S' | 'CONDUCT' | 'DIGITAL_LITERACY';
  modules: Module[];
  createdAt: string;
}

export interface CompletionRecord {
  id: string;
  userId: string;
  moduleId: string;
  score: number;
  isPassed: boolean;
  completedAt: string;
  isOfflineSynced: boolean;
}

export interface PracticalAuditRecord {
  id: string;
  workerId: string;
  supervisorId: string;
  checklistName: string;
  passed: boolean;
  notes?: string;
  signatureUrl: string;
  verifiedAt: string;
}

export interface MachineAsset {
  id: string;
  qrCodeId: string;
  name: string;
  plantLocation: string;
  linkedModuleId: string;
  qrCodeDataUrl?: string;
  createdAt: string;
}

export interface OfflineSyncItem {
  id: string; // client-generated UUID
  userId: string;
  moduleId: string;
  score: number;
  isPassed: boolean;
  clientTimestamp: string;
  answersPayload?: any;
}

export interface OfflineSyncPayload {
  items: OfflineSyncItem[];
}

export interface ComplianceMatrixSummary {
  siteLocation: string;
  department: string;
  totalWorkers: number;
  certifiedWorkers: number;
  compliancePercentage: number;
  expiringCertificatesCount: number;
}

