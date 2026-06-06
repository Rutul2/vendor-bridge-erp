import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import authorize from '../../middleware/roleMiddleware.js';
import { listNotificationsHandler, markReadHandler, markAllReadHandler, createNotificationHandler } from './notifications.controller.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', authorize('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'), listNotificationsHandler);
router.post('/', authorize('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER'), createNotificationHandler);
router.patch('/:id/read', authorize('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'), markReadHandler);
router.post('/read-all', authorize('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'), markAllReadHandler);

export default router;
