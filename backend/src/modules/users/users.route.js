import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import authorize from '../../middleware/roleMiddleware.js';
import validate from '../../middleware/validationMiddleware.js';
import { createUserHandler, deleteUserHandler, getUserHandler, listUsersHandler, updateUserHandler, getMeHandler } from './users.controller.js';
import { userCreateSchema, userUpdateSchema } from './users.validation.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/me', getMeHandler);

// Allow Procurement Officers to list users so they can pick a Manager for approvals
router.get('/', authorize('ADMIN', 'PROCUREMENT_OFFICER'), listUsersHandler);
router.get('/:id', authorize('ADMIN'), getUserHandler);

router.use(authorize('ADMIN'));
router.post('/', validate(userCreateSchema), createUserHandler);
router.put('/:id', validate(userUpdateSchema), updateUserHandler);
router.delete('/:id', deleteUserHandler);

export default router;
