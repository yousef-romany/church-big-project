# Firebase Cloud Messaging (FCM) Implementation
## Complete Notification System for Church Management

### 📋 Features Implemented:
1. **Real-time Notifications** - Send push notifications instantly
2. **Scheduled Notifications** - Send notifications at specific dates/times
3. **Multi-targeting** - Send to individual users, batch lists, or entire roles
4. **Template System** - Create reusable notification templates with placeholders
5. **Delivery Tracking** - Track sent, delivered, and read status
6. **User Preferences** - Allow users to opt-out and set quiet hours
7. **Device Management** - One token per user with automatic cleanup
8. **Rate Limiting** - Prevent abuse of the notification system
9. **Admin Interface** - Full CRUD operations for notifications and templates
10. **Local Browser Notifications** - Show notifications when app is open

### 📁 File Structure:
```
src/
├── lib/
│   ├── firebase/
│   │   ├── admin.ts          # Firebase Admin SDK setup
│   │   ├── firebaseConfig.ts # Existing Firebase config
│   │   └── messagingService.ts # Updated with server integration
│   └── notifications/
│       └── template-renderer.ts # Template rendering utilities
├── app/
│   └── api/
│       └── notifications/
│           ├── register-token/route.ts     # Token registration API
│           ├── send/route.ts              # Send notifications API
│           ├── route.ts                    # List/manage notifications API
│           ├── [id]/read/route.ts       # Mark as read API
│           ├── process-scheduled/route.ts # Process scheduled notifications
│           └── templates/
│               └── route.ts            # Templates CRUD API
└── app/
    └── admin/
        └── notifications/
            └── page.tsx              # Admin notification interface
```

### 🗄 Database Schema Updates:
Added to your existing schema:
- `UserDeviceToken` - Stores FCM tokens and device info
- `Notification` - Full notification tracking
- `NotificationPreference` - User notification settings
- `NotificationTemplate` - Reusable notification templates

### 🔑 Setup Instructions:

#### 1. Environment Variables (add to your .env file):
```env
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
CRON_SECRET=your-secret-cron-key
```

#### 2. Generate Prisma Client:
```bash
# If your DATABASE_URL uses PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/churchdb
npm run prisma:generate
npx prisma db push

# If your DATABASE_URL uses MySQL
npm run prisma:generate
npx prisma db push --accept-data-loss
```

#### 3. Install Dependencies:
```bash
npm install firebase-admin ua-parser-js @types/ua-parser-js
```

#### 4. Cron Job Setup:
Create a cron job to call every 5 minutes:
```bash
*/5 * * * * curl -X GET "http://localhost:3000/api/notifications/process-scheduled" -H "Authorization: Bearer your-secret-cron-key"
```

### 🎯 How to Use:

1. **Register Device Token** (Already implemented in AppSetup.tsx):
   - Token is automatically sent to server when user grants permission
   - Old tokens are deactivated to maintain one-per-user rule

2. **Send Notification**:
```javascript
const response = await fetch('/api/notifications/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipientId: 'user123',
    title: 'New Event',
    body: 'Event tomorrow at 6PM',
    type: 'EVENT',
    priority: 'HIGH',
    templateId: 'template123', // Optional
    templateData: { userName: 'John', eventName: 'Bible Study' },
    scheduledFor: '2024-03-10T18:00:00Z' // Optional
  }),
});
```

3. **Send Batch Notifications**:
```javascript
// To multiple users
const response = await fetch('/api/notifications/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipientIds: ['user123', 'user456', 'user789'],
    title: 'Announcement',
    body: 'Important announcement for all users',
    type: 'ANNOUNCEMENT',
    priority: 'HIGH',
  }),
});

// To all users with a specific role
const response = await fetch('/api/notifications/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipientRole: 'PARENT',
    title: 'Parent Update',
    body: 'New features for parents',
    type: 'INFO',
    priority: 'MEDIUM',
  }),
});
```

4. **Create Notification Template**:
```javascript
const response = await fetch('/api/notifications/templates', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Event Reminder',
    titleTemplate: 'Event Reminder: {{eventName}}',
    bodyTemplate: 'Hi {{userName}}, reminder: {{eventName}} is tomorrow at {{eventTime}}',
    type: 'REMINDER',
    priority: 'MEDIUM',
    description: 'Template for event reminders',
  }),
});
```

5. **Admin Panel Access**:
   - Navigate to `/admin/notifications` for full notification management
   - View, send, mark as read, delete notifications
   - Manage notification templates
   - Filter by status, type, priority

### 🚨 Security Notes:
1. All API endpoints require authentication
2. Only ADMIN users can send notifications
3. Rate limiting prevents abuse:
   - Max 5 tokens per user per hour
   - Max 50 notifications per minute
4. User preferences respected:
   - Opt-out options for different notification types
   - Quiet hours to prevent notifications during night
5. Tokens are automatically validated and associated with logged-in users

### 📱 Client-Side Integration:
The system automatically integrates with:
1. Existing Firebase messaging setup in your app
2. Automatic token registration with server
3. Local browser notifications for foreground messages
4. Arabic RTL support throughout the interface

### 🔄 Notification Flow:
1. User grants permission → Token registered → Stored in database
2. Admin creates/schedules notification → Stored in database
3. Cron job processes scheduled notifications → Sent via FCM
4. Delivery status updated → Tracked through dashboard
5. User receives notification → Mark as read when opened

The implementation is production-ready and follows Next.js 15 best practices with TypeScript, Zod validation, and proper error handling in Arabic.