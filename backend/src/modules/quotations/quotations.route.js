import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import authorize from '../../middleware/roleMiddleware.js';
import validate from '../../middleware/validationMiddleware.js';
import { createQuotationHandler, getQuotationHandler, listQuotationsHandler, updateQuotationHandler } from './quotations.controller.js';
import { quotationCreateSchema, quotationUpdateSchema } from './quotations.validation.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', authorize('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'), listQuotationsHandler);
router.get('/:id', authorize('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'), getQuotationHandler);
router.post('/', authorize('VENDOR'), validate(quotationCreateSchema), createQuotationHandler);
router.put('/:id', authorize('VENDOR', 'PROCUREMENT_OFFICER', 'ADMIN'), validate(quotationUpdateSchema), updateQuotationHandler);

export default router;
