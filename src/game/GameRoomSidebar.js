import React, { useState } from 'react';

const GameRoomSidebar = ({ users, currentUser }) => {
  const [sortBy, setSortBy] = useState('tokens');

  const getReputationColor = (reputation) => {
    const colors = {
      gold: '#ffd700',
      diamond: '#00d9ff',
      chrome: '#e8e8e8'
    };
    return colors[reputation] || '#e8e8e8';
  };

  const getRankBadge = (tokens) => {
    if (tokens >= 1000) return '🏆';
    if (tokens >= 500) return '🥇';
    if (tokens >= 200) return '🥈';
    if (tokens >= 100) return '🥉';
    return '⭐';
  };

  const sortedUsers = [...users.active].sort((a, b) => {
    if (sortBy === 'tokens') return b.tokens - a.tokens;
    return a.name.localeCompare(b.name);
  });

  return (
    <aside className="gameroom-sidebar">
      <div className="sidebar-header">
        <h3>🎮 Game Room</h3>
      </div>

      <div className="current-user-card">
        <div className="user-avatar" style={{ borderColor: getReputationColor(currentUser.reputation) }}>
          {currentUser.name.charAt(0).toUpperCase()}
        </div>
        <div className="user-details">
          <p className="user-name">{currentUser.name}</p>
          <div className="user-stats">
            <span className="stat">🪙 {currentUser.tokens}</span>
            <span className="reputation" data-reputation={currentUser.reputation}>
              {currentUser.reputation}
            </span>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="section-header">
          <h4>Active Players ({users.active.length})</h4>
          <select 
            className="sort-selector"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="tokens">Top Players</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
        <div className="players-list">
          {sortedUsers.map((user) => (
            <div key={user.id} className="player-item">
              <div className="player-avatar" style={{ borderColor: getReputationColor(user.reputation) }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="player-info">
                <p className="player-name">{user.name}</p>
                <div className="player-stats">
                  <span className="rank-badge">{getRankBadge(user.tokens)}</span>
                  <span className="player-tokens">{user.tokens} 🪙</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h4>🏅 Leaderboard</h4>
        <div className="mini-leaderboard">
          {sortedUsers.slice(0, 3).map((user, idx) => (
            <div key={user.id} className="leaderboard-item">
              <span className="rank">{['🥇', '🥈', '🥉'][idx]}</span>
              <span className="name">{user.name}</span>
              <span className="tokens">{user.tokens}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-section tips-section">
        <h4>💡 Token Tips</h4>
        <ul className="tips-list">
          <li>✓ Post message: +10 🪙</li>
          <li>✓ React to content: +5 🪙</li>
          <li>✓ Earn streak bonus: 2x 🪙</li>
          <li>✓ Tip quality: -5~50 🪙</li>
        </ul>
      </div>

      <div className="sidebar-section info-section">
        <h4>📊 Room Stats</h4>
        <div className="room-stats">
          <div className="stat-item">
            <span className="stat-label">Total Tokens</span>
            <span className="stat-value">{users.active.reduce((sum, u) => sum + u.tokens, 0) + currentUser.tokens}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Average Rank</span>
            <span className="stat-value">Silver</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default GameRoomSidebar;
