import React from 'react';
import SymbolicName from '../identity/SymbolicName';
import BreadcrumbScore from '../identity/BreadcrumbScore';

const Home = () => {
  return (
    <section className="home-page">
      <div className="hero">
        <h2>Welcome to CredNetSocial</h2>
        <p>Quiet, symbolic social built around your §(name) and real signals.</p>
      </div>
      <div className="identity-preview">
        <SymbolicName name="YourName" />
        <BreadcrumbScore score={0} />
      </div>
      <div className="features">
        <div className="feature-card">
          <h3>Real Signals</h3>
          <p>Track meaningful interactions and contributions</p>
        </div>
        <div className="feature-card">
          <h3>Symbolic Identity</h3>
          <p>Express yourself through symbolic names</p>
        </div>
        <div className="feature-card">
          <h3>AI Conversations</h3>
          <p>Engage with AI-powered chat</p>
        </div>
      </div>
    </section>
  );
};

export default Home;
