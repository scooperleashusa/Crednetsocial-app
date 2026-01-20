import React, { useState, useEffect } from 'react';
import { getUserTokenBalance } from '../lib/tokens';

const TokenBalance = ({ userId, compact = false }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(!compact);

  useEffect(() => {
    loadBalance();
  }, [userId]);

  const loadBalance = async () => {
    try {
      const tokenBalance = await getUserTokenBalance(userId);
      setBalance(tokenBalance);
    } catch (error) {
      console.error('Error loading token balance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="token-balance loading">Loading tokens...</div>;
  }

  if (!balance) {
    return <div className="token-balance error">Failed to load tokens</div>;
  }

  const tokenTypes = [
    { key: 'signal', label: 'Signal', icon: '📡', color: '#4a9eff' },
    { key: 'breadcrumb', label: 'Breadcrumb', icon: '🍞', color: '#f59e0b' },
    { key: 'contribution', label: 'Contribution', icon: '💎', color: '#8b5cf6' },
    { key: 'engagement', label: 'Engagement', icon: '⚡', color: '#10b981' },
    { key: 'reputation', label: 'Reputation', icon: '⭐', color: '#ef4444' }
  ];

  if (compact) {
    return (
      <div className="token-balance compact" onClick={() => setShowDetails(!showDetails)}>
        <div className="token-total">
          <span className="token-icon">🪙</span>
          <span className="token-amount">{balance.total.toLocaleString()}</span>
          <span className="token-label">Tokens</span>
        </div>
        {showDetails && (
          <div className="token-breakdown">
            {tokenTypes.map(type => (
              <div key={type.key} className="token-type-mini">
                <span>{type.icon}</span>
                <span>{balance[type.key]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="token-balance">
      <div className="token-header">
        <h3>🪙 Token Balance</h3>
        <button className="refresh-btn" onClick={loadBalance}>🔄</button>
      </div>
      
      <div className="token-total-card">
        <div className="total-label">Total Tokens</div>
        <div className="total-amount">{balance.total.toLocaleString()}</div>
      </div>

      <div className="token-types">
        {tokenTypes.map(type => (
          <div 
            key={type.key} 
            className="token-type"
            style={{ borderLeft: `4px solid ${type.color}` }}
          >
            <div className="token-type-header">
              <span className="token-icon">{type.icon}</span>
              <span className="token-name">{type.label}</span>
            </div>
            <div className="token-type-amount">
              {balance[type.key].toLocaleString()}
            </div>
            <div className="token-type-bar">
              <div 
                className="token-type-fill"
                style={{ 
                  width: `${(balance[type.key] / balance.total) * 100}%`,
                  backgroundColor: type.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenBalance;
