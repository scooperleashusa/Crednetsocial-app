/**
 * OAuth Provider Module
 * Allows CredNet Social to act as an identity provider for third-party applications
 * Enables "Sign in with CredNet Social" functionality
 */

import { auth, db } from './firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { formatSymbolicName } from './utils';
import { getUserSymbolicName } from './useSymbolicName';

// OAuth 2.0 Configuration
const OAUTH_CONFIG = {
  authorizationEndpoint: `${window.location.origin}/oauth/authorize`,
  tokenEndpoint: `${window.location.origin}/oauth/token`,
  userInfoEndpoint: `${window.location.origin}/oauth/userinfo`,
  scopes: ['profile', 'email', 'symbolic_name', 'tokens', 'reputation'],
  responseTypes: ['code', 'token'],
  grantTypes: ['authorization_code', 'refresh_token']
};

/**
 * Generate OAuth client credentials
 */
export const generateClientId = () => {
  return 'crn_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const generateClientSecret = () => {
  return 'crns_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Register a new OAuth client application
 */
export const registerOAuthClient = async (clientData) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be authenticated to register OAuth client');

  const clientId = generateClientId();
  const clientSecret = generateClientSecret();

  const client = {
    clientId,
    clientSecret,
    clientName: clientData.name,
    clientLogo: clientData.logo || '',
    redirectUris: clientData.redirectUris || [],
    allowedScopes: clientData.scopes || ['profile', 'email', 'symbolic_name'],
    ownerId: user.uid,
    createdAt: new Date().toISOString(),
    active: true
  };

  await setDoc(doc(db, 'oauth_clients', clientId), client);
  
  return {
    clientId,
    clientSecret,
    message: 'OAuth client registered successfully'
  };
};

/**
 * Get OAuth client details
 */
export const getOAuthClient = async (clientId) => {
  const clientDoc = await getDoc(doc(db, 'oauth_clients', clientId));
  if (!clientDoc.exists()) {
    throw new Error('Invalid client ID');
  }
  return clientDoc.data();
};

/**
 * Generate authorization code
 */
export const generateAuthorizationCode = () => {
  return 'crnauth_' + Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36) +
         Math.random().toString(36).substring(2, 15);
};

/**
 * Generate access token
 */
