import express from 'express';
import activityLogRoutes from '../modules/activity-logs/activity-logs.route.js';
import analyticsRoutes from '../modules/analytics/analytics.route.js';
import approvalRoutes from '../modules/approvals/approvals.route.js';
import authRoutes from '../modules/auth/auth.route.js';
import invoiceRoutes from '../modules/invoices/invoices.route.js';
import notificationRoutes from '../modules/notifications/notifications.route.js';
import purchaseOrderRoutes from '../modules/purchase-orders/purchase-orders.route.js';
import quotationRoutes from '../modules/quotations/quotations.route.js';
import rfqRoutes from '../modules/rfqs/rfqs.route.js';
import userRoutes from '../modules/users/users.route.js';
import vendorRfqRoutes from '../modules/vendor/vendor-rfqs.route.js';
import vendorRoutes from '../modules/vendors/vendors.route.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/vendors', vendorRoutes);
router.use('/rfqs', rfqRoutes);
router.use('/quotations', quotationRoutes);
router.use('/approvals', approvalRoutes);
router.use('/purchase-orders', purchaseOrderRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/activity-logs', activityLogRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/vendor', vendorRfqRoutes);

export default router;
