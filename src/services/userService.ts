import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Theme } from '../context/ThemeContext';

export interface UserPreferences {
    theme: Theme;
    // Add other preferences here in the future (e.g., collapsed lists, default view)
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'cyberpunk',
};

export const getUserPreferences = async (uid: string): Promise<UserPreferences> => {
    try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            return { ...DEFAULT_PREFERENCES, ...userDoc.data() } as UserPreferences;
        } else {
            // Initialize user doc if it doesn't exist
            await setDoc(userDocRef, DEFAULT_PREFERENCES);
            return DEFAULT_PREFERENCES;
        }
    } catch (error) {
        console.error('Error fetching user preferences:', error);
        return DEFAULT_PREFERENCES;
    }
};

export const updateUserPreferences = async (uid: string, preferences: Partial<UserPreferences>) => {
    try {
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, preferences, { merge: true });
    } catch (error) {
        console.error('Error updating user preferences:', error);
    }
};
