import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import authorize from '../../middleware/roleMiddleware.js';
import { getVendorRfqHandler, listVendorRfqsHandler } from './vendor-rfqs.controller.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/rfqs', authorize('VENDOR'), listVendorRfqsHandler);
router.get('/rfqs/:id', authorize('VENDOR'), getVendorRfqHandler);

export default router;
