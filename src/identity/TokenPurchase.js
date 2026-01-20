import React, { useState, useEffect } from 'react';
import { 
  connectMetaMask, 
  connectPhantom, 
  getAvailableWallets, 
  formatAddress,
  disconnectWallet 
} from '../lib/wallet';
import { TOKEN_PACKAGES, getPriceForMethod, calculatePackageTotal } from '../lib/tokenPricing';

const TokenPurchase = ({ currentUser, onPurchaseComplete }) => {
  const [selectedPackage, setSelectedPackage] = useState('pro');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [walletConnected, setWalletConnected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [purchaseStep, setPurchaseStep] = useState('select'); // select, payment, confirm
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [availableWallets, setAvailableWallets] = useState([]);

  useEffect(() => {
    setAvailableWallets(getAvailableWallets());
  }, []);

  const pkg = TOKEN_PACKAGES.find(p => p.id === selectedPackage);
  const totalTokens = calculatePackageTotal(pkg);
  const priceInfo = getPriceForMethod(pkg, paymentMethod);
  let finalPrice = priceInfo.amount;
  
  if (promoDiscount > 0) {
    finalPrice = priceInfo.amount * (1 - promoDiscount);
  }

  const connectWallet = async (walletType) => {
    setLoading(true);
    setError(null);
    
    try {
      let account;
      if (walletType === 'metamask') {
        account = await connectMetaMask();
      } else if (walletType === 'phantom') {
        account = await connectPhantom();
      }
      
      setWalletConnected(account);
      setPaymentMethod('crypto');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const disconnectCurrentWallet = async () => {
    if (walletConnected) {
      await disconnectWallet(walletConnected.walletType);
      setWalletConnected(null);
      setPaymentMethod('credit_card');
    }
  };

  const applyPromoCode = () => {
    if (promoCode === 'WELCOME20') {
      setPromoDiscount(0.20);
      setError(null);
    } else if (promoCode === 'CRYPTO5' && paymentMethod === 'crypto') {
      setPromoDiscount(0.05);
      setError(null);
    } else if (promoCode === 'REFER10') {
      setPromoDiscount(0.10);
      setError(null);
    } else {
      setError('Invalid promo code');
      setPromoDiscount(0);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate payment processing
      setTimeout(() => {
        setPurchaseStep('confirm');
        setSuccess(true);
        
        if (onPurchaseComplete) {
          onPurchaseComplete({
            packageId: selectedPackage,
            tokens: totalTokens,
            price: finalPrice,
            method: paymentMethod,
            promoCode: promoCode || null
          });
        }
        
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const resetPurchase = () => {
    setPurchaseStep('select');
    setSuccess(false);
    setError(null);
  };

  if (success) {
    return (
      <div className="purchase-confirmation">
        <div className="confirmation-card">
          <div className="confirmation-icon">✅</div>
          <h2>Purchase Successful!</h2>
          <div className="confirmation-details">
            <p className="detail-item">
              <span className="label">Tokens Received:</span>
              <span className="value tokens">{totalTokens} 🪙</span>
            </p>
            <p className="detail-item">
              <span className="label">Amount Paid:</span>
              <span className="value">${finalPrice.toFixed(2)}</span>
            </p>
            <p className="detail-item">
              <span className="label">Transaction ID:</span>
              <span className="value">{`TXN-${Date.now().toString().slice(-8)}`}</span>
            </p>
          </div>
          <button className="btn-primary" onClick={resetPurchase}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="token-purchase">
      <div className="purchase-header">
        <h2>🪙 Buy Tokens</h2>
        <p>Select tokens and payment method</p>
      </div>

      {/* Step 1: Select Package */}
      {purchaseStep === 'select' && (
        <div className="purchase-content">
          <div className="packages-grid">
            {TOKEN_PACKAGES.map(pkg => (
              <div 
                key={pkg.id}
                className={`package-card ${selectedPackage === pkg.id ? 'selected' : ''} ${pkg.popular ? 'popular' : ''}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.badge && <span className="badge">{pkg.badge}</span>}
                <div className="package-icon">{pkg.icon}</div>
                <h3>{pkg.name}</h3>
                <div className="package-tokens">
                  <span className="amount">{pkg.tokens}</span>
                  <span className="unit">tokens</span>
                </div>
                {pkg.bonusTokens && (
                  <div className="bonus-badge">
                    +{pkg.bonusTokens} bonus (${(pkg.bonusTokens * 0.01).toFixed(2)})
                  </div>
                )}
                <div className="package-price">
                  ${pkg.price}
                </div>
                <p className="description">{pkg.description}</p>
                <div className="value-metric">
                  ${(pkg.price / (pkg.tokens + (pkg.bonusTokens || 0))).toFixed(4)}/token
                </div>
              </div>
            ))}
          </div>

          <div className="payment-methods">
            <h3>Payment Method</h3>
            <div className="methods-grid">
              <button
                className={`method-btn ${paymentMethod === 'credit_card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('credit_card')}
              >
                <span className="icon">💳</span>
                <span className="name">Credit Card</span>
                <span className="fee">2.9% fee</span>
              </button>
              <button
                className={`method-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('paypal')}
              >
                <span className="icon">🅿️</span>
                <span className="name">PayPal</span>
                <span className="fee">3.4% fee</span>
              </button>
              <button
                className={`method-btn ${paymentMethod === 'crypto' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('crypto')}
              >
                <span className="icon">🔐</span>
                <span className="name">Crypto</span>
                <span className="fee">1% fee</span>
              </button>
            </div>
          </div>

          {paymentMethod === 'crypto' && !walletConnected && (
            <div className="wallet-selection">
              <h3>Connect Wallet</h3>
              <div className="wallets-grid">
                {availableWallets.map(wallet => (
                  <button
                    key={wallet.type}
                    className={`wallet-btn ${wallet.supported ? 'supported' : 'coming-soon'}`}
                    onClick={() => wallet.supported && connectWallet(wallet.type)}
                    disabled={!wallet.supported || loading}
                  >
                    <span className="icon">{wallet.icon}</span>
                    <span className="name">{wallet.name}</span>
                    {!wallet.supported && <span className="badge">Coming Soon</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {walletConnected && (
            <div className="wallet-info">
              <div className="wallet-connected">
                <span className="label">Connected:</span>
                <span className="address">{formatAddress(walletConnected.address)}</span>
                <button 
                  className="btn-disconnect"
                  onClick={disconnectCurrentWallet}
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}

          <div className="promo-section">
            <h3>Promo Code</h3>
            <div className="promo-input">
              <input
                type="text"
                placeholder="Enter promo code (WELCOME20)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              />
              <button 
                className="btn-apply"
                onClick={applyPromoCode}
                disabled={!promoCode || loading}
              >
                Apply
              </button>
            </div>
            {promoDiscount > 0 && (
              <div className="promo-success">
                ✓ {Math.round(promoDiscount * 100)}% discount applied!
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              <div className="summary-item">
                <span>{pkg.name}</span>
                <span>${priceInfo.amount.toFixed(2)}</span>
              </div>
              {pkg.bonusTokens && (
                <div className="summary-item bonus">
                  <span>Bonus Tokens</span>
                  <span>Free</span>
                </div>
              )}
              {promoDiscount > 0 && (
                <div className="summary-item discount">
                  <span>Discount ({Math.round(promoDiscount * 100)}%)</span>
                  <span>-${(priceInfo.amount * promoDiscount).toFixed(2)}</span>
                </div>
              )}
              <div className="summary-total">
                <span>Total</span>
                <span>${finalPrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="tokens-info">
              You will receive <strong>{totalTokens} tokens</strong>
            </div>
          </div>

          <button
            className="btn-purchase"
            onClick={() => {
              if (paymentMethod === 'crypto' && !walletConnected) {
                setError('Please connect a wallet');
                return;
              }
              setPurchaseStep('payment');
            }}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Continue to Payment'}
          </button>
        </div>
      )}

      {/* Step 2: Payment Confirmation */}
      {purchaseStep === 'payment' && (
        <div className="purchase-content">
          <div className="payment-confirm">
            <div className="confirm-details">
              <p>Package: <strong>{pkg.name}</strong></p>
              <p>Tokens: <strong>{totalTokens} 🪙</strong></p>
              <p>Amount: <strong>${finalPrice.toFixed(2)}</strong></p>
              <p>Method: <strong>{paymentMethod === 'crypto' ? '🔐 Crypto' : '💳 Card'}</strong></p>
              {walletConnected && <p>Wallet: <strong>{formatAddress(walletConnected.address)}</strong></p>}
            </div>
          </div>

          <div className="payment-actions">
            <button
              className="btn-secondary"
              onClick={() => setPurchaseStep('select')}
              disabled={loading}
            >
              Back
            </button>
            <button
              className="btn-primary"
              onClick={handlePurchase}
              disabled={loading}
            >
              {loading ? 'Processing Payment...' : 'Complete Purchase'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenPurchase;
