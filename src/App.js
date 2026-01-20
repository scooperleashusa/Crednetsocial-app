import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './layout/Header';
import Navigation from './layout/Navigation';
import Footer from './layout/Footer';
import './styles/globals.css';

// Lazy load page components for code splitting
const Home = lazy(() => import('./pages/Home'));
const CredAI = lazy(() => import('./pages/CredAI'));
const GameRoom = lazy(() => import('./pages/GameRoom'));
const Profile = lazy(() => import('./pages/Profile'));
const Signals = lazy(() => import('./pages/Signals'));
const Tokens = lazy(() => import('./pages/Tokens'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '400px',
    fontSize: '18px',
    color: '#666'
  }}>
    Loading...
  </div>
);

const App = () => {
  return (
    <Router>
      <div className="app-shell">
        <Header />
        <Navigation />
        <main className="app-main">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cred-ai" element={<CredAI />} />
              <Route path="/game-room" element={<GameRoom />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/signals" element={<Signals />} />
              <Route path="/tokens" element={<Tokens />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
