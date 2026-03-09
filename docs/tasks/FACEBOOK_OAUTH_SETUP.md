# Facebook OAuth Setup Instructions

This document provides step-by-step instructions for setting up Facebook OAuth authentication for the Church Management System.

## Prerequisites

- Facebook Developer Account
- Access to the Facebook Developers portal
- Admin access to your church management system codebase

## Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Log in with your Facebook credentials
3. Click "My Apps" in the top navigation
4. Click "Create App" button
5. Select "Business" as the app type
6. Enter an app name (e.g., "Church Management System")
7. Enter your contact email
8. Click "Create App"

## Step 2: Add Facebook Login Product

1. In your app dashboard, find "Products" section
2. Click "Add Product"
3. Select "Facebook Login"
4. Click "Set Up"

## Step 3: Configure OAuth Settings

1. In the left navigation, go to "Facebook Login" > "Settings"
2. Under "Valid OAuth Redirect URIs", add:
   - Development: `http://localhost:3000/api/auth/callback/facebook`
   - Production: `https://yourdomain.com/api/auth/callback/facebook`
3. Click "Save Changes"

## Step 4: Set App Domains

1. In the left navigation, go to "Settings" > "Basic"
2. Under "App Domains", add:
   - Development: `localhost:3000`
   - Production: `yourdomain.com`
3. Click "Save Changes"

## Step 5: Get App Credentials

1. In the left navigation, go to "Settings" > "Basic"
2. Note down:
   - **App ID** (this is your FACEBOOK_CLIENT_ID)
   - **App Secret** (this is your FACEBOOK_CLIENT_SECRET)

## Step 6: Update Environment Variables

Update your `.env` file with the Facebook credentials:

```env
AUTH_SECRET=your_secret_key_here

# Facebook OAuth Configuration
FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
```

## Step 7: Configure App Review (Production Only)

1. In the left navigation, go to "App Review"
2. Toggle "Make App Public?" to YES
3. Complete the required items for app review
4. Submit your app for review if needed

## Step 8: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to any login page
3. Click "تسجيل الدخول عبر فيسبوك" (Login with Facebook)
4. Complete the Facebook authentication flow
5. Verify you're successfully logged in

## Troubleshooting

### Common Issues

1. **"Invalid redirect_uri" Error**
   - Ensure the redirect URI exactly matches what you configured in Facebook
   - Check for trailing slashes or protocol differences (http vs https)

2. **"This app is in development mode"**
   - Add test users in the Facebook App Dashboard
   - Or complete the app review process for production

3. **Environment Variables Not Working**
   - Verify your `.env` file is in the correct location
   - Restart your development server after updating environment variables
   - Check for typos in variable names

### Debugging Steps

1. Check browser console for error messages
2. Verify network requests in browser dev tools
3. Check server logs for authentication errors
4. Ensure all environment variables are correctly set

## Security Considerations

- Never commit your Facebook App Secret to version control
- Use environment variables for all sensitive data
- Regularly rotate your app secrets
- Monitor your Facebook app for unusual activity

## Additional Resources

- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [OAuth 2.0 for Login](https://developers.facebook.com/docs/facebook-login/web/oauth2)
- [NextAuth.js Facebook Provider](https://next-auth.js.org/providers/facebook)