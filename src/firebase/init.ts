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
 * This is designed to work in both development and production environments.
 */
export function initializeFirebase() {
  if (!getApps().length) {
    // Attempt to initialize using environment variables provided by Firebase App Hosting,
    // falling back to the local config if necessary.
    let firebaseApp;
    try {
      firebaseApp = initializeApp();
    } catch (e) {
      if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed. Falling back to local firebaseConfig.', e);
      }
      firebaseApp = initializeApp(firebaseConfig);
    }

    return getSdks(firebaseApp);
  }

  // If already initialized, return the existing SDK instances.
  return getSdks(getApp());
}
