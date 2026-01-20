import React, { useState } from 'react';
import { formatTime, formatSymbolicName, extractSymbolicMentions } from '../lib/utils';

const GameRoomMessage = ({ message, currentUser, onTip, onReaction }) => {
  const [showTipOptions, setShowTipOptions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const reactionOptions = ['👍', '🔥', '💯', '🚀', '💡', '❤️'];
  const tipAmounts = [5, 10, 25, 50];

  const getReputationColor = (reputation) => {
    const colors = {
      gold: '#ffd700',
      diamond: '#00d9ff',
      chrome: '#e8e8e8'
    };
    return colors[reputation] || '#e8e8e8';
  };

  const formatMessageText = (text) => {
    const mentions = extractSymbolicMentions(text);
    let formattedText = text;
    mentions.forEach(mention => {
      const regex = new RegExp(mention.replace(/[()]/g, '\\$&'), 'g');
      formattedText = formattedText.replace(
        regex,
        `<span class="symbolic-mention">${mention}</span>`
      );
    });
    return formattedText;
  };

  const symbolicName = formatSymbolicName(message.sender);
  const avatarInitial = message.sender.charAt(0).toUpperCase();

  return (
    <div className="gameroom-message human-message">
      <div className="message-avatar">
        <div className="avatar" style={{ borderColor: getReputationColor(message.senderReputation) }}>
          {avatarInitial}
        </div>
        <div className="human-indicator">👤</div>
      </div>

      <div className="message-content">
        <div className="message-header">
          <div className="sender-info">
            <span className="message-sender symbolic-name">{symbolicName}</span>
            <span className="sender-badge">Community Member</span>
            <span className="sender-tokens">🪙 {message.senderTokens}</span>
            <span className="reputation-tag" data-reputation={message.senderReputation}>
              {message.senderReputation}
            </span>
          </div>
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>

        <div className="message-text" dangerouslySetInnerHTML={{ __html: `<p>${formatMessageText(message.text)}</p>` }} />

        {message.reactions.length > 0 && (
          <div className="message-reactions">
            {message.reactions.map((r, idx) => (
              <button 
                key={idx} 
                className="reaction-chip"
                onClick={() => onReaction(message.id, r.type)}
              >
                {r.type} {r.count}
              </button>
            ))}
          </div>
        )}

        <div className="message-actions">
          <button 
            className="action-btn"
            onClick={() => setShowReactions(!showReactions)}
            title="React"
          >
            😊 React
          </button>
          <button 
            className="action-btn"
            onClick={() => setShowTipOptions(!showTipOptions)}
            title="Tip with tokens"
          >
            🪙 Tip
          </button>
          {message.tips > 0 && (
            <span className="tip-count">💰 {message.tips} tokens tipped</span>
          )}
        </div>

        {showReactions && (
          <div className="reaction-picker">
            {reactionOptions.map(reaction => (
              <button
                key={reaction}
                className="reaction-option"
                onClick={() => {
                  onReaction(message.id, reaction);
                  setShowReactions(false);
                }}
              >
                {reaction}
              </button>
            ))}
          </div>
        )}

        {showTipOptions && (
          <div className="tip-picker">
            <p>Support this player:</p>
            <div className="tip-options">
              {tipAmounts.map(amount => (
                <button
                  key={amount}
                  className="tip-option"
                  disabled={currentUser.tokens < amount}
                  onClick={() => {
                    onTip(message.id, amount);
                    setShowTipOptions(false);
                  }}
                >
                  <span>{amount}</span>
                  <span>🪙</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameRoomMessage;
