import React, { useState } from 'react';
import GameRoomChat from '../game/GameRoomChat';
import GameRoomSidebar from '../game/GameRoomSidebar';
import { awardTokens, getUserTokenBalance } from '../lib/tokens';
import '../styles/game.css';

const GameRoom = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState({
    current: { id: 'user123', name: 'You', tokens: 450, reputation: 'chrome' },
    active: [
      { id: 'user1', name: 'Alex Chen', tokens: 1250, reputation: 'gold' },
      { id: 'user2', name: 'Jordan Lee', tokens: 890, reputation: 'diamond' },
      { id: 'user3', name: 'Sam Taylor', tokens: 420, reputation: 'chrome' }
    ]
  });

  const handleMessageSent = (text) => {
    // Award tokens for posting
    setUsers(prev => ({
      ...prev,
      current: {
        ...prev.current,
        tokens: prev.current.tokens + 10 // Base reward for posting
      }
    }));
  };

  const handleTokenTip = (amount, targetUserId) => {
    setUsers(prev => {
      const newUsers = { ...prev };
      if (newUsers.current.tokens >= amount) {
        newUsers.current.tokens -= amount;
        const targetUser = newUsers.active.find(u => u.id === targetUserId);
        if (targetUser) targetUser.tokens += amount;
      }
      return newUsers;
    });
  };

  return (
    <div className="gameroom-page">
      <div className="gameroom-container">
        <GameRoomSidebar users={users} currentUser={users.current} />
        <GameRoomChat 
          messages={messages}
          setMessages={setMessages}
          currentUser={users.current}
          activeUsers={users.active}
          onMessageSent={handleMessageSent}
          onTokenTip={handleTokenTip}
        />
      </div>
    </div>
  );
};

export default GameRoom;
