import React, { useState, useEffect } from 'react';
import { getTokenLeaderboard } from '../lib/tokens';

const TokenLeaderboard = ({ tokenType = 'total', limit = 10 }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(tokenType);

  useEffect(() => {
    loadLeaderboard();
  }, [selectedType, limit]);

  const loadLeaderboard = async () => {
    try {
      const data = await getTokenLeaderboard(selectedType, limit);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const tokenTypes = [
    { value: 'total', label: 'Total', icon: '🪙' },
    { value: 'signal', label: 'Signal', icon: '📡' },
    { value: 'contribution', label: 'Contribution', icon: '💎' },
    { value: 'reputation', label: 'Reputation', icon: '⭐' }
  ];

  if (loading) {
    return <div className="token-leaderboard loading">Loading leaderboard...</div>;
  }

  return (
    <div className="token-leaderboard">
      <div className="leaderboard-header">
        <h3>🏆 Token Leaders</h3>
        <div className="leaderboard-type-selector">
          {tokenTypes.map(type => (
            <button
              key={type.value}
              className={selectedType === type.value ? 'active' : ''}
              onClick={() => setSelectedType(type.value)}
              title={type.label}
            >
              {type.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="leaderboard-list">
        {leaderboard.length === 0 ? (
          <div className="empty-leaderboard">
            <p>No data available</p>
          </div>
        ) : (
          leaderboard.map((entry, index) => (
            <div 
              key={entry.userId} 
              className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}
            >
              <div className="rank-badge">
                {getRankBadge(entry.rank)}
              </div>
              <div className="user-info">
                <div className="username">{entry.username}</div>
                <div className="user-id">{entry.userId}</div>
              </div>
              <div className="token-count">
                {entry.tokens.toLocaleString()}
                <span className="token-label">tokens</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="leaderboard-footer">
        <p className="leaderboard-hint">
          💡 Earn more tokens by contributing quality content
        </p>
      </div>
    </div>
  );
};

export default TokenLeaderboard;
