import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { getOAuthClient, createAuthorizationCode } from '../lib/oauthProvider';
import { useSymbolicName } from '../lib/useSymbolicName';
import '../styles/oauth.css';

const OAuthAuthorize = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { symbolicName } = useSymbolicName();
  
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorizing, setAuthorizing] = useState(false);

  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri');
  const scope = searchParams.get('scope') || 'profile email symbolic_name';
  const state = searchParams.get('state');
  const responseType = searchParams.get('response_type') || 'code';

  useEffect(() => {
    const loadClient = async () => {
      if (!clientId) {
        setError('Missing client_id parameter');
        setLoading(false);
        return;
      }

      try {
        const clientData = await getOAuthClient(clientId);
        
        // Verify redirect URI
        if (!clientData.redirectUris.includes(redirectUri)) {
          setError('Invalid redirect_uri');
          setLoading(false);
          return;
        }

        setClient(clientData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [clientId, redirectUri]);

  const handleAuthorize = async () => {
    const user = auth.currentUser;
    if (!user) {
      // Redirect to login
      navigate(`/login?return_to=${encodeURIComponent(window.location.href)}`);
      return;
    }

    setAuthorizing(true);
    setError(null);

    try {
      // Create authorization code
      const code = await createAuthorizationCode(user.uid, clientId, scope, redirectUri);
      
      // Redirect back to client with authorization code
      const redirectUrl = new URL(redirectUri);
      redirectUrl.searchParams.set('code', code);
      if (state) redirectUrl.searchParams.set('state', state);
      
      window.location.href = redirectUrl.toString();
    } catch (err) {
      setError(err.message);
      setAuthorizing(false);
    }
  };

  const handleDeny = () => {
    const redirectUrl = new URL(redirectUri);
    redirectUrl.searchParams.set('error', 'access_denied');
    redirectUrl.searchParams.set('error_description', 'User denied authorization');
    if (state) redirectUrl.searchParams.set('state', state);
    
    window.location.href = redirectUrl.toString();
  };

  const scopeDescriptions = {
    profile: 'View your basic profile information',
    email: 'View your email address',
    symbolic_name: 'View your §name handle',
    tokens: 'View your token balance',
    reputation: 'View your reputation and breadcrumb score'
  };

  const requestedScopes = scope.split(' ');

  if (loading) {
    return (
      <div className="oauth-page">
        <div className="oauth-card">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="oauth-page">
        <div className="oauth-card error-card">
          <h2>❌ Authorization Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="oauth-page">
      <div className="oauth-card">
        <div className="oauth-header">
          <div className="crednetsocial-logo">
            <span className="logo-icon">🔷</span>
            <span className="logo-text">CredNet Social</span>
          </div>
        </div>

        <div className="oauth-body">
          {client?.clientLogo && (
            <div className="client-logo">
              <img src={client.clientLogo} alt={client.clientName} />
            </div>
          )}

          <h2 className="oauth-title">Authorize {client?.clientName}</h2>
          
          <div className="user-identity">
            <div className="identity-badge">
              <span className="identity-icon">👤</span>
              <span className="identity-name">{symbolicName}</span>
            </div>
          </div>

          <div className="oauth-message">
            <p><strong>{client?.clientName}</strong> is requesting access to your CredNet Social account.</p>
          </div>

          <div className="permissions-section">
            <h3>This application will be able to:</h3>
            <ul className="permissions-list">
              {requestedScopes.map(scope => (
                <li key={scope} className="permission-item">
                  <span className="permission-icon">✓</span>
                  <span className="permission-text">{scopeDescriptions[scope] || scope}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="oauth-notice">
            <p>By authorizing, you allow this application to use your information in accordance with their <a href="#">terms of service</a> and <a href="#">privacy policy</a>.</p>
          </div>

          <div className="oauth-actions">
            <button 
              className="btn-authorize" 
              onClick={handleAuthorize}
              disabled={authorizing}
            >
              {authorizing ? 'Authorizing...' : 'Authorize'}
            </button>
            <button 
              className="btn-deny" 
              onClick={handleDeny}
              disabled={authorizing}
            >
              Deny
            </button>
          </div>

          {error && (
            <div className="oauth-error">
              <p>⚠️ {error}</p>
            </div>
          )}
        </div>

        <div className="oauth-footer">
          <p>Powered by CredNet Social OAuth</p>
        </div>
      </div>
    </div>
  );
};

export default OAuthAuthorize;
