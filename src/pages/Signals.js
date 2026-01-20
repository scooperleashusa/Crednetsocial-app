import React from 'react';
import SignalsFeed from '../identity/SignalsFeed';
import '../styles/identity.css';

const Signals = () => {
  return (
    <div className="signals-page">
      <div className="signals-header">
        <h2>Signals Feed</h2>
        <p>Track meaningful interactions and contributions</p>
      </div>
      <SignalsFeed />
    </div>
  );
};

export default Signals;
