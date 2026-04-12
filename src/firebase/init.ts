'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Returns the initialized Firebase SDKs.
 */
export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

/**
 * Initializes the Firebase app and returns the SDK instances.
 * This is designed to be direct and reliable for both SSR and client-side usage.
 */
export function initializeFirebase() {
  if (getApps().length > 0) {
    return getSdks(getApp());
  }

  // Always initialize with explicit config to ensure reliability across environments
  const firebaseApp = initializeApp(firebaseConfig);
  return getSdks(firebaseApp);
}
