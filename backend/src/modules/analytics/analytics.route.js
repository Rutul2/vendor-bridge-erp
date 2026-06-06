import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import authorize from '../../middleware/roleMiddleware.js';
import { dashboardHandler, monthlyTrendsHandler, spendingHandler, vendorsHandler } from './analytics.controller.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/dashboard', authorize('ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER'), dashboardHandler);
router.get('/vendors', authorize('ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER'), vendorsHandler);
router.get('/spending', authorize('ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER'), spendingHandler);
router.get('/monthly-trends', authorize('ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER'), monthlyTrendsHandler);

export default router;
