import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import authorize from '../../middleware/roleMiddleware.js';
import validate from '../../middleware/validationMiddleware.js';
import { createVendorHandler, deleteVendorHandler, getVendorHandler, listVendorsHandler, updateVendorHandler } from './vendors.controller.js';
import { vendorCreateSchema, vendorUpdateSchema } from './vendors.validation.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', authorize('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'), listVendorsHandler);
router.get('/:id', authorize('ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'), getVendorHandler);
router.post('/', authorize('ADMIN'), validate(vendorCreateSchema), createVendorHandler);
router.put('/:id', authorize('ADMIN'), validate(vendorUpdateSchema), updateVendorHandler);
router.delete('/:id', authorize('ADMIN'), deleteVendorHandler);

export default router;
