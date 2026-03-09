import { prisma } from './prisma';

interface LockoutConfig {
  maxAttempts: number;
  lockoutDuration: number; // in minutes
  resetOnSuccess: boolean;
}

const DEFAULT_CONFIG: LockoutConfig = {
  maxAttempts: 5,
  lockoutDuration: 15, // 15 minutes
  resetOnSuccess: true,
};

export class AccountLockout {
  private config: LockoutConfig;

  constructor(config: Partial<LockoutConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Check if account is locked
  async isAccountLocked(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { lockedUntil: true }
    });

    if (!user?.lockedUntil) {
      return false;
    }

    // Check if lockout has expired
    if (new Date() > user.lockedUntil) {
      // Unlock the account
      await prisma.user.update({
        where: { email },
        data: {
          lockedUntil: null,
          loginAttempts: 0,
        }
      });
      return false;
    }

    return true;
  }

  // Get remaining lockout time in minutes
  async getRemainingLockoutTime(email: string): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { lockedUntil: true }
    });

    if (!user?.lockedUntil) {
      return 0;
    }

    const remaining = user.lockedUntil.getTime() - Date.now();
    return Math.max(0, Math.ceil(remaining / (1000 * 60))); // Convert to minutes
  }

  // Increment failed login attempt
  async recordFailedAttempt(email: string): Promise<{
    locked: boolean;
    remainingAttempts: number;
    lockoutTime?: number;
  }> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { loginAttempts: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const newAttempts = user.loginAttempts + 1;
    const willLock = newAttempts >= this.config.maxAttempts;

    const updateData: any = {
      loginAttempts: newAttempts,
    };

    if (willLock) {
      // Lock the account
      const lockoutUntil = new Date(Date.now() + this.config.lockoutDuration * 60 * 1000);
      updateData.lockedUntil = lockoutUntil;

      // Log the lockout event
      await import('./audit-log').then(({ logAuditEvent }) => 
        logAuditEvent({
          email,
          action: 'ACCOUNT_LOCKED',
          resource: 'AUTH',
          success: false,
          details: { attempts: newAttempts, lockoutDuration: this.config.lockoutDuration }
        })
      );
    }

    await prisma.user.update({
      where: { email },
      data: updateData
    });

    return {
      locked: willLock,
      remainingAttempts: Math.max(0, this.config.maxAttempts - newAttempts),
      lockoutTime: willLock ? this.config.lockoutDuration : undefined,
    };
  }

  // Reset failed attempts on successful login
  async resetFailedAttempts(email: string): Promise<void> {
    if (!this.config.resetOnSuccess) {
      return;
    }

    await prisma.user.update({
      where: { email },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      }
    });
  }

  // Manually unlock an account
  async unlockAccount(email: string): Promise<void> {
    await prisma.user.update({
      where: { email },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
      }
    });

    // Log the unlock event
    await import('./audit-log').then(({ logAuditEvent }) => 
      logAuditEvent({
        email,
        action: 'ACCOUNT_UNLOCKED',
        resource: 'AUTH',
        success: true
      })
    );
  }

  // Get lockout status
  async getLockoutStatus(email: string): Promise<{
    isLocked: boolean;
    attempts: number;
    maxAttempts: number;
    remainingTime?: number;
  }> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        loginAttempts: true,
        lockedUntil: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isLocked = await this.isAccountLocked(email);
    const remainingTime = isLocked ? await this.getRemainingLockoutTime(email) : 0;

    return {
      isLocked,
      attempts: user.loginAttempts,
      maxAttempts: this.config.maxAttempts,
      remainingTime: remainingTime > 0 ? remainingTime : undefined,
    };
  }
}

// Export default instance
export const accountLockout = new AccountLockout();