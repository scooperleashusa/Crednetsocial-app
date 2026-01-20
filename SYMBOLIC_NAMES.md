# Symbolic Name (§name) Chat Handle System

## Overview

CredNet Social uses a unique **§name** format for user identification across all chat interfaces. This symbolic naming system provides a consistent, recognizable identity throughout the platform.

## Format

All usernames are displayed in the format: **§(username)**

Example: `§(Evuro)`, `§(Alice)`, `§(Dev123)`

## Features

### 1. **Automatic §name Display**
- All chat messages automatically display senders with §name format
- Works in both CredAI (AI chat) and Game Room (human chat)
- Consistent across all platform features

### 2. **§name Mentions**
When you type `§(username)` in any chat message, it will be automatically:
- Highlighted with special styling
- Clickable (in Game Room)
- Linked to the user's profile

**Example:**
```
Hey §(Alice), welcome to the Game Room!
```

### 3. **Mention Detection**
The system automatically:
- Detects all §name mentions in messages
- Applies visual highlighting
- Enables interaction features

## Implementation

### Using §name in Components

```javascript
import { formatSymbolicName, parseSymbolicName, extractSymbolicMentions } from '../lib/utils';

// Format a username
const symbolicName = formatSymbolicName('Alice'); // Returns: §(Alice)

// Parse a symbolic name back to plain text
const plainName = parseSymbolicName('§(Alice)'); // Returns: Alice

// Extract all mentions from text
const text = "Hello §(Bob) and §(Charlie)!";
const mentions = extractSymbolicMentions(text); // Returns: ['§(Bob)', '§(Charlie)']
```

### Using the Symbolic Name Hook

```javascript
import { useSymbolicName } from '../lib/useSymbolicName';

function MyComponent() {
  const { symbolicName, loading, error, updateSymbolicName } = useSymbolicName();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <p>Your handle: {symbolicName}</p>
      <button onClick={() => updateSymbolicName('§(NewName)')}>
        Update Name
      </button>
    </div>
  );
}
```

## Styling

Symbolic names use custom styling defined in CSS:

```css
.symbolic-name {
  color: #7de2ff;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.03em;
}

.symbolic-mention {
  color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-weight: 600;
  border: 1px solid rgba(255, 215, 0, 0.2);
}
```

## Validation

Symbolic names must follow these rules:
- Format: `§(name)`
- Name length: 2-20 characters
- Allowed characters: letters, numbers, underscore
- Pattern: `/^§\([a-zA-Z0-9_]{2,20}\)$/`

```javascript
import { isValidSymbolicName } from '../lib/utils';

isValidSymbolicName('§(Alice)');    // ✅ true
isValidSymbolicName('§(A)');        // ❌ false (too short)
isValidSymbolicName('§(VeryLongNameThatExceedsLimit)'); // ❌ false (too long)
isValidSymbolicName('Alice');       // ❌ false (missing §)
```

## Chat Integration

### CredAI Chat (AI Mode)
- Your messages show with your §name
- AI responses reference you by your §name
- You can mention other users with §name format

### Game Room Chat (Human Mode)
- All players display with §name
- §name appears next to avatar
- Click on §name mentions to view profiles
- Tip other players by clicking their §name

## User Experience

1. **First Time Users**: Automatically assigned §name from display name
2. **Custom §name**: Users can update their §name in Profile settings
3. **Consistency**: §name persists across all sessions and devices
4. **Recognition**: Builds identity and reputation over time

## Database Schema

User symbolic names are stored in Firestore:

```javascript
{
  users: {
    [userId]: {
      symbolicName: "§(Username)",
      createdAt: "2026-01-19T...",
      updatedAt: "2026-01-19T..."
    }
  }
}
```

## Future Enhancements

- [ ] §name verification badges
- [ ] §name history tracking
- [ ] §name marketplace (rare names)
- [ ] §name reputation scoring
- [ ] §name autocomplete in chat
- [ ] §name notification system