export const generateAccessToken = () => {
  return 'crnat_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = () => {
  return 'crnrt_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Create authorization code for OAuth flow
 */
export const createAuthorizationCode = async (userId, clientId, scopes, redirectUri) => {
  const code = generateAuthorizationCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await setDoc(doc(db, 'oauth_codes', code), {
    code,
    userId,
    clientId,
    scopes: scopes.split(' '),
    redirectUri,
    expiresAt: expiresAt.toISOString(),
    used: false,
    createdAt: new Date().toISOString()
  });

  return code;
};

/**
 * Exchange authorization code for access token
 */
export const exchangeCodeForToken = async (code, clientId, clientSecret, redirectUri) => {
  // Verify code exists and is valid
  const codeDoc = await getDoc(doc(db, 'oauth_codes', code));
  if (!codeDoc.exists()) {
    throw new Error('Invalid authorization code');
  }

  const codeData = codeDoc.data();
  
  // Verify code hasn't been used
  if (codeData.used) {
    throw new Error('Authorization code already used');
  }

  // Verify code hasn't expired
  if (new Date(codeData.expiresAt) < new Date()) {
    throw new Error('Authorization code expired');
  }

  // Verify client
  const client = await getOAuthClient(clientId);
  if (client.clientSecret !== clientSecret) {
    throw new Error('Invalid client credentials');
  }

  // Verify redirect URI
  if (codeData.redirectUri !== redirectUri) {
    throw new Error('Redirect URI mismatch');
  }

  // Mark code as used
  await setDoc(doc(db, 'oauth_codes', code), { ...codeData, used: true });

  // Generate tokens
  const accessToken = generateAccessToken();
  const refreshToken = generateRefreshToken();
  const expiresIn = 3600; // 1 hour

  // Store access token
  await setDoc(doc(db, 'oauth_tokens', accessToken), {
    accessToken,
    refreshToken,
    userId: codeData.userId,
    clientId,
    scopes: codeData.scopes,
    expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    createdAt: new Date().toISOString()
  });

  return {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: expiresIn,
    refresh_token: refreshToken,
    scope: codeData.scopes.join(' ')
  };
};

/**
 * Get user info from access token
 */
export const getUserInfo = async (accessToken) => {
  const tokenDoc = await getDoc(doc(db, 'oauth_tokens', accessToken));
  if (!tokenDoc.exists()) {
    throw new Error('Invalid access token');
  }

  const tokenData = tokenDoc.data();
  
  // Check if token is expired
  if (new Date(tokenData.expiresAt) < new Date()) {
    throw new Error('Access token expired');
  }

  // Get user data
  const userDoc = await getDoc(doc(db, 'users', tokenData.userId));
  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  const userData = userDoc.data();
  const scopes = tokenData.scopes;

  // Build response based on scopes
  const userInfo = {
    sub: tokenData.userId,
  };

  if (scopes.includes('profile')) {
    userInfo.name = userData.displayName || 'User';
    userInfo.picture = userData.photoURL || null;
  }

  if (scopes.includes('email')) {
    userInfo.email = userData.email || null;
    userInfo.email_verified = userData.emailVerified || false;
  }

  if (scopes.includes('symbolic_name')) {
    userInfo.symbolic_name = userData.symbolicName || formatSymbolicName('User');
    userInfo.symbolic_name_plain = userData.symbolicName?.replace(/§\(|\)/g, '') || 'User';
  }

  if (scopes.includes('tokens')) {
    userInfo.token_balance = userData.tokens || 0;
  }

  if (scopes.includes('reputation')) {
    userInfo.reputation = userData.reputation || 'chrome';
    userInfo.breadcrumb_score = userData.breadcrumbScore || 0;
  }

  return userInfo;
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (refreshToken, clientId, clientSecret) => {
  // Find token by refresh token
  const tokensRef = collection(db, 'oauth_tokens');
  const q = query(tokensRef, where('refreshToken', '==', refreshToken));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error('Invalid refresh token');
  }

  const oldTokenDoc = querySnapshot.docs[0];
  const oldTokenData = oldTokenDoc.data();

  // Verify client
  if (oldTokenData.clientId !== clientId) {
    throw new Error('Client ID mismatch');
  }

  const client = await getOAuthClient(clientId);
  if (client.clientSecret !== clientSecret) {
    throw new Error('Invalid client credentials');
  }

  // Generate new access token
  const newAccessToken = generateAccessToken();
  const expiresIn = 3600; // 1 hour

  // Store new access token
  await setDoc(doc(db, 'oauth_tokens', newAccessToken), {
    accessToken: newAccessToken,
    refreshToken: oldTokenData.refreshToken,
    userId: oldTokenData.userId,
    clientId: oldTokenData.clientId,
    scopes: oldTokenData.scopes,
    expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    createdAt: new Date().toISOString()
  });

  return {
    access_token: newAccessToken,
    token_type: 'Bearer',
    expires_in: expiresIn,
    scope: oldTokenData.scopes.join(' ')
  };
};

/**
 * Revoke access token
 */
export const revokeToken = async (token) => {
  const tokenDoc = await getDoc(doc(db, 'oauth_tokens', token));
  if (tokenDoc.exists()) {
    await setDoc(doc(db, 'oauth_tokens', token), {
      ...tokenDoc.data(),
      revoked: true,
      revokedAt: new Date().toISOString()
    });
  }
};

/**
 * Get list of authorized applications for current user
 */
export const getAuthorizedApps = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be authenticated');

  const tokensRef = collection(db, 'oauth_tokens');
  const q = query(tokensRef, where('userId', '==', user.uid));
  const querySnapshot = await getDocs(q);

  const apps = [];
  for (const doc of querySnapshot.docs) {
    const tokenData = doc.data();
    if (!tokenData.revoked) {
      const client = await getOAuthClient(tokenData.clientId);
      apps.push({
        clientId: tokenData.clientId,
        clientName: client.clientName,
        clientLogo: client.clientLogo,
        scopes: tokenData.scopes,
        authorizedAt: tokenData.createdAt
      });
    }
  }

  return apps;
};

/**
 * Revoke access for a specific application
 */
export const revokeApp = async (clientId) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be authenticated');

  const tokensRef = collection(db, 'oauth_tokens');
  const q = query(
    tokensRef, 
    where('userId', '==', user.uid),
    where('clientId', '==', clientId)
  );
  const querySnapshot = await getDocs(q);

  for (const doc of querySnapshot.docs) {
    await revokeToken(doc.id);
  }
};

export const OAUTH_ENDPOINTS = OAUTH_CONFIG;
