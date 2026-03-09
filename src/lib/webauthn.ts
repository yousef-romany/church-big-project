import { 
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { 
  AuthenticationResponseJSON, 
  RegistrationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON
} from '@simplewebauthn/types';

// WebAuthn configuration
const RP_ID = process.env.NEXTAUTH_URL ? new URL(process.env.NEXTAUTH_URL).hostname : 'localhost';
const RP_NAME = 'Church Management System';
const ORIGIN = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Store challenges temporarily (in production, use Redis or database)
const challenges = new Map<string, string>();
const CHALLENGE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export function generateChallenge(userId: string): string {
  const challenge = crypto.getRandomValues(new Uint8Array(32))
    .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  
  challenges.set(userId, challenge);
  
  // Auto-expire challenge
  setTimeout(() => challenges.delete(userId), CHALLENGE_EXPIRY);
  
  return challenge;
}

export function getChallenge(userId: string): string | undefined {
  return challenges.get(userId);
}

export function removeChallenge(userId: string): void {
  challenges.delete(userId);
}

// Generate registration options for new passkey
export async function generatePasskeyRegistrationOptions(
  userId: string,
  email: string,
  existingPasskeys: { credentialId: string }[] = []
): Promise<PublicKeyCredentialCreationOptionsJSON> {
  const challenge = generateChallenge(`register_${userId}`);
  
  return generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userID: userId,
    userName: email,
    userDisplayName: email,
    // Prevent users from registering the same device multiple times
    excludeCredentials: existingPasskeys.map(passkey => ({
      id: new TextEncoder().encode(passkey.credentialId),
      type: 'public-key',
      transports: ['internal', 'usb', 'nfc', 'ble'],
    })),
    // Prefer biometric authentication
    authenticatorSelection: {
      userVerification: 'required',
      residentKey: 'preferred',
    },
    // Supports various authenticator types
    attestationType: 'none',
  });
}

// Generate authentication options for existing passkey
export async function generatePasskeyAuthenticationOptions(
  userId: string,
  existingPasskeys: { credentialId: string; transports?: string }[] = []
): Promise<PublicKeyCredentialRequestOptionsJSON> {
  const challenge = generateChallenge(`auth_${userId}`);
  
  return generateAuthenticationOptions({
    rpID: RP_ID,
    // Use allowCredentials for specific passkeys or omit for any
    allowCredentials: existingPasskeys.map(passkey => ({
      id: new TextEncoder().encode(passkey.credentialId),
      type: 'public-key',
      transports: passkey.transports?.split(',') as any || ['internal', 'usb', 'nfc', 'ble'],
    })),
    userVerification: 'required',
  });
}

// Verify registration response
export async function verifyPasskeyRegistration(
  response: RegistrationResponseJSON,
  expectedChallenge: string,
  expectedOrigin: string = ORIGIN,
  expectedRPID: string = RP_ID
): Promise<{
  verified: boolean;
  registrationInfo?: {
    credentialID: Uint8Array;
    credentialPublicKey: Uint8Array;
    counter: number;
  };
}> {
  try {
    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin,
      expectedRPID,
    });
    
    return verification;
  } catch (error) {
    console.error('Registration verification failed:', error);
    return { verified: false };
  }
}

// Verify authentication response
export async function verifyPasskeyAuthentication(
  response: AuthenticationResponseJSON,
  expectedChallenge: string,
  authenticator: {
    credentialID: Uint8Array;
    credentialPublicKey: Uint8Array;
    counter: number;
  },
  expectedOrigin: string = ORIGIN,
  expectedRPID: string = RP_ID
): Promise<{
  verified: boolean;
  authenticationInfo?: {
    credentialID: Uint8Array;
    newCounter: number;
  };
}> {
  try {
    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin,
      expectedRPID,
      authenticator,
    });
    
    return verification;
  } catch (error) {
    console.error('Authentication verification failed:', error);
    return { verified: false };
  }
}

// Convert base64url to buffer
export function base64urlToBuffer(base64url: string): Uint8Array {
  // Add padding if needed
  const padded = base64url + '='.repeat((4 - base64url.length % 4) % 4);
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  
  return bytes;
}

// Convert buffer to base64url
export function bufferToBase64url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Get human-readable device name from authenticator
export function getDeviceName(): string {
  // Parse device info from user agent
  const isMac = /Mac/i.test(navigator.platform);
  const isWindows = /Win/i.test(navigator.platform);
  const isiPhone = /iPhone/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  
  if (isiPhone) return 'iPhone';
  if (isAndroid) return 'Android';
  if (isMac) return 'Mac';
  if (isWindows) return 'Windows';
  
  return 'Unknown Device';
}