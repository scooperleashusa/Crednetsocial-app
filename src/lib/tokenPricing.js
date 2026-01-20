// Token Purchase Packages & Pricing

export const TOKEN_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Pack',
    tokens: 100,
    price: 9.99,
    usdPrice: 9.99,
    ethPrice: 0.005,
    discount: 0,
    icon: '🌱',
    popular: false,
    description: 'Perfect for getting started'
  },
  {
    id: 'growth',
    name: 'Growth Pack',
    tokens: 500,
    price: 39.99,
    usdPrice: 39.99,
    ethPrice: 0.025,
    discount: 0.2, // 20% bonus
    icon: '📈',
    popular: false,
    description: 'Save 20% with bonus tokens',
    bonusTokens: 100
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    tokens: 1200,
    price: 79.99,
    usdPrice: 79.99,
    ethPrice: 0.04,
    discount: 0.35, // 35% bonus
    icon: '⚡',
    popular: true,
    description: 'Most popular - Save 35%',
    bonusTokens: 420,
    badge: 'POPULAR'
  },
  {
    id: 'elite',
    name: 'Elite Pack',
    tokens: 2500,
    price: 149.99,
    usdPrice: 149.99,
    ethPrice: 0.08,
    discount: 0.5, // 50% bonus
    icon: '👑',
    popular: false,
    description: 'Ultimate value - Save 50%',
    bonusTokens: 1250,
    badge: 'BEST VALUE'
  }
];

// Payment methods config
export const PAYMENT_CONFIG = {
  STRIPE: {
    name: 'Credit/Debit Card',
    icon: '💳',
    processingFee: 0.029, // 2.9%
    methods: ['visa', 'mastercard', 'amex']
  },
  PAYPAL: {
    name: 'PayPal',
    icon: '🅿️',
    processingFee: 0.034, // 3.4%
  },
  CRYPTO: {
    name: 'Crypto Wallet',
    icon: '🔐',
    processingFee: 0.01, // 1%
    chains: ['ethereum', 'polygon', 'arbitrum'],
    supportedTokens: ['ETH', 'MATIC', 'USDC']
  }
};

// Calculate total with bonus
export const calculatePackageTotal = (pkg) => {
  const bonusTokens = Math.floor(pkg.tokens * pkg.discount);
  return pkg.tokens + bonusTokens;
};

// Find package by ID
export const getPackageById = (id) => {
  return TOKEN_PACKAGES.find(pkg => pkg.id === id);
};

// Get price for selected method
export const getPriceForMethod = (pkg, method) => {
  if (method === 'crypto') {
    return {
      amount: pkg.ethPrice,
      currency: 'ETH',
      fiat: pkg.usdPrice
    };
  } else if (method === 'credit_card' || method === 'paypal') {
    return {
      amount: pkg.price,
      currency: 'USD',
      fiat: pkg.price
    };
  }
  return { amount: pkg.price, currency: 'USD' };
};

// Calculate discount percentage
export const getDiscountPercentage = (pkg) => {
  return Math.round(pkg.discount * 100);
};

// Get value per token
export const getValuePerToken = (pkg) => {
  const total = calculatePackageTotal(pkg);
  return (pkg.price / total).toFixed(4);
};

// Transaction fee calculator
export const calculateTransactionFee = (amount, method) => {
  const config = {
    credit_card: 0.029,
    paypal: 0.034,
    crypto: 0.01
  };
  
  const feeRate = config[method] || 0;
  return amount * feeRate;
};

// Total cost with fees
export const getTotalWithFees = (amount, method) => {
  const fee = calculateTransactionFee(amount, method);
  return amount + fee;
};

// Promotional codes
export const PROMO_CODES = {
  WELCOME20: {
    code: 'WELCOME20',
    discount: 0.20,
    maxUses: 1000,
    expiresAt: new Date('2026-12-31'),
    description: '20% off first purchase'
  },
  REFER10: {
    code: 'REFER10',
    discount: 0.10,
    maxUses: 5000,
    description: '10% off referral code'
  },
  CRYPTO5: {
    code: 'CRYPTO5',
    discount: 0.05,
    maxUses: 10000,
    restrictedTo: ['crypto'],
    description: '5% off crypto purchases'
  }
};

// Validate promo code
export const validatePromoCode = (code) => {
  const promo = PROMO_CODES[code.toUpperCase()];
  
  if (!promo) {
    return { valid: false, error: 'Invalid promo code' };
  }
  
  if (promo.expiresAt && new Date() > promo.expiresAt) {
    return { valid: false, error: 'Promo code expired' };
  }
  
  return { valid: true, discount: promo.discount, promo };
};

// Calculate with promo
export const applyPromoCode = (amount, code) => {
  const validation = validatePromoCode(code);
  
  if (!validation.valid) {
    return { amount, discount: 0, error: validation.error };
  }
  
  const discount = amount * validation.discount;
  return {
    originalAmount: amount,
    discount,
    finalAmount: amount - discount,
    promoCode: code
  };
};
