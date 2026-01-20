import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="app-nav">
      <ul className="nav-list">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/signals">Signals</Link></li>
        <li><Link to="/tokens">🪙 Tokens</Link></li>
        <li><Link to="/cred-ai">Cred AI</Link></li>
        <li><Link to="/game-room">Game Room</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
