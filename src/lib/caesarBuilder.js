// Caesar (Profile/Identity) Builder with CredAI
// Helps users create their digital persona through guided AI conversations

export const CAESAR_MOTTO = "Give to your reputation what's yours and give to Caesar what's Caesars 👑";

export const CAESAR_BUILDER_PROMPTS = {
  START: `Welcome to CredAI Profile Builder! 👑\n\n"${CAESAR_MOTTO}"\n\nI'll help you build your Caesar - your unique digital identity on CredNet Social. Let's start with some basics about you. What field or industry are you most passionate about?`,

  EXPERTISE: `Great! And what's your primary expertise or skill in {field}? (e.g., 5 years in software development, beginner investor, marketing strategist, etc.)`,

  VALUES: `I like that! Now, what are your core values in what you do? Pick 2-3 that resonate: Innovation, Integrity, Community, Growth, Excellence, Creativity, or something else?`,

  GOALS: `Perfect! What's your main goal on CredNet? (e.g., Learn from experts, Share knowledge, Network, Build reputation, Find opportunities, Collaborate)`,

  STYLE: `How would you describe your communication style? (e.g., Direct & analytical, Friendly & casual, Professional & formal, Creative & experimental)`,

  INTERESTS: `What topics or industries interest you most? (Share 3-5 areas you're passionate about)`,

  AUDIENCE: `Who do you want to connect with? (e.g., Other developers, investors, creators, tech enthusiasts, general public)`,

  REVIEW: `Perfect! Let me generate your Caesar profile based on what we've discussed. I'll create:
- Your profile tagline
- Bio/description
- Signal preferences (what topics you'll share)
- Initial reputation score
- Recommended connections

Ready? Let me craft your profile...`
};

export const CAESAR_TEMPLATES = {
  DEVELOPER: {
    icon: '💻',
    name: 'Developer',
    description: 'Perfect for software engineers, full-stack developers, and tech builders',
    defaultBio: 'Building innovative solutions with code. Passionate about {expertise}. Always learning, always shipping.',
    signals: ['coding', 'tech-trends', 'open-source', 'startups', 'web3'],
    tags: ['developer', 'engineer', 'builder', 'tech'],
    initialReputation: 100
  },
  CREATOR: {
    icon: '🎨',
    name: 'Creator',
    description: 'For content creators, designers, and creative professionals',
    defaultBio: 'Creating {expertise}. Sharing my journey in {field}. Let\'s collaborate and inspire.',
    signals: ['creativity', 'design-trends', 'content', 'inspiration', 'collaboration'],
    tags: ['creator', 'designer', 'artist', 'builder'],
    initialReputation: 100
  },
  ENTREPRENEUR: {
    icon: '🚀',
    name: 'Entrepreneur',
    description: 'For founders, business builders, and venture enthusiasts',
    defaultBio: 'Founder & builder in {field}. {expertise}. Let\'s build something amazing together.',
    signals: ['startups', 'entrepreneurship', 'business', 'growth', 'innovation'],
    tags: ['entrepreneur', 'founder', 'investor', 'leader'],
    initialReputation: 100
  },
  INVESTOR: {
    icon: '💰',
    name: 'Investor',
    description: 'For investors, advisors, and financial experts',
    defaultBio: '{expertise} in {field}. Sharing insights on investments and opportunities. Happy to mentor.',
    signals: ['investing', 'finance', 'markets', 'opportunities', 'mentorship'],
    tags: ['investor', 'advisor', 'analyst', 'expert'],
    initialReputation: 100
  },
  EDUCATOR: {
    icon: '📚',
    name: 'Educator',
    description: 'For teachers, trainers, and knowledge sharers',
    defaultBio: 'Passionate about teaching {field}. {expertise}. Let me help you grow.',
    signals: ['education', 'learning', 'mentorship', 'tutorials', 'knowledge-sharing'],
    tags: ['educator', 'teacher', 'mentor', 'trainer'],
    initialReputation: 100
  },
  EXECUTIVE: {
    icon: '👔',
    name: 'Executive',
    description: 'For C-level executives and senior leaders',
    defaultBio: 'Leading teams in {field}. {expertise}. Open to strategic conversations and mentoring.',
    signals: ['leadership', 'strategy', 'management', 'industry-insights', 'mentorship'],
    tags: ['executive', 'leader', 'ceo', 'strategist'],
    initialReputation: 100
  }
};

export const CAESAR_BUILDER_STEPS = [
  {
    id: 'intro',
    title: 'Welcome',
    description: 'Tell me about your field',
    prompt: CAESAR_BUILDER_PROMPTS.START,
    key: 'field'
  },
  {
    id: 'expertise',
    title: 'Expertise',
    description: 'What\'s your specialty?',
    prompt: CAESAR_BUILDER_PROMPTS.EXPERTISE,
    key: 'expertise'
  },
  {
    id: 'values',
    title: 'Values',
    description: 'What do you believe in?',
    prompt: CAESAR_BUILDER_PROMPTS.VALUES,
    key: 'values'
  },
  {
    id: 'goals',
    title: 'Goals',
    description: 'What\'s your main goal?',
    prompt: CAESAR_BUILDER_PROMPTS.GOALS,
    key: 'goals'
  },
  {
    id: 'style',
    title: 'Style',
    description: 'How do you communicate?',
    prompt: CAESAR_BUILDER_PROMPTS.STYLE,
    key: 'style'
  },
  {
    id: 'interests',
    title: 'Interests',
    description: 'What topics interest you?',
    prompt: CAESAR_BUILDER_PROMPTS.INTERESTS,
    key: 'interests'
  },
  {
    id: 'audience',
    title: 'Audience',
    description: 'Who do you want to reach?',
    prompt: CAESAR_BUILDER_PROMPTS.AUDIENCE,
    key: 'audience'
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Your profile is ready!',
    prompt: CAESAR_BUILDER_PROMPTS.REVIEW,
    key: 'review'
  }
];

