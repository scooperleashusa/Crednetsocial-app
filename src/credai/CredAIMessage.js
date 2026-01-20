import React, { useState } from 'react';
import { formatTime, formatSymbolicName, parseSymbolicName, extractSymbolicMentions } from '../lib/utils';

const CredAIMessage = ({ message, onRegenerate, userName }) => {
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState(message.reaction || null);
  const isUser = message.sender === 'user';
  const isError = message.error;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReact = (emoji) => {
    setReaction(reaction === emoji ? null : emoji);
  };

  // Simple markdown-like formatting with §name highlighting
  const formatText = (text) => {
    if (!text) return '';
    
    // First, highlight §name mentions
    let processedText = text;
    const mentions = extractSymbolicMentions(text);
    mentions.forEach(mention => {
      const regex = new RegExp(mention.replace(/[()]/g, '\\$&'), 'g');
      processedText = processedText.replace(
        regex,
        `<mark class="symbolic-mention">${mention}</mark>`
      );
    });
    
    // Code blocks
    const parts = processedText.split(/(```[\s\S]*?```|`[^`]+`)/g);
    
    return parts.map((part, idx) => {
      // Multi-line code block
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3).trim();
        const [language, ...codeLines] = code.split('\n');
        return (
          <div key={idx} className="code-block">
            <div className="code-header">
              <span className="code-language">{language || 'code'}</span>
              <button 
                className="code-copy" 
                onClick={() => {
                  navigator.clipboard.writeText(codeLines.join('\n'));
                }}
              >
                📋 Copy
              </button>
            </div>
            <pre><code>{codeLines.join('\n')}</code></pre>
          </div>
        );
      }
      
      // Inline code
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={idx} className="inline-code">
            {part.slice(1, -1)}
          </code>
        );
      }
      
      // Bold
      const boldParts = part.split(/\*\*([^*]+)\*\*/g);
      return boldParts.map((boldPart, boldIdx) => 
        boldIdx % 2 === 1 ? <strong key={`${idx}-${boldIdx}`}>{boldPart}</strong> : boldPart
      );
    });
  };

  const displayName = isUser && userName ? formatSymbolicName(userName) : null;

  return (
    <div className={`message ${isUser ? 'user-message' : 'ai-message'} ${isError ? 'error' : ''}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className="message-wrapper">
        <div className="message-content">
          {isUser && displayName && (
            <div className="user-sender-badge">
              <span className="badge-icon">👤</span>
              <span className="badge-label symbolic-name">{displayName}</span>
            </div>
          )}
          {!isUser && (
            <div className="ai-sender-badge">
              <span className="badge-icon">🤖</span>
              <span className="badge-label">CredAI</span>
            </div>
          )}
          <div className="message-text" dangerouslySetInnerHTML={{ __html: formatText(message.text) }} />
          <div className="message-footer">
            <span className="message-time">{formatTime(message.timestamp)}</span>
            {!isUser && !isError && (
              <div className="message-actions">
                <button 
                  className="action-btn" 
                  onClick={handleCopy}
                  title="Copy message"
                >
                  {copied ? '✅' : '📋'}
                </button>
                {onRegenerate && (
                  <button 
                    className="action-btn" 
                    onClick={onRegenerate}
                    title="Regenerate response"
                  >
                    🔄
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {!isUser && !isError && (
          <div className="message-reactions">
            {['👍', '👎', '❤️', '🎯'].map(emoji => (
              <button
                key={emoji}
                className={`reaction-btn ${reaction === emoji ? 'active' : ''}`}
                onClick={() => handleReact(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CredAIMessage;
