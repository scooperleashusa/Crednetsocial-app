import React, { useState, useEffect } from 'react';
import {
  getVideoPostStatus,
  getTimeRemaining,
  incrementReposts,
  isPostExpired,
  extensionFee,
} from '../lib/videoPosts';

const VideoPost = ({ post, currentUser, onExtend, onRepost, onDelete }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showExtendOptions, setShowExtendOptions] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  // Update time remaining every minute
  useEffect(() => {
    const updateTime = () => {
      setTimeRemaining(getTimeRemaining(post.expiresAt));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [post.expiresAt]);

  const status = getVideoPostStatus(post);
  const isOwner = currentUser.id === post.userId;
  const canRepost = post.reposts < post.maxReposts;

  const handleExtend = () => {
    if (onExtend) {
      onExtend(post);
      setShowExtendOptions(false);
    }
  };

  const handleRepost = () => {
    if (canRepost && onRepost) {
      onRepost(post);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleDelete = () => {
    if (isOwner && onDelete) {
      onDelete(post);
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(255, 112, 67, 0.05) 0%, rgba(230, 74, 25, 0.02) 100%)',
        border: `2px solid ${status.color}`,
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '15px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 15px',
          borderBottom: '1px solid rgba(255, 112, 67, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 112, 67, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff7043, #e64a19)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
            }}
          >
            {post.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ color: '#e0e0e0', fontWeight: 600, fontSize: '0.9rem' }}>
              {post.username}
            </div>
            <div style={{ color: '#888', fontSize: '0.75rem' }}>
              📹 Video Post
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div
          style={{
            padding: '6px 12px',
            background: `${status.color}33`,
            border: `1px solid ${status.color}`,
            borderRadius: '6px',
            color: status.color,
            fontSize: '0.8rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {status.display}
        </div>
      </div>

      {/* Video Container */}
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <video
          src={post.videoUrl}
          controls
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
        {isPostExpired(post) && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff6b6b',
              fontSize: '1.5rem',
              fontWeight: 700,
              cursor: 'not-allowed',
            }}
          >
            ⏰ EXPIRED
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div style={{ padding: '15px' }}>
        <h3
          style={{
            color: '#e0e0e0',
            margin: '0 0 8px 0',
            fontSize: '1.1rem',
            fontWeight: 600,
          }}
        >
          {post.title}
        </h3>
        {post.description && (
          <p
            style={{
              color: '#aaa',
              margin: 0,
              fontSize: '0.9rem',
              lineHeight: 1.5,
            }}
          >
            {post.description}
          </p>
        )}
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          padding: '12px 15px',
          borderTop: '1px solid rgba(255, 112, 67, 0.1)',
          borderBottom: '1px solid rgba(255, 112, 67, 0.1)',
          background: 'rgba(255, 112, 67, 0.02)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#ff9999', fontSize: '0.8rem', fontWeight: 600 }}>
            👁️ Views
          </div>
          <div style={{ color: '#e0e0e0', fontSize: '1rem', fontWeight: 700 }}>
            {post.views}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#ff9999', fontSize: '0.8rem', fontWeight: 600 }}>
            ❤️ Likes
          </div>
          <div style={{ color: '#e0e0e0', fontSize: '1rem', fontWeight: 700 }}>
            {likeCount}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#ff9999', fontSize: '0.8rem', fontWeight: 600 }}>
            💬 Comments
          </div>
          <div style={{ color: '#e0e0e0', fontSize: '1rem', fontWeight: 700 }}>
            {post.comments}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#ff9999', fontSize: '0.8rem', fontWeight: 600 }}>
            🔄 Reposts
          </div>
          <div style={{ color: '#e0e0e0', fontSize: '1rem', fontWeight: 700 }}>
            {post.reposts}/{post.maxReposts}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 15px',
          flexWrap: 'wrap',
        }}
      >
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={isPostExpired(post)}
          style={{
            flex: 1,
            minWidth: '80px',
            background: isLiked
              ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)'
              : 'rgba(255, 107, 107, 0.1)',
            color: isLiked ? '#fff' : '#ff8888',
            border: isLiked ? 'none' : '1px solid #ff6b6b',
            padding: '8px 12px',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: isPostExpired(post) ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: isPostExpired(post) ? 0.5 : 1,
          }}
        >
          {isLiked ? '❤️ Liked' : '🤍 Like'}
        </button>

        {/* Repost Button */}
        <button
          onClick={handleRepost}
          disabled={!canRepost || isPostExpired(post)}
          style={{
            flex: 1,
            minWidth: '80px',
            background: canRepost
              ? 'rgba(76, 175, 80, 0.1)'
              : 'rgba(100, 100, 100, 0.2)',
            color: canRepost ? '#4caf50' : '#888',
            border: canRepost ? '1px solid #4caf50' : '1px solid #555',
            padding: '8px 12px',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: canRepost && !isPostExpired(post) ? 'pointer' : 'not-allowed',
            opacity: canRepost ? 1 : 0.5,
          }}
        >
          🔄 Repost ({post.reposts}/{post.maxReposts})
        </button>

        {/* Extend Button (if owner) */}
        {isOwner && !post.isExtended && status.canExtend && (
          <div style={{ position: 'relative', flex: 1, minWidth: '100px' }}>
            <button
              onClick={() => setShowExtendOptions(!showExtendOptions)}
              style={{
                width: '100%',
                background: 'rgba(255, 193, 7, 0.1)',
                color: '#ffc107',
                border: '1px solid #ffc107',
                padding: '8px 12px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              ⏱️ Extend
            </button>

            {showExtendOptions && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: '#2a2a2a',
                  border: '1px solid #ffc107',
                  borderRadius: '6px',
                  padding: '12px',
                  zIndex: 100,
                  minWidth: '200px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ color: '#e0e0e0', margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 600 }}>
                    Extend for 24 hours?
                  </p>
                  <p style={{ color: '#ffc107', margin: 0, fontSize: '0.85rem', fontWeight: 700 }}>
                    💰 Cost: ${extensionFee}
                  </p>
                </div>
                <button
                  onClick={handleExtend}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)',
                    color: '#000',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    marginBottom: '8px',
                  }}
                >
                  ✅ Extend
                </button>
                <button
                  onClick={() => setShowExtendOptions(false)}
                  style={{
                    width: '100%',
                    background: 'rgba(200, 200, 200, 0.1)',
                    color: '#888',
                    border: '1px solid #555',
                    padding: '8px',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Delete Button (if owner) */}
        {isOwner && (
          <button
            onClick={handleDelete}
            style={{
              flex: 1,
              minWidth: '80px',
              background: 'rgba(244, 67, 54, 0.1)',
              color: '#f44336',
              border: '1px solid #f44336',
              padding: '8px 12px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            🗑️ Delete
          </button>
        )}
      </div>

      {/* Footer Info */}
      <div
        style={{
          padding: '10px 15px',
          background: 'rgba(255, 112, 67, 0.05)',
          borderTop: '1px solid rgba(255, 112, 67, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: '#888',
        }}
      >
        <div>🪙 +{post.tokens} tokens</div>
        {post.isExtended && (
          <div style={{ color: '#ffc107' }}>✅ Extended</div>
        )}
      </div>
    </div>
  );
};

export default VideoPost;
