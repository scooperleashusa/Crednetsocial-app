import React, { useState } from 'react';
import SymbolicName from '../identity/SymbolicName';
import BreadcrumbScore from '../identity/BreadcrumbScore';
import TokenBalance from '../identity/TokenBalance';
import TokenHistory from '../identity/TokenHistory';
import TokenStats from '../identity/TokenStats';
import CaesarBuilder from '../identity/CaesarBuilder';
import { CAESAR_MOTTO } from '../lib/caesarBuilder';
import '../styles/identity.css';

const Profile = () => {
  const userId = 'current-user'; // Replace with actual user ID
  const [showCaesarBuilder, setShowCaesarBuilder] = useState(false);
  const [caesar, setCaesar] = useState(null);

  // Mock Caesar profile
  const mockCaesar = {
    id: 'caesar-1',
    tagline: 'Full-Stack Developer | Tech Enthusiast | Open Source Advocate',
    bio: '5+ years building web apps and learning. Passionate about Innovation and Community. Let\'s build something amazing together. Always growing! 🚀',
    field: 'Software Development',
    expertise: '5+ years full-stack development',
    values: ['Innovation', 'Community'],
    goals: 'Learn from experts and share knowledge',
    style: 'Professional',
    signals: ['coding', 'tech-trends', 'open-source', 'learning'],
    reputation: 100,
    tokens: 50,
    credibilityScore: 60
  };

  const handleCaesarComplete = (profile) => {
    setCaesar(profile);
    setShowCaesarBuilder(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-identity">
          <SymbolicName name="YourSymbolicName" />
          <BreadcrumbScore score={85} />
        </div>
        <TokenBalance userId={userId} compact={true} />
      </div>

      {/* Caesar Profile Section */}
      {caesar || mockCaesar ? (
        <div className="caesar-section">
          <div className="caesar-card">
            <div className="caesar-motto-banner">
              <p className="caesar-motto-text">{CAESAR_MOTTO}</p>
            </div>
            <div className="caesar-header">
              <div className="caesar-avatar">👑</div>
              <div className="caesar-title">
                <h2>{(caesar || mockCaesar).tagline}</h2>
                <p className="caesar-bio">{(caesar || mockCaesar).bio}</p>
              </div>
              <button 
                className="btn-edit-caesar"
                onClick={() => setShowCaesarBuilder(true)}
              >
                ✏️ Edit
              </button>
            </div>

            <div className="caesar-details">
              <div className="detail">
                <span className="label">Field:</span>
                <span className="value">{(caesar || mockCaesar).field}</span>
              </div>
              <div className="detail">
                <span className="label">Expertise:</span>
                <span className="value">{(caesar || mockCaesar).expertise}</span>
              </div>
              {(caesar || mockCaesar).values.length > 0 && (
                <div className="detail">
                  <span className="label">Values:</span>
                  <span className="value">{(caesar || mockCaesar).values.join(', ')}</span>
                </div>
              )}
            </div>

            <div className="caesar-signals">
              <h4>Topic Signals</h4>
              <div className="signals-list">
                {(caesar || mockCaesar).signals.map((signal, idx) => (
                  <span key={idx} className="signal-badge">#{signal}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="caesar-empty">
          <div className="empty-state">
            <div className="empty-icon">👑</div>
            <h3>Build Your Caesar</h3>
            <p>Create your unique digital identity with help from CredAI</p>
            <button 
              className="btn-build-caesar"
              onClick={() => setShowCaesarBuilder(true)}
            >
              🚀 Build Caesar Now
            </button>
          </div>
        </div>
      )}

      <div className="profile-content">
        <div className="profile-main">
          <section className="profile-section">
            <h3>About</h3>
            <p>Your profile information goes here.</p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">42</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat">
                <span className="stat-value">128</span>
                <span className="stat-label">Interactions</span>
              </div>
              <div className="stat">
                <span className="stat-value">15</span>
                <span className="stat-label">Days Active</span>
              </div>
            </div>
          </section>

          <section className="profile-section">
            <h3>Recent Activity</h3>
            <TokenHistory userId={userId} limit={10} />
          </section>
        </div>

        <div className="profile-sidebar">
          <TokenStats userId={userId} />
          <TokenBalance userId={userId} />
        </div>
      </div>

      {/* Caesar Builder Modal */}
      {showCaesarBuilder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="modal-close"
              onClick={() => setShowCaesarBuilder(false)}
            >
              ✕
            </button>
            <CaesarBuilder
              onComplete={handleCaesarComplete}
              onCancel={() => setShowCaesarBuilder(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
