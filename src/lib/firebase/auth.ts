import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from './client';

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential) {
      throw new Error('Could not get credential from result');
    }
    const token = credential.accessToken;
    return user;
  } catch (error) {
    console.error('Error during sign-in:', error);
    // TODO: Implement proper error handling and user feedback
    return null;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error during sign-out:', error);
    // TODO: Implement proper error handling and user feedback
  }
};
