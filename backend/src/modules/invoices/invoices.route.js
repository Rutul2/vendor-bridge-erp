import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import authorize from '../../middleware/roleMiddleware.js';
import validate from '../../middleware/validationMiddleware.js';
import { createInvoiceHandler, emailInvoiceHandler, getInvoiceHandler, getInvoicePdfHandler, listInvoicesHandler, updateInvoiceStatusHandler } from './invoices.controller.js';
import { emailInvoiceSchema, invoiceCreateSchema } from './invoices.validation.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', authorize('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'), listInvoicesHandler);
router.get('/:id', authorize('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'), getInvoiceHandler);
router.post('/', authorize('PROCUREMENT_OFFICER', 'ADMIN'), validate(invoiceCreateSchema), createInvoiceHandler);
router.get('/:id/pdf', authorize('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'), getInvoicePdfHandler);
router.post('/:id/email', authorize('PROCUREMENT_OFFICER', 'ADMIN'), validate(emailInvoiceSchema), emailInvoiceHandler);
router.put('/:id/status', authorize('PROCUREMENT_OFFICER', 'ADMIN', 'MANAGER'), updateInvoiceStatusHandler);

export default router;
