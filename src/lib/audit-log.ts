import { prisma } from './prisma';

export interface AuditLogData {
  userId?: string;
  email?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  success?: boolean;
  errorMessage?: string;
}

export async function logAuditEvent(data: AuditLogData) {
  try {
    // Create audit log entry
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        email: data.email,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        details: data.details || {},
        success: data.success ?? true,
        errorMessage: data.errorMessage,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Don't throw the error to avoid breaking the main flow
  }
}

export function getAuthActionLabel(action: string): string {
  const actionLabels: Record<string, string> = {
    'LOGIN_SUCCESS': 'تسجيل الدخول ناجح',
    'LOGIN_FAILED': 'فشل تسجيل الدخول',
    'LOGIN_2FA_REQUIRED': 'مطلوب مصادقة ثنائية',
    'LOGIN_2FA_SUCCESS': 'نجاح المصادقة الثنائية',
    'LOGIN_2FA_FAILED': 'فشل المصادقة الثنائية',
    'LOGOUT': 'تسجيل الخروج',
    'REGISTER_SUCCESS': 'التسجيل ناجح',
    'REGISTER_FAILED': 'فشل التسجيل',
    'EMAIL_VERIFY_SUCCESS': 'نجاح التحقق من البريد',
    'EMAIL_VERIFY_FAILED': 'فشل التحقق من البريد',
    'PASSWORD_RESET_REQUEST': 'طلب إعادة تعيين كلمة المرور',
    'PASSWORD_RESET_SUCCESS': 'نجاح إعادة تعيين كلمة المرور',
    'PASSWORD_RESET_FAILED': 'فشل إعادة تعيين كلمة المرور',
    '2FA_ENABLED': 'تفعيل المصادقة الثنائية',
    '2FA_DISABLED': 'تعطيل المصادقة الثنائية',
    'FACEBOOK_LOGIN_SUCCESS': 'نجاح تسجيل الدخول عبر فيسبوك',
    'FACEBOOK_LOGIN_FAILED': 'فشل تسجيل الدخول عبر فيسبوك',
    'RATE_LIMIT_EXCEEDED': 'تجاوز الحد المسموح للطلبات',
  };
  
  return actionLabels[action] || action;
}