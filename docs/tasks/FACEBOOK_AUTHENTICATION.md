# Facebook Authentication

This document describes the Facebook OAuth authentication feature implemented in the Church Management System.

## Overview

Users can now authenticate and register using their Facebook accounts. This feature provides a convenient way for users to access the system without creating separate credentials.

## Implementation Details

### Backend Configuration

The Facebook OAuth provider is configured in `src/lib/auth.ts`:

```typescript
import Facebook from 'next-auth/providers/facebook';

// Added to providers array
Facebook({
  clientId: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
}),
```

### Environment Variables

To enable Facebook authentication, add the following environment variables to your `.env` file:

```
FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret
NEXTAUTH_URL=http://localhost:3000
```

### Frontend Implementation

#### Login Form Enhancement

The login form component (`src/components/auth/login-form.tsx`) includes a Facebook login button:

```typescript
const handleFacebookSignIn = async () => {
  setError(null);
  try {
    const result = await signIn('facebook', {
      redirect: false,
      callbackUrl: redirectPath,
    });
    // Handle success/error
  } catch (err) {
    // Handle exceptions
  }
};
```

#### Registration Form Enhancement

The registration page (`src/app/auth/register/page.tsx`) includes a Facebook signup option that redirects users to complete their profile after authentication.

## User Flow

### Login Flow
1. User clicks "تسجيل الدخول عبر فيسبوك" (Login with Facebook)
2. User is redirected to Facebook OAuth consent screen
3. After authorization, user is redirected back to the application
4. User is automatically logged in and redirected to their role-specific dashboard

### Registration Flow
1. User clicks "التسجيل عبر فيسبوك" (Sign up with Facebook)
2. User is redirected to Facebook OAuth consent screen
3. After authorization, user is redirected back to the application
4. User is taken to a role selection page to complete their profile

## Security Considerations

- Facebook OAuth tokens are handled securely by NextAuth.js
- User data from Facebook is stored according to privacy requirements
- Standard OAuth security practices are followed

## Facebook App Setup

To set up Facebook authentication:

1. Create a Facebook App at [Facebook Developers](https://developers.facebook.com/)
2. Add "Facebook Login" product to your app
3. Configure OAuth redirect URI: `http://localhost:3000/api/auth/callback/facebook` (for development)
4. Set the App Domains to match your application URL
5. Note down the App ID and App Secret to use in environment variables

## Error Handling

The implementation includes comprehensive error handling for:
- Network errors during Facebook authentication
- Cancelled authentication attempts
- Invalid or expired Facebook tokens
- Server-side authentication errors

## Future Enhancements

Potential future improvements:
- Profile picture import from Facebook
- Automatic role detection based on Facebook groups
- Facebook events integration
- Social sharing features for church events