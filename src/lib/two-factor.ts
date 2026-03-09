import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export function generateTwoFactorSecret(username: string): TwoFactorSetup {
  const secret = speakeasy.generateSecret({
    name: `Church Management (${username})`,
    issuer: 'Church Management System',
  });

  // Generate QR code for the secret
  const qrCodeUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: `Church Management (${username})`,
    issuer: 'Church Management System',
  });

  // Generate backup codes
  const backupCodes = Array.from({ length: 10 }, () =>
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );

  return {
    secret: secret.base32,
    qrCode: qrCodeUrl,
    backupCodes,
  };
}

export async function generateQRCodeDataURL(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url);
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

export function verifyTwoFactorToken(token: string, secret: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Allow 2 time windows before and after current time
  });
}

export function verifyBackupCode(code: string, backupCodes: string[]): boolean {
  return backupCodes.includes(code.toUpperCase());
}

export function removeUsedBackupCode(code: string, backupCodes: string[]): string[] {
  return backupCodes.filter((c) => c !== code.toUpperCase());
}