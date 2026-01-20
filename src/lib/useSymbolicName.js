import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { formatSymbolicName, isValidSymbolicName } from './utils';

/**
 * Hook to manage user's symbolic name (§name)
 * Automatically syncs with Firestore and provides local state
 */
export const useSymbolicName = () => {
  const [symbolicName, setSymbolicName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setSymbolicName(null);
        setLoading(false);
        return;
      }

      const loadSymbolicName = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setSymbolicName(userData.symbolicName || formatSymbolicName(user.displayName || 'User'));
          } else {
            // Create default symbolic name from user display name
            const defaultName = formatSymbolicName(user.displayName || `User${user.uid.slice(0, 4)}`);
            setSymbolicName(defaultName);
            // Save to Firestore
            await setDoc(doc(db, 'users', user.uid), {
              symbolicName: defaultName,
              createdAt: new Date().toISOString()
            }, { merge: true });
          }
        } catch (err) {
          console.error('Error loading symbolic name:', err);
          setError(err.message);
          // Fallback to local name
          setSymbolicName(formatSymbolicName(user.displayName || 'User'));
        } finally {
          setLoading(false);
        }
      };

      loadSymbolicName();
    });

    return () => unsubscribe();
  }, []);

  const updateSymbolicName = async (newName) => {
    const user = auth.currentUser;
    if (!user) {
      setError('No user logged in');
      return false;
    }

    // Validate format
    if (!isValidSymbolicName(newName)) {
      setError('Invalid symbolic name format. Use §(name) with 2-20 alphanumeric characters.');
      return false;
    }

    try {
      await setDoc(doc(db, 'users', user.uid), {
        symbolicName: newName,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setSymbolicName(newName);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error updating symbolic name:', err);
      setError(err.message);
      return false;
    }
  };

  return {
    symbolicName,
    loading,
    error,
    updateSymbolicName
  };
};

/**
 * Get or create a symbolic name for any user ID
 * Useful for displaying other users' names in chat
 */
export const getUserSymbolicName = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().symbolicName || formatSymbolicName('User');
    }
    return formatSymbolicName('User');
  } catch (err) {
    console.error('Error getting user symbolic name:', err);
    return formatSymbolicName('User');
  }
};
