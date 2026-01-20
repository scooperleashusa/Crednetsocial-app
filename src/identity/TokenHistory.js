import React, { useState, useEffect } from 'react';
import { getUserTokenHistory } from '../lib/tokens';
import { formatTime, formatDate } from '../lib/utils';

const TokenHistory = ({ userId, limit = 20 }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadHistory();
  }, [userId, limit]);

  const loadHistory = async () => {
    try {
      const history = await getUserTokenHistory(userId, limit);
      setTransactions(history);
    } catch (error) {
      console.error('Error loading token history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      signal: '📡',
      breadcrumb: '🍞',
      contribution: '💎',
      engagement: '⚡',
      reputation: '⭐'
    };
    return icons[type] || '🪙';
  };

  const getTypeColor = (type) => {
    const colors = {
      signal: '#4a9eff',
      breadcrumb: '#f59e0b',
      contribution: '#8b5cf6',
      engagement: '#10b981',
      reputation: '#ef4444'
    };
    return colors[type] || '#808080';
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === filter);

  if (loading) {
    return <div className="token-history loading">Loading history...</div>;
  }

  return (
    <div className="token-history">
      <div className="history-header">
        <h3>📜 Transaction History</h3>
        <div className="history-filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'signal' ? 'active' : ''}
            onClick={() => setFilter('signal')}
          >
            📡
          </button>
          <button 
            className={filter === 'breadcrumb' ? 'active' : ''}
            onClick={() => setFilter('breadcrumb')}
          >
            🍞
          </button>
          <button 
            className={filter === 'contribution' ? 'active' : ''}
            onClick={() => setFilter('contribution')}
          >
            💎
          </button>
        </div>
      </div>

      <div className="history-list">
        {filteredTransactions.length === 0 ? (
          <div className="empty-history">
            <p>No transactions yet</p>
          </div>
        ) : (
          filteredTransactions.map(tx => (
            <div key={tx.id} className="transaction-item">
              <div 
                className="transaction-icon"
                style={{ backgroundColor: `${getTypeColor(tx.type)}20` }}
              >
                {getTypeIcon(tx.type)}
              </div>
              <div className="transaction-details">
                <div className="transaction-description">{tx.description}</div>
                <div className="transaction-meta">
                  <span className="transaction-type">{tx.type}</span>
                  <span className="transaction-time">
                    {formatTime(tx.timestamp)} • {formatDate(tx.timestamp)}
                  </span>
                </div>
              </div>
              <div 
                className={`transaction-amount ${tx.amount > 0 ? 'positive' : 'negative'}`}
              >
                {tx.amount > 0 ? '+' : ''}{tx.amount}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="history-footer">
        <button className="load-more-btn" onClick={loadHistory}>
          Load More
        </button>
      </div>
    </div>
  );
};

export default TokenHistory;
