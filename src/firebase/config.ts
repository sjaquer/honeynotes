// Firebase config read from environment variables.
// In Next.js, client-safe variables must be prefixed with NEXT_PUBLIC_.
const getEnv = (value: string | undefined, fallback: string): string => {
  return value && value.trim().length > 0 ? value : fallback;
};

export const firebaseConfig = {
  apiKey: getEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 'demo-api-key'),
  authDomain: getEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, 'demo-project.firebaseapp.com'),
  projectId: getEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, 'demo-project'),
  storageBucket: getEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, 'demo-project.appspot.com'),
  messagingSenderId: getEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, '1234567890'),
  appId: getEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, '1:1234567890:web:demo1234567890'),
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
