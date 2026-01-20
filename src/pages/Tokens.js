import React, { useState } from 'react';
import TokenBalance from '../identity/TokenBalance';
import TokenHistory from '../identity/TokenHistory';
import TokenStats from '../identity/TokenStats';
import TokenLeaderboard from '../identity/TokenLeaderboard';
import TokenPurchase from '../identity/TokenPurchase';
import '../styles/identity.css';
import '../styles/tokens.css';

const Tokens = () => {
  const userId = 'current-user'; // Replace with actual user ID
  const [activeTab, setActiveTab] = useState('overview');
  const [userTokens, setUserTokens] = useState(450);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const handlePurchaseComplete = (purchaseData) => {
    setUserTokens(prev => prev + purchaseData.tokens);
    setShowPurchaseModal(false);
    // Here you would also save to Firebase/backend
  };

  return (
    <div className="tokens-page">
      <div className="tokens-header">
        <div className="header-content">
          <h2>🪙 Token Dashboard</h2>
          <p>Manage and track your CredNet Social tokens</p>
        </div>
        <button 
          className="btn-buy-tokens"
          onClick={() => setShowPurchaseModal(true)}
        >
          💳 Buy Tokens
        </button>
      </div>

      <div className="tokens-navigation">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          📜 History
        </button>
        <button 
          className={activeTab === 'leaderboard' ? 'active' : ''}
          onClick={() => setActiveTab('leaderboard')}
        >
          🏆 Leaderboard
        </button>
        <button 
          className={activeTab === 'earn' ? 'active' : ''}
          onClick={() => setActiveTab('earn')}
        >
          💰 Earn More
        </button>
        <button 
          className={activeTab === 'buy' ? 'active' : ''}
          onClick={() => setActiveTab('buy')}
        >
          💎 Buy
        </button>
      </div>

      <div className="tokens-content">
        {activeTab === 'overview' && (
          <div className="tokens-overview-page">
            <div className="overview-main">
              <TokenStats userId={userId} />
              <TokenBalance userId={userId} />
            </div>
            <div className="overview-sidebar">
              <TokenLeaderboard limit={5} />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="tokens-history-page">
            <TokenHistory userId={userId} limit={50} />
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="tokens-leaderboard-page">
            <TokenLeaderboard limit={20} />
          </div>
        )}

        {activeTab === 'earn' && (
          <div className="tokens-earn-page">
            <div className="earn-section">
              <h3>💎 How to Earn Tokens</h3>
              <div className="earn-methods">
                <div className="earn-method">
                  <div className="method-icon">📝</div>
                  <div className="method-details">
                    <h4>Create Content</h4>
                    <p>Earn <strong>10 tokens</strong> for each post you create</p>
                  </div>
                </div>
                <div className="earn-method">
                  <div className="method-icon">💬</div>
                  <div className="method-details">
                    <h4>Add Comments</h4>
                    <p>Earn <strong>5 tokens</strong> for meaningful comments</p>
                  </div>
                </div>
                <div className="earn-method">
                  <div className="method-icon">⭐</div>
                  <div className="method-details">
                    <h4>Share Helpful Content</h4>
                    <p>Earn <strong>25 tokens</strong> for highly-rated contributions</p>
                  </div>
                </div>
                <div className="earn-method">
                  <div className="method-icon">🤝</div>
                  <div className="method-details">
                    <h4>Quality Interactions</h4>
                    <p>Earn <strong>15 tokens</strong> for engaging discussions</p>
                  </div>
                </div>
                <div className="earn-method">
                  <div className="method-icon">📅</div>
                  <div className="method-details">
                    <h4>Daily Active</h4>
                    <p>Earn <strong>5 tokens</strong> daily for logging in</p>
                  </div>
                </div>
                <div className="earn-method">
                  <div className="method-icon">🏆</div>
                  <div className="method-details">
                    <h4>Unlock Achievements</h4>
                    <p>Earn <strong>50+ tokens</strong> for special milestones</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="earn-section">
              <h3>🎯 Token Multipliers</h3>
              <div className="multiplier-tiers">
                <div className="tier-card">
                  <div className="tier-level">1.0x</div>
                  <div className="tier-name">Starter</div>
                  <div className="tier-requirement">0-99 reputation</div>
                </div>
                <div className="tier-card">
                  <div className="tier-level">1.1x</div>
                  <div className="tier-name">Active</div>
                  <div className="tier-requirement">100-249 reputation</div>
                </div>
                <div className="tier-card">
                  <div className="tier-level">1.25x</div>
                  <div className="tier-name">Contributor</div>
                  <div className="tier-requirement">250-499 reputation</div>
                </div>
                <div className="tier-card">
                  <div className="tier-level">1.5x</div>
                  <div className="tier-name">Expert</div>
                  <div className="tier-requirement">500-999 reputation</div>
                </div>
                <div className="tier-card premium">
                  <div className="tier-level">2.0x</div>
                  <div className="tier-name">Elite</div>
                  <div className="tier-requirement">1000+ reputation</div>
                </div>
              </div>
            </div>

            <div className="earn-section">
              <h3>💡 Pro Tips</h3>
              <ul className="tips-list">
                <li>Focus on quality over quantity - helpful content earns more</li>
                <li>Engage consistently to build your reputation multiplier</li>
                <li>Complete daily activities for bonus tokens</li>
                <li>Participate in community events for special rewards</li>
                <li>Help new users to earn referral bonuses</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'buy' && (
          <div className="tokens-buy-page">
            <TokenPurchase 
              currentUser={{ id: userId, tokens: userTokens }}
              onPurchaseComplete={handlePurchaseComplete}
            />
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="modal-close"
              onClick={() => setShowPurchaseModal(false)}
            >
              ✕
            </button>
            <TokenPurchase 
              currentUser={{ id: userId, tokens: userTokens }}
              onPurchaseComplete={handlePurchaseComplete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tokens;