import React, { useState, useEffect } from 'react';
import { getAuthorizedApps, revokeApp, registerOAuthClient } from '../lib/oauthProvider';
import '../styles/oauth.css';

const OAuthSettings = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    logo: '',
    redirectUris: [''],
    scopes: ['profile', 'email', 'symbolic_name']
  });
  const [clientCredentials, setClientCredentials] = useState(null);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    setLoading(true);
    try {
      const authorizedApps = await getAuthorizedApps();
      setApps(authorizedApps);
    } catch (err) {
      console.error('Error loading apps:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (clientId) => {
    if (!window.confirm('Revoke access for this application?')) return;

    try {
      await revokeApp(clientId);
      setApps(apps.filter(app => app.clientId !== clientId));
    } catch (err) {
      console.error('Error revoking app:', err);
      alert('Failed to revoke access');
    }
  };

  const handleRegisterClient = async (e) => {
    e.preventDefault();
    setRegistering(true);

    try {
      const credentials = await registerOAuthClient({
        name: newClient.name,
        logo: newClient.logo,
        redirectUris: newClient.redirectUris.filter(uri => uri.trim()),
        scopes: newClient.scopes
      });

      setClientCredentials(credentials);
      setShowRegister(false);
      
      // Reset form
      setNewClient({
        name: '',
        logo: '',
        redirectUris: [''],
        scopes: ['profile', 'email', 'symbolic_name']
      });
    } catch (err) {
      console.error('Error registering client:', err);
      alert('Failed to register OAuth client');
    } finally {
      setRegistering(false);
    }
  };

  const addRedirectUri = () => {
    setNewClient({
      ...newClient,
      redirectUris: [...newClient.redirectUris, '']
    });
  };

  const updateRedirectUri = (index, value) => {
    const uris = [...newClient.redirectUris];
    uris[index] = value;
    setNewClient({ ...newClient, redirectUris: uris });
  };

  const removeRedirectUri = (index) => {
    const uris = newClient.redirectUris.filter((_, i) => i !== index);
    setNewClient({ ...newClient, redirectUris: uris });
  };

  const toggleScope = (scope) => {
    const scopes = newClient.scopes.includes(scope)
      ? newClient.scopes.filter(s => s !== scope)
      : [...newClient.scopes, scope];
    setNewClient({ ...newClient, scopes });
  };

  return (
    <div className="oauth-settings-page">
      <h2>OAuth & Connected Apps</h2>

      <div className="oauth-tabs">
        <button 
          className="tab-btn active"
          onClick={() => setShowRegister(false)}
        >
          Authorized Apps
        </button>
        <button 
          className="tab-btn"
          onClick={() => setShowRegister(true)}
        >
          Register OAuth Client
        </button>
      </div>

      {!showRegister ? (
        <div className="authorized-apps-section">
          <p className="section-description">
            These applications have access to your CredNet Social account. You can revoke access at any time.
          </p>

          {loading ? (
            <div className="loading">Loading authorized applications...</div>
          ) : apps.length === 0 ? (
            <div className="empty-state">
              <p>🔒 No authorized applications</p>
              <small>When you sign in to other platforms using CredNet Social, they will appear here.</small>
            </div>
          ) : (
            <div className="apps-list">
              {apps.map(app => (
                <div key={app.clientId} className="app-card">
                  {app.clientLogo && (
                    <img src={app.clientLogo} alt={app.clientName} className="app-logo" />
                  )}
                  <div className="app-info">
                    <h3>{app.clientName}</h3>
                    <p className="app-scopes">
                      Access: {app.scopes.join(', ')}
                    </p>
                    <p className="app-date">
                      Authorized: {new Date(app.authorizedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    className="btn-revoke"
                    onClick={() => handleRevoke(app.clientId)}
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="register-client-section">
          <p className="section-description">
            Register your application to allow users to sign in with CredNet Social.
          </p>

          {clientCredentials ? (
            <div className="credentials-display">
              <h3>✅ OAuth Client Registered!</h3>
              <div className="credential-item">
                <label>Client ID:</label>
                <code>{clientCredentials.clientId}</code>
              </div>
              <div className="credential-item">
                <label>Client Secret:</label>
                <code>{clientCredentials.clientSecret}</code>
              </div>
              <div className="warning">
                ⚠️ <strong>Save these credentials now!</strong> The client secret will not be shown again.
              </div>
              <button onClick={() => setClientCredentials(null)}>Close</button>
            </div>
          ) : (
            <form onSubmit={handleRegisterClient} className="register-form">
              <div className="form-group">
                <label>Application Name *</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="My Awesome App"
                  required
                />
              </div>

              <div className="form-group">
                <label>Application Logo URL (optional)</label>
                <input
                  type="url"
                  value={newClient.logo}
                  onChange={(e) => setNewClient({ ...newClient, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="form-group">
                <label>Redirect URIs *</label>
                {newClient.redirectUris.map((uri, index) => (
                  <div key={index} className="uri-input-group">
                    <input
                      type="url"
                      value={uri}
                      onChange={(e) => updateRedirectUri(index, e.target.value)}
                      placeholder="https://your-app.com/callback"
                      required
                    />
                    {newClient.redirectUris.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeRedirectUri(index)}
                        className="btn-remove"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addRedirectUri} className="btn-add">
                  + Add another URI
                </button>
              </div>

              <div className="form-group">
                <label>Allowed Scopes</label>
                <div className="scopes-checkboxes">
                  {['profile', 'email', 'symbolic_name', 'tokens', 'reputation'].map(scope => (
                    <label key={scope} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newClient.scopes.includes(scope)}
                        onChange={() => toggleScope(scope)}
                      />
                      {scope}
                    </label>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-register"
                disabled={registering}
              >
                {registering ? 'Registering...' : 'Register OAuth Client'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default OAuthSettings;
