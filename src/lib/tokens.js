import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  updateDoc,
  doc,
  increment
} from 'firebase/firestore';

// Token types
export const TOKEN_TYPES = {
  SIGNAL: 'signal',
  BREADCRUMB: 'breadcrumb',
  CONTRIBUTION: 'contribution',
  ENGAGEMENT: 'engagement',
  REPUTATION: 'reputation'
};

// Token transaction reasons
export const TOKEN_REASONS = {
  POST_CREATED: 'post_created',
  COMMENT_ADDED: 'comment_added',
  HELPFUL_CONTENT: 'helpful_content',
  QUALITY_INTERACTION: 'quality_interaction',
  DAILY_ACTIVE: 'daily_active',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  REFERRED_USER: 'referred_user',
  VOTED_UP: 'voted_up',
  VOTED_DOWN: 'voted_down',
  REWARD: 'reward',
  PENALTY: 'penalty',
  PURCHASE: 'purchase',
  TRANSFER: 'transfer'
};

// Token rewards configuration
export const TOKEN_REWARDS = {
  [TOKEN_REASONS.POST_CREATED]: 10,
  [TOKEN_REASONS.COMMENT_ADDED]: 5,
  [TOKEN_REASONS.HELPFUL_CONTENT]: 25,
  [TOKEN_REASONS.QUALITY_INTERACTION]: 15,
  [TOKEN_REASONS.DAILY_ACTIVE]: 5,
  [TOKEN_REASONS.ACHIEVEMENT_UNLOCKED]: 50,
  [TOKEN_REASONS.REFERRED_USER]: 100,
  [TOKEN_REASONS.VOTED_UP]: 3,
  [TOKEN_REASONS.VOTED_DOWN]: -2
};

// Award tokens to a user
export const awardTokens = async (userId, amount, type, reason, metadata = {}) => {
  try {
    const transaction = {
      userId,
      amount,
      type,
      reason,
      metadata,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    // Add transaction record
    const txRef = await addDoc(collection(db, 'tokenTransactions'), transaction);

    // Update user's token balance
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      [`tokens.${type}`]: increment(amount),
      'tokens.total': increment(amount),
      'tokens.lastUpdated': new Date().toISOString()
    });

    return {
      success: true,
      transactionId: txRef.id,
      newBalance: await getUserTokenBalance(userId)
    };
  } catch (error) {
    console.error('Error awarding tokens:', error);
    throw error;
  }
};

// Get user token balance
export const getUserTokenBalance = async (userId) => {
  try {
    // In real implementation, fetch from Firestore
    // For now, return mock data
    return {
      signal: 150,
      breadcrumb: 85,
      contribution: 200,
      engagement: 120,
      reputation: 300,
      total: 855
    };
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return {
      signal: 0,
      breadcrumb: 0,
      contribution: 0,
      engagement: 0,
      reputation: 0,
      total: 0
    };
  }
};

// Get user token transactions
export const getUserTokenHistory = async (userId, limit = 20) => {
  try {
    // Mock transaction history
    const mockTransactions = [
      {
        id: '1',
        type: TOKEN_TYPES.SIGNAL,
        amount: 10,
        reason: TOKEN_REASONS.POST_CREATED,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        description: 'Created a new post'
      },
      {
        id: '2',
        type: TOKEN_TYPES.CONTRIBUTION,
        amount: 25,
        reason: TOKEN_REASONS.HELPFUL_CONTENT,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        description: 'Shared helpful content'
      },
      {
        id: '3',
        type: TOKEN_TYPES.ENGAGEMENT,
        amount: 15,
        reason: TOKEN_REASONS.QUALITY_INTERACTION,
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        description: 'Quality interaction with community'
      },
      {
        id: '4',
        type: TOKEN_TYPES.BREADCRUMB,
        amount: 5,
        reason: TOKEN_REASONS.DAILY_ACTIVE,
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        description: 'Daily login reward'
      },
      {
        id: '5',
        type: TOKEN_TYPES.REPUTATION,
        amount: 50,
        reason: TOKEN_REASONS.ACHIEVEMENT_UNLOCKED,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        description: 'Unlocked "Community Builder" achievement'
      }
    ];

    return mockTransactions;
  } catch (error) {
    console.error('Error fetching token history:', error);
    return [];
  }
};

// Calculate token multiplier based on user reputation
export const calculateTokenMultiplier = (reputationScore) => {
  if (reputationScore >= 1000) return 2.0;
  if (reputationScore >= 500) return 1.5;
  if (reputationScore >= 250) return 1.25;
  if (reputationScore >= 100) return 1.1;
  return 1.0;
};

// Validate token transfer
export const canTransferTokens = (fromBalance, amount, tokenType) => {
  if (amount <= 0) return { valid: false, reason: 'Amount must be positive' };
  if (!fromBalance[tokenType] || fromBalance[tokenType] < amount) {
    return { valid: false, reason: 'Insufficient balance' };
  }
  return { valid: true };
};

// Transfer tokens between users
export const transferTokens = async (fromUserId, toUserId, amount, tokenType, message = '') => {
  try {
    const fromBalance = await getUserTokenBalance(fromUserId);
    const validation = canTransferTokens(fromBalance, amount, tokenType);

    if (!validation.valid) {
      throw new Error(validation.reason);
    }

    // Deduct from sender
    await awardTokens(fromUserId, -amount, tokenType, TOKEN_REASONS.TRANSFER, {
      to: toUserId,
      message
    });

    // Add to receiver
    await awardTokens(toUserId, amount, tokenType, TOKEN_REASONS.TRANSFER, {
      from: fromUserId,
      message
    });

    return { success: true, message: 'Transfer completed successfully' };
  } catch (error) {
    console.error('Error transferring tokens:', error);
    throw error;
  }
};

// Get token leaderboard
export const getTokenLeaderboard = async (tokenType = 'total', limit = 10) => {
  try {
    // Mock leaderboard data
    const mockLeaderboard = [
      { userId: 'user1', username: '§(Pioneer)', tokens: 2500, rank: 1 },
      { userId: 'user2', username: '§(Builder)', tokens: 2100, rank: 2 },
      { userId: 'user3', username: '§(Sage)', tokens: 1800, rank: 3 },
      { userId: 'user4', username: '§(Guide)', tokens: 1600, rank: 4 },
      { userId: 'user5', username: '§(Creator)', tokens: 1400, rank: 5 }
    ];

    return mockLeaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

// Calculate daily token earnings
export const calculateDailyEarnings = (transactions) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.timestamp);
    return txDate >= today && tx.amount > 0;
  });

  return todayTransactions.reduce((sum, tx) => sum + tx.amount, 0);
};

// Get token statistics
export const getTokenStats = async (userId) => {
  const balance = await getUserTokenBalance(userId);
  const history = await getUserTokenHistory(userId, 100);
  const dailyEarnings = calculateDailyEarnings(history);

  const totalEarned = history
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalSpent = history
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  return {
    balance,
    totalEarned,
    totalSpent,
    dailyEarnings,
    transactionCount: history.length,
    averageTransaction: history.length > 0 ? totalEarned / history.length : 0
  };
};
