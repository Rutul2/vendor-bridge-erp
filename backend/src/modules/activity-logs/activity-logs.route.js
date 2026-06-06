import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import authorize from '../../middleware/roleMiddleware.js';
import { listActivityLogsHandler } from './activity-logs.controller.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', authorize('ADMIN', 'MANAGER'), listActivityLogsHandler);

export default router;
