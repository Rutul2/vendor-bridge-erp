export const passwordResetTemplate = ({ name, token }) => `
  <h1>Password Reset Request</h1>
  <p>Hi ${name},</p>
  <p>Use the link below to reset your password:</p>
  <a href="https://your-app.com/reset-password?token=${token}">Reset Password</a>
  <p>If you did not request this, ignore this email.</p>
`;

export const invoiceNotificationTemplate = ({ vendorName, invoiceNumber, total }) => `
  <h1>Invoice ${invoiceNumber} Created</h1>
  <p>Dear ${vendorName},</p>
  <p>Your invoice for <strong>${total.toFixed(2)}</strong> has been generated and is available in VendorBridge.</p>
`;
