# EmailJS Configuration

To use the real email service with EmailJS, you need to configure the following environment variables in your `.env.local` file:

```bash
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
EMAILJS_SERVICE_ID=your_service_id_here
EMAILJS_VERIFICATION_TEMPLATE_ID=verification_template_id_here
EMAILJS_PASSWORD_RESET_TEMPLATE_ID=password_reset_template_id_here
```

## Getting EmailJS Credentials

1. **Sign up for EmailJS**: Go to [https://www.emailjs.com/](https://www.emailjs.com/) and create an account

2. **Create an Email Service**:
   - Go to Email Services → Add New Service
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the instructions to connect your email
   - Copy the Service ID

3. **Create Email Templates**:

   **Email Verification Template**:
   - Template Name: "Email Verification"
   - Subject: "تأكيد البريد الإلكتروني - منصة الكنيسة"
   - HTML Content:
   ```html
   <h1>مرحباً {{recipient_name}}!</h1>
   <p>شكرًا لتسجيلك في منصة الكنيسة. يرجى النقر على الرابط أدناه لتفعيل حسابك:</p>
   <p><a href="{{verification_url}}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">تفعيل الحساب</a></p>
   <p>أو نسخ والصق هذا الرابط في متصفحك:</p>
   <p>{{verification_url}}</p>
   <p>إذا لم تقم بإنشاء حساب، يرجى تجاهل هذه الرسالة.</p>
   <p>مع خالص التقدير,<br>فريق منصة الكنيسة</p>
   ```
   - Add variables: `{{recipient_name}}`, `{{verification_url}}`
   - Copy the Template ID

   **Password Reset Template**:
   - Template Name: "Password Reset"
   - Subject: "إعادة تعيين كلمة المرور - منصة الكنيسة"
   - HTML Content:
   ```html
   <h1>مرحباً {{recipient_name}}!</h1>
   <p>لقد تلقيت هذا الطلب لأنك (أو شخص آخر) طلبت إعادة تعيين كلمة المرور لحسابك.</p>
   <p>انقر على الرابط أدناه لإعادة تعيين كلمة المرور:</p>
   <p><a href="{{reset_url}}" style="background-color: #f44336; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">إعادة تعيين كلمة المرور</a></p>
   <p>أو نسخ والصق هذا الرابط في متصفحك:</p>
   <p>{{reset_url}}</p>
   <p>هذا الرابط سينتهي صلاحيته خلال ساعة واحدة.</p>
   <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة.</p>
   <p>مع خالص التقدير,<br>فريق منصة الكنيسة</p>
   ```
   - Add variables: `{{recipient_name}}`, `{{reset_url}}`
   - Copy the Template ID

4. **Get Your Public Key**:
   - Go to Account → API Keys
   - Copy your Public Key

5. **Add all credentials to your .env.local file**

## Important Notes

- The service will fallback to mock emails if EmailJS is not configured
- Ensure your email service is properly configured in EmailJS dashboard
- Test the templates in EmailJS dashboard before using them in production
- The mock emails will still print to console for development purposes