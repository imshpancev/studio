// This file now contains functions that use the CLIENT-SIDE SDK
// and should be called from client components or hooks.
// It no longer uses 'use server'.

import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Uploads a file to Firebase Storage.
 * @param file The file object to upload.
 * @param path The path in Firebase Storage where the file will be stored.
 * @returns The public download URL of the uploaded file.
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    // You might want to cast the error to a FirebaseError to get more specific details
    // import { FirebaseError } from 'firebase/app';
    // if (error instanceof FirebaseError) { ... }
    throw new Error('Failed to upload file.');
  }
}
