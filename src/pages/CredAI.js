import React, { useState } from 'react';
import CredAIChat from '../credai/CredAIChat';
import CredAISidebar from '../credai/CredAISidebar';
import '../styles/credai.css';

const CredAI = () => {
  const [currentConversation, setCurrentConversation] = useState(null);

  const handleNewConversation = () => {
    const newId = `conv_${Date.now()}`;
    setCurrentConversation(newId);
  };

  const handleSelectConversation = (id) => {
    setCurrentConversation(id);
  };

  return (
    <div className="credai-page">
      <div className="credai-container">
        <CredAISidebar 
          currentConversation={currentConversation}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
        />
        <CredAIChat 
          conversationId={currentConversation}
          onNewConversation={handleNewConversation}
        />
      </div>
    </div>
  );
};

export default CredAI;
