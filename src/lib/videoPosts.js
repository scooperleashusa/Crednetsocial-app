// Video Post Management System

/**
 * Video Post Schema
 * {
 *   id: string,
 *   userId: string,
 *   username: string,
 *   videoUrl: string,
 *   title: string,
 *   description: string,
 *   createdAt: timestamp,
 *   expiresAt: timestamp,
 *   extendedAt: timestamp | null,
 *   isExtended: boolean,
 *   reposts: number,
 *   maxReposts: number,
 *   likes: number,
 *   comments: number,
 *   views: number,
 *   isPaid: boolean,
 *   status: 'active' | 'expired' | 'deleted',
 *   tokens: number (earned)
 * }
 */

// Calculate expiration time (24 hours from now)
export const calculateExpirationTime = () => {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
  return expiresAt;
};

// Get time remaining in milliseconds
export const getTimeRemaining = (expiresAt) => {
  const now = new Date();
  const remaining = expiresAt.getTime() - now.getTime();
  return remaining > 0 ? remaining : 0;
};

// Format remaining time display
export const formatTimeRemaining = (expiresAt) => {
  const remaining = getTimeRemaining(expiresAt);
  
  if (remaining <= 0) return 'Expired';
  
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }
  return `${minutes}m left`;
};

// Create new video post
export const createVideoPost = (userId, username, videoData) => {
  return {
    id: `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    username,
    videoUrl: videoData.url,
    title: videoData.title,
    description: videoData.description,
    createdAt: new Date(),
    expiresAt: calculateExpirationTime(),
    extendedAt: null,
    isExtended: false,
    reposts: 0,
    maxReposts: 10,
    likes: 0,
    comments: 0,
    views: 0,
    isPaid: false,
    status: 'active',
    tokens: 10, // Earn 10 tokens for posting a video
  };
};

// Extend video post for another 24 hours (costs $0.99)
export const extendVideoPost = (post) => {
  if (post.isExtended) {
    return { success: false, error: 'Post already extended' };
  }
  
  if (post.reposts >= post.maxReposts) {
    return { success: false, error: 'Maximum repost limit reached' };
  }
  
  const extendedPost = {
    ...post,
    expiresAt: new Date(post.expiresAt.getTime() + 24 * 60 * 60 * 1000),
    extendedAt: new Date(),
    isExtended: true,
    isPaid: true,
  };
  
  return { success: true, post: extendedPost };
};

// Check if post is expired
export const isPostExpired = (post) => {
  return post.status === 'expired' || new Date() > post.expiresAt;
};

// Increment reposts counter
export const incrementReposts = (post) => {
  if (post.reposts >= post.maxReposts) {
    return { success: false, error: 'Maximum repost limit reached' };
  }
  
  return {
    success: true,
    post: {
      ...post,
      reposts: post.reposts + 1,
    },
  };
};

// Get video post status with time
export const getVideoPostStatus = (post) => {
  if (isPostExpired(post)) {
    return {
      status: 'expired',
      display: '⏰ Expired',
      color: '#ff6b6b',
      canExtend: !post.isExtended,
    };
  }
  
  const timeRemaining = getTimeRemaining(post.expiresAt);
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  
  if (hours < 1) {
    return {
      status: 'expiring-soon',
      display: '⚠️ ' + formatTimeRemaining(post.expiresAt),
      color: '#ffa500',
      canExtend: !post.isExtended,
    };
  }
  
  return {
    status: 'active',
    display: '✅ ' + formatTimeRemaining(post.expiresAt),
    color: '#51cf66',
    canExtend: !post.isExtended,
  };
};

// Calculate video worth/value
export const calculateVideoValue = (post) => {
  return {
    baseValue: 10,
    likes: post.likes * 0.5,
    views: Math.floor(post.views / 100) * 0.1,
    reposts: post.reposts * 2,
    totalValue: 10 + (post.likes * 0.5) + (Math.floor(post.views / 100) * 0.1) + (post.reposts * 2),
  };
};

// Auto-delete check (for use with scheduled tasks)
export const checkAndMarkExpired = (posts) => {
  return posts.map(post => {
    if (isPostExpired(post) && post.status === 'active') {
      return {
        ...post,
        status: 'expired',
      };
    }
    return post;
  });
};

// Get posts by status
export const getPostsByStatus = (posts, status = 'active') => {
  return posts.filter(post => post.status === status);
};

// Get user's video posts
export const getUserVideoPosts = (posts, userId) => {
  return posts.filter(post => post.userId === userId);
};

// Calculate total engagement
export const calculatePostEngagement = (post) => {
  return {
    totalEngagement: post.likes + post.comments + post.reposts,
    engagementRate: ((post.likes + post.comments + post.reposts) / (post.views || 1)) * 100,
  };
};

// Fee structure for extensions
export const extensionFee = 0.99; // $0.99 per 24-hour extension
export const extensionDuration = 24 * 60 * 60 * 1000; // 24 hours in ms

// Token rewards for video activities
export const videoTokenRewards = {
  post: 10,
  like: 0.5,
  comment: 2,
  repost: 5,
  view: 0.1,
  extension: -10, // Cost in tokens to extend
};
