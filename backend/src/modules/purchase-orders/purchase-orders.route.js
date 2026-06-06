import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import authorize from '../../middleware/roleMiddleware.js';
import validate from '../../middleware/validationMiddleware.js';
import { createPurchaseOrderHandler, getPurchaseOrderHandler, listPurchaseOrdersHandler, updatePurchaseOrderStatusHandler } from './purchase-orders.controller.js';
import { purchaseOrderCreateSchema } from './purchase-orders.validation.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', authorize('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'), listPurchaseOrdersHandler);
router.get('/:id', authorize('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'), getPurchaseOrderHandler);
router.post('/', authorize('PROCUREMENT_OFFICER', 'ADMIN'), validate(purchaseOrderCreateSchema), createPurchaseOrderHandler);
router.put('/:id/status', authorize('PROCUREMENT_OFFICER', 'ADMIN'), updatePurchaseOrderStatusHandler);

export default router;