// Generate Caesar profile from builder data
export const generateCaesarProfile = (builderData, template = null) => {
  const caesar = {
    id: `caesar-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    motto: CAESAR_MOTTO,
    
    // Basic info
    field: builderData.field,
    expertise: builderData.expertise,
    values: builderData.values,
    goals: builderData.goals,
    style: builderData.style,
    interests: builderData.interests || [],
    audience: builderData.audience,
    
    // Generated profile
    tagline: generateTagline(builderData),
    bio: generateBio(builderData, template),
    avatar: generateAvatarColor(builderData),
    
    // Signals
    signals: generateSignals(template),
    topics: builderData.interests || [],
    
    // Initial metrics
    reputation: 100,
    tokens: 50,
    credibilityScore: 60,
    
    // Profile settings
    visibility: 'public',
    allowMessages: true,
    allowMentorship: true,
    
    // Status
    status: 'active',
    verified: false
  };
  
  return caesar;
};

// Generate tagline
const generateTagline = (data) => {
  const taglines = {
    developer: `${data.expertise || 'Creative'} Developer | ${data.values?.[0] || 'Builder'}`,
    creator: `${data.field || 'Creative'} Creator | ${data.values?.[0] || 'Innovator'}`,
    entrepreneur: `Founder | ${data.field || 'Startup'} Builder | ${data.values?.[0] || 'Visionary'}`,
    investor: `${data.expertise || 'Angel'} Investor | ${data.field || 'Tech'} Enthusiast`,
    educator: `${data.field || 'Knowledge'} Educator | Mentor | ${data.values?.[0] || 'Teacher'}`,
    executive: `${data.expertise || 'Strategic'} Leader | ${data.field || 'Tech'} Executive`
  };
  
  return taglines[data.type] || `${data.field} Professional | ${data.values?.[0] || 'Expert'}`;
};

// Generate bio
const generateBio = (data, template) => {
  if (template?.defaultBio) {
    return template.defaultBio
      .replace('{field}', data.field || 'my industry')
      .replace('{expertise}', data.expertise || 'expert-level skills');
  }
  
  const parts = [];
  
  if (data.expertise) parts.push(`${data.expertise} in ${data.field || 'my field'}`);
  if (data.values?.length > 0) parts.push(`Passionate about ${data.values.join(', ')}`);
  if (data.goals) parts.push(`Focused on ${data.goals}`);
  if (data.audience) parts.push(`Connecting with ${data.audience}`);
  
  return parts.join('. ') + '. Always growing! 🚀';
};

// Generate avatar color based on profile
const generateAvatarColor = (data) => {
  const colors = [
    '#4a9eff', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#ec4899'  // Pink
  ];
  
  const hash = (data.field || 'default').charCodeAt(0);
  return colors[hash % colors.length];
};

// Generate signals based on template
const generateSignals = (template) => {
  if (template?.signals) {
    return template.signals;
  }
  
  return [
    'general',
    'learning',
    'sharing',
    'growth',
    'community'
  ];
};

// Caesar profile examples (for inspiration)
export const CAESAR_EXAMPLES = [
  {
    name: 'Alex Chen',
    avatar: '🧑‍💻',
    tagline: 'Full-Stack Developer | Open Source | Web3 Enthusiast',
    bio: '5 years building web apps. Passionate about innovation and community. Let\'s build something amazing together.',
    field: 'Software Development',
    expertise: '5+ years full-stack development',
    reputation: 450,
    tokens: 2100
  },
  {
    name: 'Sarah Martinez',
    avatar: '🎨',
    tagline: 'Product Designer | Brand Strategist | Creative Innovator',
    bio: 'Helping brands stand out through thoughtful design. Love collaborating on creative projects.',
    field: 'Design & Branding',
    expertise: 'Product and brand design specialist',
    reputation: 380,
    tokens: 1850
  },
  {
    name: 'Jordan Lee',
    avatar: '🚀',
    tagline: 'Founder | Growth Hacker | Serial Entrepreneur',
    bio: 'Built 3 startups. Sharing lessons learned and looking to mentor the next generation of builders.',
    field: 'Entrepreneurship',
    expertise: 'Startup founder and growth strategist',
    reputation: 520,
    tokens: 2750
  }
];

// Quick profile generation from single input
export const quickGenerateCaesar = (description) => {
  // Parse description and extract key info
  const lines = description.split('\n').filter(l => l.trim());
  
  return {
    field: extractField(lines[0]),
    expertise: extractExpertise(lines),
    values: extractValues(lines),
    goals: extractGoals(lines),
    style: extractStyle(lines),
    interests: extractInterests(lines),
    audience: extractAudience(lines)
  };
};

// Helper functions to extract info
const extractField = (line) => {
  const fields = ['developer', 'designer', 'entrepreneur', 'investor', 'educator', 'executive'];
  for (const field of fields) {
    if (line.toLowerCase().includes(field)) return field;
  }
  return 'professional';
};

const extractExpertise = (lines) => lines[0] || 'Expert';
const extractValues = (lines) => ['Innovation', 'Growth'];
const extractGoals = (lines) => 'Learn and grow';
const extractStyle = (lines) => 'Professional';
const extractInterests = (lines) => [];
const extractAudience = (lines) => 'Like-minded professionals';
