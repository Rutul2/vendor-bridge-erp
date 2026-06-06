import { successResponse } from '../../utils/response.js';
import { forgotPassword, login, refreshToken, resetPassword, signup } from './auth.service.js';

export const signupHandler = async (req, res) => {
  const result = await signup(req.body);
  return successResponse(res, 'User created successfully', result);
};

export const loginHandler = async (req, res) => {
  const result = await login(req.body);
  return successResponse(res, 'Login successful', result);
};

export const forgotPasswordHandler = async (req, res) => {
  const result = await forgotPassword(req.body);
  return successResponse(res, 'Password reset email sent', result);
};

export const resetPasswordHandler = async (req, res) => {
  const result = await resetPassword(req.body);
  return successResponse(res, 'Password reset successful', result);
};

export const refreshTokenHandler = async (req, res) => {
  const result = await refreshToken(req.body);
  return successResponse(res, 'Token refreshed successfully', result);
};
