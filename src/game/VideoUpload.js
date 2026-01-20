import React, { useState, useRef } from 'react';
import { createVideoPost } from '../lib/videoPosts';

const VideoUpload = ({ currentUser, onVideoPosted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const videoPreviewRef = useRef(null);

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  const ALLOWED_FORMATS = ['video/mp4', 'video/webm', 'video/ogg'];

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Video file is too large (max 100MB)');
      return;
    }

    // Validate file format
    if (!ALLOWED_FORMATS.includes(file.type)) {
      setError('Invalid video format (MP4, WebM, OGG only)');
      return;
    }

    setVideoFile(file);
    setError(null);

    // Preview video
    const url = URL.createObjectURL(file);
    if (videoPreviewRef.current) {
      videoPreviewRef.current.src = url;
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !title.trim()) {
      setError('Video and title are required');
      return;
    }

    setUploading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', title);
      formData.append('description', description);

      // In a real app, upload to Firebase Storage or backend
      // For now, create a mock video post with blob URL
      const videoUrl = URL.createObjectURL(videoFile);

      const newPost = createVideoPost(currentUser.id, currentUser.name, {
        url: videoUrl,
        title: title.trim(),
        description: description.trim(),
      });

      // Call parent callback
      onVideoPosted(newPost);

      // Reset form
      setVideoFile(null);
      setTitle('');
      setDescription('');
      setIsOpen(false);

      // Clean up
      if (videoPreviewRef.current) {
        videoPreviewRef.current.src = '';
      }
      fileInputRef.current.value = '';
    } catch (err) {
      setError('Failed to upload video: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setVideoFile(null);
    setTitle('');
    setDescription('');
    setError(null);
    if (videoPreviewRef.current) {
      videoPreviewRef.current.src = '';
    }
    fileInputRef.current.value = '';
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: 'linear-gradient(135deg, #ff7043 0%, #e64a19 100%)',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '0.9rem',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
      >
        📹 Post Video (24h Auto-Delete)
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={handleCancel}
    >
      <div
        style={{
          background: '#1a1a1a',
          borderRadius: '12px',
          padding: '30px',
          maxWidth: '600px',
          width: '100%',
          border: '1px solid #ff7043',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ color: '#ff7043', margin: 0, fontSize: '1.5rem' }}>
            📹 Post Video
          </h2>
          <button
            onClick={handleCancel}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#888',
            }}
          >
            ✕
          </button>
        </div>

        {/* Info Banner */}
        <div
          style={{
            background: 'rgba(255, 112, 67, 0.1)',
            border: '1px solid #ff7043',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            color: '#ff9999',
          }}
        >
          ⏰ <strong>Auto-Delete in 24 hours</strong> | 💰 Extend for $0.99 | 🔄 Max 10 reposts | 🪙 Earn 10 tokens
        </div>

        {/* Video Preview */}
        {videoFile && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#888', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>
              Video Preview
            </label>
            <video
              ref={videoPreviewRef}
              controls
              style={{
                width: '100%',
                borderRadius: '8px',
                background: '#000',
                maxHeight: '300px',
              }}
            />
          </div>
        )}

        {/* Video Upload */}
        <div
          style={{
            marginBottom: '20px',
            padding: '20px',
            border: '2px dashed #ff7043',
            borderRadius: '8px',
            textAlign: 'center',
            cursor: 'pointer',
            background: 'rgba(255, 112, 67, 0.05)',
            transition: 'all 0.3s ease',
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.background = 'rgba(255, 112, 67, 0.15)';
          }}
          onDragLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 112, 67, 0.05)';
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.style.background = 'rgba(255, 112, 67, 0.05)';
            handleFileSelect({ target: { files: e.dataTransfer.files } });
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📹</div>
          <p style={{ color: '#ff9999', margin: '0 0 5px 0', fontWeight: 600 }}>
            {videoFile ? videoFile.name : 'Click or drag video here'}
          </p>
          <p style={{ color: '#888', margin: 0, fontSize: '0.85rem' }}>
            Max 100MB • MP4, WebM, OGG
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Title */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#888', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
            Title (required)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter video title..."
            maxLength={100}
            style={{
              width: '100%',
              padding: '10px',
              background: '#2a2a2a',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#e0e0e0',
              fontSize: '0.95rem',
              boxSizing: 'border-box',
            }}
          />
          <span style={{ color: '#666', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>
            {title.length}/100
          </span>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#888', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            maxLength={500}
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              background: '#2a2a2a',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#e0e0e0',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />
          <span style={{ color: '#666', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>
            {description.length}/500
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: '#7f1d1d',
              border: '1px solid #991b1b',
              color: '#fca5a5',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '15px',
              fontSize: '0.9rem',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleUpload}
            disabled={uploading || !videoFile || !title.trim()}
            style={{
              flex: 1,
              background: uploading ? '#666' : 'linear-gradient(135deg, #ff7043 0%, #e64a19 100%)',
              color: '#fff',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontSize: '0.95rem',
              opacity: uploading || !videoFile || !title.trim() ? 0.6 : 1,
            }}
          >
            {uploading ? '⏳ Uploading...' : '🚀 Post Video'}
          </button>
          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              background: 'rgba(255, 112, 67, 0.1)',
              color: '#ff7043',
              border: '1px solid #ff7043',
              padding: '12px',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
