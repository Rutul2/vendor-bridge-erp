import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import authorize from '../../middleware/roleMiddleware.js';
import validate from '../../middleware/validationMiddleware.js';
import { approveHandler, createApprovalHandler, getApprovalHandler, listApprovalsHandler, rejectHandler } from './approvals.controller.js';
import { approvalCreateSchema, approvalSchema } from './approvals.validation.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', authorize('ADMIN', 'MANAGER', 'PROCUREMENT_OFFICER'), listApprovalsHandler);
router.get('/:id', authorize('MANAGER', 'PROCUREMENT_OFFICER'), getApprovalHandler);
router.post('/', authorize('PROCUREMENT_OFFICER'), validate(approvalCreateSchema), createApprovalHandler);
router.post('/:id/approve', authorize('MANAGER'), validate(approvalSchema), approveHandler);
router.post('/:id/reject', authorize('MANAGER'), validate(approvalSchema), rejectHandler);

export default router;
