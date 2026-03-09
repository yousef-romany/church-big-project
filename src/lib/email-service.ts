import { getBaseUrl } from '@/lib/utils';
import emailjs from '@emailjs/browser';

// EmailJS configuration - these should be set in your environment variables
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_VERIFICATION_TEMPLATE_ID = process.env.EMAILJS_VERIFICATION_TEMPLATE_ID;
const EMAILJS_PASSWORD_RESET_TEMPLATE_ID = process.env.EMAILJS_PASSWORD_RESET_TEMPLATE_ID;

// Initialize EmailJS
if (typeof window !== 'undefined' && EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${getBaseUrl()}/auth/verify-email?token=${token}`;

  try {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_VERIFICATION_TEMPLATE_ID) {
      // Fallback to mock if EmailJS is not configured
      console.log("--- EMAILJS NOT CONFIGURED - FALLBACK TO MOCK ---");
      return mockSendVerificationEmail(email, token);
    }

    const templateParams = {
      to_email: email,
      verification_url: verificationUrl,
      recipient_name: email.split('@')[0], // Use part before @ as name
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_VERIFICATION_TEMPLATE_ID,
      templateParams
    );

    if (response.status === 200) {
      return { success: true, message: "تم إرسال بريد التحقق بنجاح" };
    } else {
      throw new Error('فشل إرسال البريد');
    }
  } catch (error) {
    console.error('EmailJS Error:', error);
    // Fallback to mock on error
    return mockSendVerificationEmail(email, token);
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${getBaseUrl()}/auth/reset-password?token=${token}`;

  try {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_PASSWORD_RESET_TEMPLATE_ID) {
      // Fallback to mock if EmailJS is not configured
      console.log("--- EMAILJS NOT CONFIGURED - FALLBACK TO MOCK ---");
      return mockSendPasswordResetEmail(email, token);
    }

    const templateParams = {
      to_email: email,
      reset_url: resetUrl,
      recipient_name: email.split('@')[0], // Use part before @ as name
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_PASSWORD_RESET_TEMPLATE_ID,
      templateParams
    );

    if (response.status === 200) {
      return { success: true, message: "تم إرسال بريد إعادة تعيين كلمة المرور بنجاح" };
    } else {
      throw new Error('فشل إرسال البريد');
    }
  } catch (error) {
    console.error('EmailJS Error:', error);
    // Fallback to mock on error
    return mockSendPasswordResetEmail(email, token);
  }
}

// Mock functions as fallback
function mockSendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${getBaseUrl()}/auth/verify-email?token=${token}`;

  const emailBody = `
    <h1>أهلاً بك في منصة الكنيسة!</h1>
    <p>شكرًا لتسجيلك. الرجاء الضغط على الرابط التالي لتفعيل حسابك:</p>
    <a href="${verificationUrl}">${verificationUrl}</a>
    <p>إذا لم تقم بطلب هذا، يرجى تجاهل هذه الرسالة.</p>
  `;

  console.log("--- SENDING MOCK VERIFICATION EMAIL ---");
  console.log(`To: ${email}`);
  console.log(`Subject: تفعيل حسابك في منصة الكنيسة`);
  console.log(`Body: ${emailBody}`);
  console.log("--------------------------------------");

  return { success: true, message: "Verification email sent (mock)." };
}

function mockSendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${getBaseUrl()}/auth/reset-password?token=${token}`;

  const emailBody = `
    <h1>إعادة تعيين كلمة المرور</h1>
    <p>لقد تلقيت هذا الطلب لأنك (أو شخص آخر) طلبت إعادة تعيين كلمة المرور لحسابك.</p>
    <p>الرجاء الضغط على الرابط التالي لإعادة تعيين كلمة المرور:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>هذا الرابط سينتهي صلاحيته خلال ساعة واحدة.</p>
    <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة وستبقى كلمة المرور الخاصة بك كما هي.</p>
  `;

  console.log("--- SENDING MOCK PASSWORD RESET EMAIL ---");
  console.log(`To: ${email}`);
  console.log(`Subject: إعادة تعيين كلمة المرور في منصة الكنيسة`);
  console.log(`Body: ${emailBody}`);
  console.log("----------------------------------------");

  return { success: true, message: "Password reset email sent (mock)." };
}