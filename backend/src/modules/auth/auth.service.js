import bcrypt from 'bcryptjs';
import prisma from '../../config/database.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../config/jwt.js';
import { sendMail } from '../../config/mailer.js';
import { passwordResetTemplate } from '../../utils/emailTemplates.js';
import { createUser, findRoleByName, findUserByEmail, findUserById, updateUserPassword } from './auth.repository.js';

const buildAuthResponse = async (user) => {
  let vendor_id = null;
  if (user.role.name === 'VENDOR') {
    const vendor = await prisma.vendor.findFirst({ where: { email: user.email } });
    if (vendor) vendor_id = vendor.id;
  }
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      is_active: user.is_active,
      vendor_id: vendor_id,
    },
    accessToken: signAccessToken({ id: user.id, role: user.role.name }),
    refreshToken: signRefreshToken({ id: user.id, role: user.role.name }),
  };
};

export const signup = async ({ name, email, password, role }) => {
  const existing = await findUserByEmail(email);
  if (existing) throw { statusCode: 409, message: 'Email already in use' };
  const roleModel = await findRoleByName(role);
  if (!roleModel) throw { statusCode: 400, message: 'Invalid role selected' };
  const password_hash = await bcrypt.hash(password, 12);
  const user = await createUser({ name, email, password_hash, role_id: roleModel.id });
  return await buildAuthResponse({ ...user, role: roleModel });
};

export const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) throw { statusCode: 401, message: 'Invalid credentials' };
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw { statusCode: 401, message: 'Invalid credentials' };
  const role = await prisma.role.findUnique({ where: { id: user.role_id } });
  return await buildAuthResponse({ ...user, role });
};

export const forgotPassword = async ({ email }) => {
  const user = await findUserByEmail(email);
  if (!user) throw { statusCode: 404, message: 'User not found' };
  const token = signRefreshToken({ id: user.id });
  const html = passwordResetTemplate({ name: user.name, token });
  await sendMail({ to: email, subject: 'Reset your VendorBridge password', html });
  return { message: 'Password reset instructions sent' };
};

export const resetPassword = async ({ token, password }) => {
  try {
    const decoded = verifyRefreshToken(token);
    const password_hash = await bcrypt.hash(password, 12);
    await updateUserPassword(decoded.id, password_hash);
    return { message: 'Password updated successfully' };
  } catch (error) {
    throw { statusCode: 400, message: 'Invalid or expired reset token' };
  }
};

export const refreshToken = async ({ refreshToken }) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await findUserById(decoded.id);
    if (!user) throw { statusCode: 401, message: 'Invalid refresh token' };
    return await buildAuthResponse(user);
  } catch (error) {
    throw { statusCode: 401, message: 'Invalid or expired refresh token' };
  }
};
