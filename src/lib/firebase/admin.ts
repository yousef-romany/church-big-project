import admin from 'firebase-admin';

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  try {
    // Initialize Firebase Admin SDK
    // The credentials should be loaded from environment variables or service account file
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID || "church-63cdd",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as any),
      projectId: serviceAccount.projectId,
    });

    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    // In development, you might want to use a different approach
    // For example, reading from a local file
    try {
      // Only for development - fallback to application default credentials
      admin.initializeApp({
        projectId: "church-63cdd",
      });
    } catch (fallbackError) {
      console.error('Failed to initialize Firebase Admin SDK with fallback:', fallbackError);
    }
  }
}

// Export the initialized admin instance
export const adminApp = admin.apps[0];

// Export Firebase messaging
export const messaging = admin.messaging();

// Helper function to send notification
export const sendNotification = async (
  token: string,
  notification: {
    title: string;
    body: string;
    imageUrl?: string;
  },
  data?: Record<string, string>
) => {
  try {
    const message: admin.messaging.Message = {
      token,
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl,
      },
      data,
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          clickAction: data?.actionUrl,
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            'mutable-content': 1,
          },
        },
      },
    };

    const response = await messaging.send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

// Helper function to send multicast notification
export const sendMulticastNotification = async (
  tokens: string[],
  notification: {
    title: string;
    body: string;
    imageUrl?: string;
  },
  data?: Record<string, string>
) => {
  try {
    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.imageUrl,
      },
      data,
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          clickAction: data?.actionUrl,
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            'mutable-content': 1,
          },
        },
      },
    };

    const response = await messaging.sendMulticast(message);
    console.log('Successfully sent multicast message:', response);
    
    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      invalidTokens: response.responses
        .filter((res: any) => res.error?.code === 'messaging/registration-token-not-registered')
        .map((res: any, index: number) => tokens[index]),
    };
  } catch (error) {
    console.error('Error sending multicast notification:', error);
    throw error;
  }
};