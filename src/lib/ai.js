// AI integration utilities

// Get conversation context from message history
export const getAIContext = (messages) => {
  const recentMessages = messages.slice(-6); // Last 6 messages for context
  return recentMessages.map(m => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: m.text
  }));
};

// Simulated AI responses for different topics
const aiResponses = {
  'crednetsocial': `CredNet Social is a **quiet, symbolic social network** built around meaningful interactions. Unlike traditional social media, we focus on:

✨ **Symbolic Identity**: Express yourself through §(symbolic names)
🎯 **Real Signals**: Track meaningful contributions, not vanity metrics
🤖 **AI Integration**: Intelligent assistance through CredAI
🎮 **Community Spaces**: Game rooms and collaborative areas

Would you like to know more about any specific feature?`,

  'signals': `**Signals** are the heart of CredNet Social - they represent meaningful interactions rather than superficial engagement.

You earn signals by:
• Contributing helpful content
• Engaging in thoughtful discussions
• Helping other community members
• Participating in collaborative projects

Your **Breadcrumb Score** accumulates based on the quality and consistency of your signals. It's not about quantity - it's about impact! 🎯`,

  'symbolic': `**Symbolic Names** (§-names) are a unique way to express your identity on CredNet Social.

Instead of using your real name, you can create a symbolic representation like:
§(Wanderer)
§(CodePoet)
§(DreamWeaver)

This allows for:
✨ **Creative Expression**: Choose names that resonate with you
🎭 **Privacy**: Separate your online identity from your real identity
🌟 **Evolution**: Change your symbolic name as you grow

What symbolic name speaks to you?`,

  'help': `I'm here to help! Here are some things I can assist you with:

📚 **Platform Features**
• Understanding signals and breadcrumb scores
• Learning about symbolic identities
• Navigating game rooms
• Managing your profile

💡 **Getting Started**
• Setting up your account
• Best practices for earning signals
• Community guidelines

🤖 **AI Assistance**
• Answering questions
• Providing recommendations
• Helping with content creation

What would you like to know more about?`,

  'code': `Here's an example of how to interact with the CredNet API:

\`\`\`javascript
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

async function createSignal(data) {
  try {
    const signalRef = await addDoc(collection(db, 'signals'), {
      type: data.type,
      description: data.description,
      userId: data.userId,
      timestamp: new Date()
    });
    return signalRef.id;
  } catch (error) {
    console.error('Error creating signal:', error);
  }
}
\`\`\`

This demonstrates how to create a new signal in Firestore. Would you like to see more examples?`,
  
  'default': `That's an interesting question! Let me share my thoughts:

{response}

Is there anything specific you'd like me to elaborate on?`
};

export const sendAIMessage = async (message, context = []) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

  const lowerMessage = message.toLowerCase();
  
  let responseText = '';
  
  // Determine response based on keywords
  if (lowerMessage.includes('what is') && lowerMessage.includes('crednetsocial')) {
    responseText = aiResponses.crednetsocial;
  } else if (lowerMessage.includes('signal') || lowerMessage.includes('earn') || lowerMessage.includes('breadcrumb')) {
    responseText = aiResponses.signals;
  } else if (lowerMessage.includes('symbolic') || lowerMessage.includes('name') || lowerMessage.includes('§')) {
    responseText = aiResponses.symbolic;
  } else if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('guide')) {
    responseText = aiResponses.help;
  } else if (lowerMessage.includes('code') || lowerMessage.includes('api') || lowerMessage.includes('example')) {
    responseText = aiResponses.code;
  } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    responseText = `Hello! 👋 I'm **CredAI**, your AI assistant for CredNet Social. I'm here to help you navigate the platform, understand features, and answer any questions you might have.\n\nHow can I assist you today?`;
  } else if (lowerMessage.includes('thank')) {
    responseText = `You're very welcome! 😊 I'm always here to help. Feel free to ask me anything else about CredNet Social!`;
  } else {
    // Generate contextual response
    const responses = [
      `Based on your question about "${message}", here's what I can tell you:\n\nCredNet Social emphasizes **meaningful connections** over superficial engagement. Every interaction is designed to build genuine community value.\n\nWould you like to explore any specific aspect of this?`,
      `That's a great question! In the context of CredNet Social, **${message.split(' ')[0]}** relates to how we create value through authentic interactions.\n\nLet me break this down for you:\n• Community-driven engagement\n• Quality over quantity\n• Meaningful contribution tracking\n\nWhat else would you like to know?`,
      `Interesting perspective! Here's how I see it:\n\n**${message}** touches on an important aspect of digital communities. At CredNet Social, we believe in:\n\n✨ Authentic self-expression\n🎯 Measurable impact\n🤝 Collaborative growth\n\nShall we dive deeper into any of these areas?`
    ];
    responseText = responses[Math.floor(Math.random() * responses.length)];
  }

  return {
    text: responseText,
    timestamp: new Date().toISOString(),
    context: context.length
  };
};

export const generateAIResponse = (prompt, context = []) => {
  // Enhanced response generation with context
  const hasContext = context.length > 0;
  const prefix = hasContext ? 'Considering our previous discussion, ' : '';
  return `${prefix}here's my response to: "${prompt}"`;
};

// Analyze message sentiment
export const analyzeSentiment = (message) => {
  const positive = ['good', 'great', 'excellent', 'love', 'like', 'thank', 'awesome', 'helpful'];
  const negative = ['bad', 'poor', 'hate', 'dislike', 'terrible', 'awful', 'confuse'];
  
  const words = message.toLowerCase().split(' ');
  let score = 0;
  
  words.forEach(word => {
    if (positive.some(p => word.includes(p))) score++;
    if (negative.some(n => word.includes(n))) score--;
  });
  
  return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
};
