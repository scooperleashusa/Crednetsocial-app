import React, { useState } from 'react';
import GameRoomMessage from './GameRoomMessage';

const GameRoomChat = ({ currentUser, activeUsers, onMessageSent, onTokenTip }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tipAmount, setTipAmount] = useState(10);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: input,
      sender: currentUser.name,
      senderId: currentUser.id,
      senderTokens: currentUser.tokens,
      senderReputation: currentUser.reputation,
      timestamp: new Date(),
      reactions: [],
      tips: 0
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    onMessageSent(input);
  };

  const handleTip = (messageId, amount) => {
    const message = messages.find(m => m.id === messageId);
    if (message && currentUser.tokens >= amount) {
      onTokenTip(amount, message.senderId);
      setMessages(prev => 
        prev.map(m => 
          m.id === messageId ? { ...m, tips: m.tips + amount } : m
        )
      );
    }
  };

  const handleReaction = (messageId, reaction) => {
    setMessages(prev => 
      prev.map(m => {
        if (m.id === messageId) {
          const reactions = [...m.reactions];
          const existingIdx = reactions.findIndex(r => r.type === reaction);
          if (existingIdx >= 0) {
            reactions[existingIdx].count++;
          } else {
            reactions.push({ type: reaction, count: 1 });
          }
          return { ...m, reactions };
        }
        return m;
      })
    );
  };

  return (
    <div className="gameroom-chat human-mode">
      <div className="chat-header human-header">
        <div className="header-content">
          <div className="chat-mode-badge human-badge">👥 Community Chat</div>
          <h2>🎮 Game Room</h2>
          <p className="chat-subtitle">Connect with real humans and earn tokens together</p>
        </div>
        <div className="user-token-display">
          <span className="token-icon">🪙</span>
          <span className="token-amount">{currentUser.tokens}</span>
          <span className="reputation-badge" data-reputation={currentUser.reputation}>
            {currentUser.reputation.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>👋 Welcome to Game Room! Start the conversation and earn tokens.</p>
            <small>Posts: +10 tokens | Quality reactions: +5 tokens each</small>
          </div>
        ) : (
          messages.map((msg) => (
            <GameRoomMessage 
              key={msg.id} 
              message={msg}
              currentUser={currentUser}
              onTip={handleTip}
              onReaction={handleReaction}
            />
          ))
        )}
      </div>

      <div className="chat-input-section">
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Share your thoughts (+10 tokens)..."
            maxLength={500}
          />
          <button onClick={handleSend} className="send-btn">Send +10🪙</button>
        </div>
        <div className="chat-info">
          <span>{messages.length} messages</span>
          <span>{activeUsers.length} active players</span>
        </div>
      </div>
    </div>
  );
};

export default GameRoomChat;
