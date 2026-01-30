# Crednetsocial-app
Student reputation building infrastructure online 

## Features

### 🔷 Symbolic Name System (§name)
Every user has a unique **§name** handle displayed throughout the platform:
- Format: `§(username)` 
- Example: `§(Evuro)`, `§(Alice)`
- Automatic highlighting and mention detection in chat
- Consistent identity across CredAI and Game Room

See [SYMBOLIC_NAMES.md](SYMBOLIC_NAMES.md) for complete documentation.

### 🤖 CredAI Chat
AI-powered assistant that recognizes your §name and provides personalized guidance.

### 🎮 Game Room
Human-to-human chat where all players are identified by their §name handles.

### 📊 Token Economy
Earn tokens through participation, build reputation, and tip other users.

### 🔐 Firebase Integration
Secure authentication and real-time data sync with Firestore.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Serve production build locally
npm run serve
```

## Project Structure

```
src/
├── credai/          # AI chat components
├── game/            # Game room chat components  
├── identity/        # Identity & reputation components
├── layout/          # Header, footer, navigation
├── lib/             # Utilities and Firebase config
│   ├── utils.js           # Symbolic name utilities
│   ├── useSymbolicName.js # §name hook
│   └── firebase.js        # Firebase config
├── pages/           # Route pages
└── styles/          # CSS styling
```

## Documentation

- [Symbolic Names (§name) Guide](SYMBOLIC_NAMES.md) - Complete §name system documentation
- [Vercel Setup](VERCEL_SETUP.md) - Deployment instructions for Vercel
- [Cloudflare Setup](CLOUDFLARE_SETUP.md) - Deployment instructions for Cloudflare
- [Chat Distinction Guide](CHAT_DISTINCTION_GUIDE.md) - AI vs Human chat features

## Technologies

- React 18
- Firebase (Auth, Firestore, Storage)
- React Router
- Genkit AI
- Cloudflare Pages

## License

MIT 
