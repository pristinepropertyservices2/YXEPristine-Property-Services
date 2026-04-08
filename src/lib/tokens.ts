import crypto from 'crypto';

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateVerificationToken(): { token: string; expires: Date } {
  const token = generateToken();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return { token, expires };
}

export function generateResetToken(): { token: string; expires: Date } {
  const token = generateToken();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return { token, expires };
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
