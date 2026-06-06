import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import authorize from '../../middleware/roleMiddleware.js';
import { rfqUpload } from '../../middleware/upload.js';
import validate from '../../middleware/validationMiddleware.js';
import { assignVendorsHandler, createRfqHandler, deleteRfqHandler, getComparisonHandler, getRfqHandler, listAttachmentsHandler, listRfqsHandler, updateRfqHandler, uploadAttachmentHandler } from './rfqs.controller.js';
import { rfqCreateSchema, rfqUpdateSchema, vendorAssignSchema } from './rfqs.validation.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', authorize('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'), listRfqsHandler);
router.get('/:id', authorize('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'), getRfqHandler);
router.post('/', authorize('ADMIN', 'PROCUREMENT_OFFICER'), validate(rfqCreateSchema), createRfqHandler);
router.put('/:id', authorize('ADMIN', 'PROCUREMENT_OFFICER'), validate(rfqUpdateSchema), updateRfqHandler);
router.delete('/:id', authorize('ADMIN'), deleteRfqHandler);
router.post('/:id/vendors', authorize('ADMIN', 'PROCUREMENT_OFFICER'), validate(vendorAssignSchema), assignVendorsHandler);
router.post('/:id/upload', authorize('ADMIN', 'PROCUREMENT_OFFICER'), rfqUpload.single('file'), uploadAttachmentHandler);
router.get('/:id/attachments', authorize('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'), listAttachmentsHandler);
router.get('/:id/comparison', authorize('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER'), getComparisonHandler);

export default router;
