import express from 'express';
import validate from '../../middleware/validationMiddleware.js';
import { forgotPasswordHandler, loginHandler, refreshTokenHandler, resetPasswordHandler, signupHandler } from './auth.controller.js';
import { forgotPasswordSchema, loginSchema, refreshTokenSchema, resetPasswordSchema, signupSchema } from './auth.validation.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signupHandler);
router.post('/login', validate(loginSchema), loginHandler);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPasswordHandler);
router.post('/reset-password', validate(resetPasswordSchema), resetPasswordHandler);
router.post('/refresh-token', validate(refreshTokenSchema), refreshTokenHandler);

export default router;
