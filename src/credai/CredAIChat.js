import React, { useState, useEffect, useRef } from 'react';
import CredAIMessage from './CredAIMessage';
import CaesarBuilder from '../identity/CaesarBuilder';
import { sendAIMessage, getAIContext } from '../lib/ai';

const CredAIChat = ({ conversationId, onNewConversation }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showCaesarBuilder, setShowCaesarBuilder] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load conversation history
  useEffect(() => {
    if (conversationId) {
      // Load from localStorage or API
      const savedMessages = localStorage.getItem(`chat_${conversationId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  // Save messages to localStorage
  useEffect(() => {
    if (conversationId && messages.length > 0) {
      localStorage.setItem(`chat_${conversationId}`, JSON.stringify(messages));
    }
  }, [messages, conversationId]);

  // Check for Caesar builder trigger in user message
  const shouldShowCaesarBuilder = (text) => {
    const keywords = ['build caesar', 'create profile', 'build profile', 'help me build', 'create my identity', 'create caesar'];
    return keywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Check if user wants to build Caesar
    if (shouldShowCaesarBuilder(input)) {
      setShowCaesarBuilder(true);
      const userMessage = { 
        id: Date.now(),
        text: input, 
        sender: 'user', 
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      return;
    }

    const userMessage = { 
      id: Date.now(),
      text: input, 
      sender: 'user', 
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);
    setIsTyping(true);

    try {
      // Get conversation context
      const context = getAIContext(messages);
      const aiResponse = await sendAIMessage(input, context);
      
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1,
        ...aiResponse, 
        sender: 'ai',
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      setIsTyping(false);
      setError('Failed to get response. Please try again.');
      console.error('Error sending message:', error);
      
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: '⚠️ Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        error: true,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear this conversation?')) {
      setMessages([]);
      if (conversationId) {
        localStorage.removeItem(`chat_${conversationId}`);
      }
      onNewConversation?.();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="credai-chat ai-mode">
      <div className="chat-header ai-header">
        <div className="header-content">
          <div className="chat-mode-badge ai-badge">🤖 AI Assistant</div>
          <h3>CredAI</h3>
          <p className="chat-subtitle">Get personalized advice and build your Caesar profile</p>
        </div>
        <div className="chat-actions">
          <button 
            className="btn-icon" 
            onClick={handleClearChat}
            title="Clear chat"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <h4>👋 Welcome to CredAI</h4>
            <p>Ask me anything about CredNet Social, or let's have a conversation!</p>
            <div className="suggested-prompts">
              <button onClick={() => setInput('What is CredNet Social?')}>What is CredNet Social?</button>
              <button onClick={() => setInput('How do I earn signals?')}>How do I earn signals?</button>
              <button onClick={() => setInput('Tell me about symbolic names')}>Tell me about symbolic names</button>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <CredAIMessage 
              key={msg.id} 
              message={msg}
              userName={msg.sender === 'user' ? (msg.userName || currentUser?.symbolicName || 'User') : null}
              onRegenerate={msg.sender === 'ai' ? () => {
                // Remove last AI message and regenerate
                setMessages(prev => prev.filter(m => m.id !== msg.id));
                const lastUserMsg = messages.filter(m => m.sender === 'user').slice(-1)[0];
                if (lastUserMsg) {
                  setInput(lastUserMsg.text);
                  handleSend();
                }
              } : null}
            />
          ))
        )}
        
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="typing-text">CredAI is typing...</span>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {showCaesarBuilder && (
        <div className="caesar-builder-modal">
          <div className="modal-overlay" onClick={() => setShowCaesarBuilder(false)} />
          <div className="modal-content">
            <CaesarBuilder
              onComplete={(profile) => {
                // Add Caesar completion message
                const aiMessage = {
                  id: Date.now(),
                  text: `🎉 Congratulations! Your Caesar has been created:\n\n**${profile.tagline}**\n\n${profile.bio}\n\nYou've earned 50 starting tokens and have a Reputation score of 100. Ready to make your mark on CredNet!`,
                  sender: 'ai',
                  timestamp: new Date().toISOString(),
                  reactions: [],
                  type: 'caesar-complete',
                  profile
                };
                setMessages(prev => [...prev, aiMessage]);
                setShowCaesarBuilder(false);
              }}
              onCancel={() => setShowCaesarBuilder(false)}
            />
          </div>
        </div>
      )}
      
      <div className="chat-input">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask CredAI anything... Type 'help me build my caesar' to get started!"
          rows="1"
          disabled={loading}
        />
        <button 
          onClick={handleSend} 
          disabled={!input.trim() || loading}
          className="send-button"
        >
          {loading ? '⏳' : '📤'}
        </button>
      </div>
    </div>
  );
};

export default CredAIChat;
