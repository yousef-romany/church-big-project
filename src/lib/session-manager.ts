import { prisma } from './prisma';
import { randomBytes } from 'crypto';
import { NextRequest } from 'next/server';

export interface DeviceInfo {
  userAgent?: string;
  ip?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  trusted?: boolean;
}

export interface SessionData {
  userId: string;
  deviceInfo: DeviceInfo;
}

// Parse user agent to extract device information
export function parseUserAgent(userAgent?: string): Partial<DeviceInfo> {
  if (!userAgent) return {};

  const ua = userAgent.toLowerCase();
  
  // Detect browser
  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';

  // Detect OS
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

  // Detect device type
  let deviceType = 'Desktop';
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('ios')) {
    deviceType = 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    deviceType = 'Tablet';
  }

  return {
    browser,
    os,
    deviceType,
  };
}

// Get client IP from request
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || real || 'unknown';
  return ip;
}

// Create or update device token for a user
export async function createOrUpdateDeviceToken(
  userId: string,
  request: NextRequest,
  trusted: boolean = false
): Promise<string> {
  const userAgent = request.headers.get('user-agent') || undefined;
  const ip = getClientIP(request);
  const deviceInfo = parseUserAgent(userAgent);
  
  // Generate a unique device token
  const token = randomBytes(32).toString('hex');
  
  // Check if device already exists
  const existingDevice = await prisma.userDeviceToken.findFirst({
    where: {
      userId,
      deviceInfo: {
        path: [],
        equals: {
          userAgent,
          ip,
        }
      }
    }
  });

  if (existingDevice) {
    // Update existing device
    await prisma.userDeviceToken.update({
      where: { id: existingDevice.id },
      data: {
        token,
        isActive: true,
        lastSeenAt: new Date(),
        updatedAt: new Date(),
      }
    });
  } else {
    // Create new device entry
    await prisma.userDeviceToken.create({
      data: {
        userId,
        token,
        deviceInfo: {
          ...deviceInfo,
          userAgent,
          ip,
          trusted,
        },
        isActive: true,
        lastSeenAt: new Date(),
      }
    });
  }

  return token;
}

// Validate device token
export async function validateDeviceToken(token: string): Promise<boolean> {
  const device = await prisma.userDeviceToken.findUnique({
    where: { token }
  });

  if (!device || !device.isActive) {
    return false;
  }

  // Update last seen
  await prisma.userDeviceToken.update({
    where: { id: device.id },
    data: { lastSeenAt: new Date() }
  });

  return true;
}

// Get all devices for a user
export async function getUserDevices(userId: string) {
  return await prisma.userDeviceToken.findMany({
    where: { userId, isActive: true },
    orderBy: { lastSeenAt: 'desc' },
    select: {
      id: true,
      token: true,
      deviceInfo: true,
      isActive: true,
      lastSeenAt: true,
      createdAt: true,
    }
  });
}

// Revoke a device token
export async function revokeDeviceToken(tokenId: string, userId: string): Promise<boolean> {
  const result = await prisma.userDeviceToken.updateMany({
    where: { 
      id: tokenId, 
      userId 
    },
    data: { 
      isActive: false 
    }
  });

  return result.count > 0;
}

// Revoke all device tokens except current
export async function revokeAllOtherDevices(userId: string, currentToken: string): Promise<number> {
  const result = await prisma.userDeviceToken.updateMany({
    where: {
      userId,
      token: { not: currentToken },
      isActive: true,
    },
    data: {
      isActive: false,
    }
  });

  return result.count;
}

// Mark device as trusted
export async function markDeviceAsTrusted(tokenId: string, userId: string): Promise<boolean> {
  const result = await prisma.userDeviceToken.updateMany({
    where: { 
      id: tokenId, 
      userId 
    },
    data: { 
      deviceInfo: {
        path: ['trusted'],
        set: true
      }
    }
  });

  return result.count > 0;
}