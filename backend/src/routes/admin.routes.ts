import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';

const router = Router();

// Compliance & Asset Management
router.get('/compliance-matrix', AdminController.getComplianceMatrix);
router.get('/machine-assets', AdminController.getMachineAssets);
router.post('/machine-assets', AdminController.createMachineAsset);
router.get('/audit-reports', AdminController.getAuditReports);

// Full User Management (Terminate, Change Password, Edit, List)
router.get('/users', AdminController.listUsers);
router.post('/users', AdminController.createUser);
router.get('/users/:id', AdminController.getUserDetails);
router.patch('/users/:id', AdminController.updateUser);
router.post('/users/:id/terminate', AdminController.terminateUser);
router.post('/users/:id/reset-password', AdminController.resetPassword);

// Attendance Management
router.get('/attendance', AdminController.listAttendance);
router.post('/attendance', AdminController.markAttendance);

// Course & Module Studio (Upload Live & Recorded sessions)
router.post('/courses', AdminController.createCourse);
router.post('/modules', AdminController.createModule);

// Assignments Review
router.get('/submissions', AdminController.listSubmissions);
router.patch('/submissions/:id', AdminController.reviewSubmission);

// Analytics
router.get('/analytics/category-wise', AdminController.getCategoryAnalytics);

export default router;
