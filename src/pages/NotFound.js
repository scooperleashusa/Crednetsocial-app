import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const navigationOptions = [
    { label: '🏠 Home', path: '/' },
    { label: '🤖 CredAI', path: '/cred-ai' },
    { label: '🎮 Game Room', path: '/game-room' },
    { label: '👤 Profile', path: '/profile' },
    { label: '🪙 Tokens', path: '/tokens' }
  ];

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f3460 100%)',
      padding: '20px',
    },
    content: {
      maxWidth: '600px',
      textAlign: 'center',
      animation: 'fadeInUp 0.8s ease-out',
    },
    errorCode: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '40px',
      fontSize: '100px',
      fontWeight: 900,
      fontFamily: "'Courier New', monospace",
    },
    digit: {
      color: '#4a9eff',
      textShadow: '0 0 20px rgba(74, 158, 255, 0.6)',
      animation: 'pulse 2s ease-in-out infinite',
    },
    circle: {
      fontSize: '80px',
      animation: 'rotate 3s linear infinite',
    },
    errorMessage: {
      marginBottom: '40px',
    },
    title: {
      fontSize: '2.5rem',
      color: '#e0e0e0',
      margin: '0 0 15px 0',
      fontWeight: 700,
      letterSpacing: '1px',
    },
    description: {
      fontSize: '1.1rem',
      color: '#888',
      margin: 0,
      lineHeight: 1.6,
      fontStyle: 'italic',
    },
    navGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
      gap: '12px',
      margin: '40px 0 35px 0',
    },
    navCard: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'linear-gradient(135deg, rgba(74, 158, 255, 0.1) 0%, rgba(58, 142, 239, 0.05) 100%)',
      border: '2px solid rgba(74, 158, 255, 0.3)',
      borderRadius: '10px',
      color: '#4a9eff',
      textDecoration: 'none',
      fontWeight: 600,
      fontSize: '0.9rem',
      cursor: 'pointer',
      textAlign: 'center',
      lineHeight: 1.3,
      transition: 'all 0.3s ease',
    },
    buttons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginBottom: '30px',
      flexWrap: 'wrap',
    },
    btn: {
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: 600,
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      letterSpacing: '0.5px',
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #4a9eff 0%, #3a8eef 100%)',
      color: '#fff',
    },
    btnSecondary: {
      background: 'rgba(74, 158, 255, 0.1)',
      color: '#4a9eff',
      border: '2px solid #4a9eff',
    },
    funMessage: {
      marginTop: '30px',
      padding: '16px',
      background: 'rgba(212, 175, 55, 0.1)',
      borderLeft: '3px solid #d4af37',
      borderRadius: '6px',
    },
    funText: {
      color: '#d4af37',
      margin: 0,
      fontSize: '0.95rem',
      lineHeight: 1.5,
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .nav-card-hover:hover {
          background: linear-gradient(135deg, rgba(74, 158, 255, 0.2) 0%, rgba(58, 142, 239, 0.1) 100%) !important;
          border-color: rgba(74, 158, 255, 0.6) !important;
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(74, 158, 255, 0.3);
        }
        .btn-primary-hover:hover {
          background: linear-gradient(135deg, #5aa9ff 0%, #4a9eff 100%) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(74, 158, 255, 0.4);
        }
        .btn-secondary-hover:hover {
          background: rgba(74, 158, 255, 0.15) !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(74, 158, 255, 0.25);
        }
      `}</style>
      <div style={styles.content}>
        {/* Animated 404 */}
        <div style={styles.errorCode}>
          <span style={styles.digit}>4</span>
          <span style={styles.circle}>⭕</span>
          <span style={styles.digit}>4</span>
        </div>

        {/* Error Message */}
        <div style={styles.errorMessage}>
          <h1 style={styles.title}>Page Not Found</h1>
          <p style={styles.description}>
            The page you're looking for seems to have wandered off into the digital void.
          </p>
        </div>

        {/* Navigation Options */}
        <div style={styles.navGrid}>
          {navigationOptions.map((option) => (
            <Link
              key={option.path}
              to={option.path}
              className="nav-card-hover"
              style={styles.navCard}
            >
              <span>{option.label}</span>
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={styles.buttons}>
          <button
            className="btn-primary-hover"
            style={{ ...styles.btn, ...styles.btnPrimary }}
            onClick={handleGoBack}
            title="Go back to previous page"
          >
            ← Go Back
          </button>
          <Link
            to="/"
            className="btn-secondary-hover"
            style={{ ...styles.btn, ...styles.btnSecondary }}
          >
            🏠 Go Home
          </Link>
        </div>

        {/* Fun Message */}
        <div style={styles.funMessage}>
          <p style={styles.funText}>
            💡 <em>Pro tip: This isn't a real error. You just took a wrong turn!</em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
