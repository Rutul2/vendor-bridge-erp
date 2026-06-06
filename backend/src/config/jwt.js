import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const accessExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
const refreshExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';

export const signAccessToken = (payload) => jwt.sign(payload, accessSecret, { expiresIn: accessExpiry });
export const signRefreshToken = (payload) => jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiry });
export const verifyAccessToken = (token) => jwt.verify(token, accessSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, refreshSecret);
