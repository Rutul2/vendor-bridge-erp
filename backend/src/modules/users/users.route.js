import express from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';
import authorize from '../../middleware/roleMiddleware.js';
import validate from '../../middleware/validationMiddleware.js';
import { createUserHandler, deleteUserHandler, getUserHandler, listUsersHandler, updateUserHandler, getMeHandler } from './users.controller.js';
import { userCreateSchema, userUpdateSchema } from './users.validation.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/me', getMeHandler);

router.use(authorize('ADMIN'));
router.get('/', listUsersHandler);
router.get('/:id', getUserHandler);
router.post('/', validate(userCreateSchema), createUserHandler);
router.put('/:id', validate(userUpdateSchema), updateUserHandler);
router.delete('/:id', deleteUserHandler);

export default router;
