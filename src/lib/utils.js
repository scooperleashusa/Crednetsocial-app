export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Symbolic Name utilities for §name format
export const formatSymbolicName = (name) => {
  if (!name) return '§(Anonymous)';
  // If name already has § format, return as-is
  if (name.startsWith('§')) return name;
  // Otherwise wrap it
  return `§(${name})`;
};

export const parseSymbolicName = (symbolicName) => {
  if (!symbolicName) return 'Anonymous';
  // Extract name from §(name) format
  const match = symbolicName.match(/§\(([^)]+)\)/);
  return match ? match[1] : symbolicName.replace(/§/g, '');
};

export const isSymbolicName = (name) => {
  return name && name.startsWith('§');
};

// Extract all §name mentions from text
export const extractSymbolicMentions = (text) => {
  if (!text) return [];
  const mentionRegex = /§\([^)]+\)/g;
  return text.match(mentionRegex) || [];
};

// Highlight §name mentions in text
export const highlightSymbolicNames = (text) => {
  if (!text) return text;
  return text.replace(
    /§\(([^)]+)\)/g,
    '<span class="symbolic-mention">§($1)</span>'
  );
};

// Validate symbolic name format
export const isValidSymbolicName = (name) => {
  if (!name) return false;
  // Must be §(name) format with 2-20 characters
  const pattern = /^§\([a-zA-Z0-9_]{2,20}\)$/;
  return pattern.test(name);
};
