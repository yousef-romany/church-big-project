import { getBaseUrl } from '@/lib/utils';

// NOTE: This is a MOCK email service for development.
// In production, you would replace this with a real email provider like
// Nodemailer, Resend, SendGrid, or AWS SES.
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${getBaseUrl()}/auth/verify-email?token=${token}`;

  // In a real app, you would use an HTML template for the email.
  const emailBody = `
    <h1>أهلاً بك في منصة الكنيسة!</h1>
    <p>شكرًا لتسجيلك. الرجاء الضغط على الرابط التالي لتفعيل حسابك:</p>
    <a href="${verificationUrl}">${verificationUrl}</a>
    <p>إذا لم تقم بطلب هذا، يرجى تجاهل هذه الرسالة.</p>
  `;

  console.log("--- SENDING MOCK EMAIL ---");
  console.log(`To: ${email}`);
  console.log(`Subject: تفعيل حسابك في منصة الكنيسة`);
  console.log(`Body: ${emailBody}`);
  console.log("--------------------------");

  // Here you would use your email sending library, e.g.:
  // await resend.emails.send({
  //   from: 'onboarding@example.com',
  //   to: email,
  //   subject: 'Verify your email address',
  //   html: emailBody,
  // });

  return { success: true, message: "Verification email sent (mock)." };
}