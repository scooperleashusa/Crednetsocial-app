import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { signInWithGoogle, signOut } from '../lib/auth';

const Header = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">CredNet Social</h1>
        <div className="header-actions">
          {loading ? (
            <span className="loading-text">...</span>
          ) : user ? (
            <div className="user-info">
              <span className="user-name">{user.displayName}</span>
              <button className="btn-secondary" onClick={handleSignOut}>Sign Out</button>
            </div>
          ) : (
            <button className="btn-secondary" onClick={handleSignIn}>Sign In</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
