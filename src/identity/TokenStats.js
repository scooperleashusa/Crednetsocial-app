import React, { useState, useEffect } from 'react';
import { getTokenStats } from '../lib/tokens';

const TokenStats = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      const tokenStats = await getTokenStats(userId);
      setStats(tokenStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="token-stats loading">Loading stats...</div>;
  }

  if (!stats) {
    return <div className="token-stats error">Failed to load stats</div>;
  }

  const statItems = [
    {
      label: 'Total Balance',
      value: stats.balance.total.toLocaleString(),
      icon: '🪙',
      color: '#4a9eff'
    },
    {
      label: 'Total Earned',
      value: stats.totalEarned.toLocaleString(),
      icon: '📈',
      color: '#10b981'
    },
    {
      label: 'Total Spent',
      value: stats.totalSpent.toLocaleString(),
      icon: '📉',
      color: '#ef4444'
    },
    {
      label: 'Today\'s Earnings',
      value: stats.dailyEarnings.toLocaleString(),
      icon: '⚡',
      color: '#f59e0b'
    },
    {
      label: 'Transactions',
      value: stats.transactionCount.toLocaleString(),
      icon: '📊',
      color: '#8b5cf6'
    },
    {
      label: 'Avg Per Transaction',
      value: Math.round(stats.averageTransaction).toLocaleString(),
      icon: '💫',
      color: '#ec4899'
    }
  ];

  return (
    <div className="token-stats">
      <div className="stats-header">
        <h3>📊 Token Statistics</h3>
        <button className="refresh-btn" onClick={loadStats}>🔄</button>
      </div>

      <div className="stats-grid">
        {statItems.map((item, index) => (
          <div 
            key={index} 
            className="stat-card"
            style={{ borderTop: `3px solid ${item.color}` }}
          >
            <div className="stat-icon" style={{ color: item.color }}>
              {item.icon}
            </div>
            <div className="stat-details">
              <div className="stat-label">{item.label}</div>
              <div className="stat-value">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="stats-insights">
        <h4>💡 Insights</h4>
        <div className="insight-item">
          <span className="insight-icon">🎯</span>
          <span className="insight-text">
            You're earning an average of {Math.round(stats.averageTransaction)} tokens per transaction
          </span>
        </div>
        {stats.dailyEarnings > 0 && (
          <div className="insight-item positive">
            <span className="insight-icon">🔥</span>
            <span className="insight-text">
              Great job! You've earned {stats.dailyEarnings} tokens today
            </span>
          </div>
        )}
        {stats.balance.total > 500 && (
          <div className="insight-item">
            <span className="insight-icon">💎</span>
            <span className="insight-text">
              You're in the top tier with {stats.balance.total} total tokens!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenStats;
