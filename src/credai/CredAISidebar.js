import React, { useState, useEffect } from 'react';
import { formatDate } from '../lib/utils';

const CredAISidebar = ({ currentConversation, onSelectConversation, onNewConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [showHistory, setShowHistory] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = () => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('chat_'));
    const convos = keys.map(key => {
      const messages = JSON.parse(localStorage.getItem(key));
      const id = key.replace('chat_', '');
      return {
        id,
        title: messages[0]?.text.substring(0, 30) + '...' || 'New Chat',
        messageCount: messages.length,
        lastMessage: messages[messages.length - 1]?.timestamp || new Date(),
        preview: messages[messages.length - 1]?.text.substring(0, 50) + '...' || ''
      };
    });
    
    convos.sort((a, b) => new Date(b.lastMessage) - new Date(a.lastMessage));
    setConversations(convos);
  };

  const handleDeleteConversation = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this conversation?')) {
      localStorage.removeItem(`chat_${id}`);
      loadConversations();
      if (currentConversation === id) {
        onNewConversation();
      }
    }
  };

  const handleNewChat = () => {
    onNewConversation();
    loadConversations();
  };

  return (
    <aside className="credai-sidebar">
      <div className="sidebar-header">
        <h3>🤖 Cred AI</h3>
        <button 
          className="btn-primary btn-sm"
          onClick={handleNewChat}
        >
          ➕ New Chat
        </button>
      </div>
      
      <div className="sidebar-info">
        <p>Your AI-powered assistant for CredNet Social</p>
      </div>

      <div className="sidebar-stats">
        <div className="stat-item">
          <span className="stat-label">Conversations</span>
          <span className="stat-value">{conversations.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Status</span>
          <span className="stat-value status-online">● Online</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div 
          className="section-header"
          onClick={() => setShowHistory(!showHistory)}
        >
          <h4>💬 Chat History</h4>
          <span className="toggle-icon">{showHistory ? '▼' : '▶'}</span>
        </div>
        
        {showHistory && (
          <div className="conversation-list">
            {conversations.length === 0 ? (
              <p className="empty-state">No conversations yet. Start a new chat!</p>
            ) : (
              conversations.map(convo => (
                <div
                  key={convo.id}
                  className={`conversation-item ${currentConversation === convo.id ? 'active' : ''}`}
                  onClick={() => onSelectConversation(convo.id)}
                >
                  <div className="conversation-header">
                    <span className="conversation-title">{convo.title}</span>
                    <button
                      className="delete-btn"
                      onClick={(e) => handleDeleteConversation(convo.id, e)}
                      title="Delete conversation"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="conversation-preview">{convo.preview}</div>
                  <div className="conversation-meta">
                    <span>{convo.messageCount} messages</span>
                    <span>{formatDate(convo.lastMessage)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="tips">
          <h4>💡 Tips</h4>
          <ul>
            <li>Use code blocks with ```</li>
            <li>React to messages</li>
            <li>Copy responses easily</li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default CredAISidebar;
