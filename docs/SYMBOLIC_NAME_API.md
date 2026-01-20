# §name API Reference

Complete API documentation for the Symbolic Name system.

## Utility Functions

### `formatSymbolicName(name: string): string`

Converts a plain username to §name format.

```javascript
import { formatSymbolicName } from '../lib/utils';

formatSymbolicName('Alice')     // Returns: '§(Alice)'
formatSymbolicName('§(Bob)')    // Returns: '§(Bob)' (already formatted)
formatSymbolicName('')          // Returns: '§(Anonymous)'
formatSymbolicName(null)        // Returns: '§(Anonymous)'
```

---

### `parseSymbolicName(symbolicName: string): string`

Extracts the plain username from §name format.

```javascript
import { parseSymbolicName } from '../lib/utils';

parseSymbolicName('§(Alice)')   // Returns: 'Alice'
parseSymbolicName('Bob')        // Returns: 'Bob'
parseSymbolicName('§Charlie')   // Returns: 'Charlie'
parseSymbolicName('')           // Returns: 'Anonymous'
```

---

### `isSymbolicName(name: string): boolean`

Checks if a string uses §name format.

```javascript
import { isSymbolicName } from '../lib/utils';

isSymbolicName('§(Alice)')      // Returns: true
isSymbolicName('Alice')         // Returns: false
isSymbolicName('§Alice')        // Returns: true (starts with §)
```

---

### `extractSymbolicMentions(text: string): string[]`

Finds all §name mentions in text.

```javascript
import { extractSymbolicMentions } from '../lib/utils';

const text = "Hey §(Alice), meet §(Bob)!";
extractSymbolicMentions(text);
// Returns: ['§(Alice)', '§(Bob)']

extractSymbolicMentions("No mentions here");
// Returns: []
```

---

### `highlightSymbolicNames(text: string): string`

Wraps §name mentions in HTML span tags for styling.

```javascript
import { highlightSymbolicNames } from '../lib/utils';

const text = "Hello §(Alice)!";
highlightSymbolicNames(text);
// Returns: 'Hello <span class="symbolic-mention">§(Alice)</span>!'
```

**Usage in React:**
```javascript
<div dangerouslySetInnerHTML={{ __html: highlightSymbolicNames(text) }} />
```

---

### `isValidSymbolicName(name: string): boolean`

Validates §name format according to platform rules.

```javascript
import { isValidSymbolicName } from '../lib/utils';

// Valid examples
isValidSymbolicName('§(Alice)')      // true - 2-20 chars
isValidSymbolicName('§(User123)')    // true - alphanumeric
isValidSymbolicName('§(Dev_123)')    // true - underscore allowed

// Invalid examples
isValidSymbolicName('§(A)')          // false - too short (min 2)
isValidSymbolicName('§(VeryLongNameThatExceedsLimit)')  // false - too long (max 20)
isValidSymbolicName('Alice')         // false - missing § and ()
isValidSymbolicName('§(User-123)')   // false - hyphen not allowed
isValidSymbolicName('§(User 123)')   // false - space not allowed
```

**Validation Rules:**
- Must start with `§(`
- Must end with `)`
- Name must be 2-20 characters
- Only letters, numbers, and underscores allowed
- Pattern: `/^§\([a-zA-Z0-9_]{2,20}\)$/`

---

## React Hooks

### `useSymbolicName()`

React hook for managing the current user's §name.

```javascript
import { useSymbolicName } from '../lib/useSymbolicName';

function ProfileComponent() {
  const { 
    symbolicName,      // Current user's §name
    loading,           // Loading state
    error,             // Error message (if any)
    updateSymbolicName // Function to update name
  } = useSymbolicName();

  const handleUpdate = async () => {
    const success = await updateSymbolicName('§(NewName)');
    if (success) {
      console.log('Name updated!');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Your handle: {symbolicName}</p>
      <button onClick={handleUpdate}>Update Name</button>
    </div>
  );
}
```

**Return Object:**
```typescript
{
  symbolicName: string | null,           // User's §name or null if not loaded
  loading: boolean,                       // True while fetching from Firestore
  error: string | null,                   // Error message or null
  updateSymbolicName: (name: string) => Promise<boolean>  // Update function
}
```

---

### `getUserSymbolicName(userId: string)`

Async function to get any user's §name from Firestore.

```javascript
import { getUserSymbolicName } from '../lib/useSymbolicName';

async function loadUserName(userId) {
  const symbolicName = await getUserSymbolicName(userId);
  console.log(symbolicName);  // '§(Username)'
}
```

**Returns:** `Promise<string>` - Always returns a §name, defaults to '§(User)' if not found

---

## Component Props

### `CredAIMessage`

```javascript
import CredAIMessage from './credai/CredAIMessage';

<CredAIMessage 
  message={{
    id: number,
    text: string,
    sender: 'user' | 'ai',
    timestamp: string,
    error?: boolean
  }}
  userName="Alice"           // Plain username (will be formatted to §(Alice))
  onRegenerate={function}    // Optional callback for regenerating AI responses
/>
```

### `GameRoomMessage`

```javascript
import GameRoomMessage from './game/GameRoomMessage';

<GameRoomMessage 
  message={{
    id: number,
    text: string,
    sender: string,          // Will be displayed as §(sender)
    senderTokens: number,
    senderReputation: string,
    timestamp: Date,
    reactions: Array,
    tips: number
  }}
  currentUser={object}
  onTip={function}
  onReaction={function}
/>
```

---

## CSS Classes

### `.symbolic-name`

Applied to all §name displays.

```css
.symbolic-name {
  color: #7de2ff;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.03em;
}
```

### `.symbolic-mention`

Applied to §name mentions in message text.

**CredAI (cyan):**
```css
.symbolic-mention {
  color: #7de2ff;
  background: rgba(125, 226, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(125, 226, 255, 0.2);
}
```

**Game Room (gold):**
```css
.symbolic-mention {
  color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  cursor: pointer;
}

.symbolic-mention:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.4);
}
```

---

## Firestore Schema

### User Document

**Path:** `/users/{userId}`

```javascript
{
  symbolicName: string,      // e.g., "§(Username)"
  createdAt: string,         // ISO timestamp
  updatedAt: string          // ISO timestamp
}
```

**Example:**
```javascript
{
  symbolicName: "§(Evuro)",
  createdAt: "2026-01-19T10:30:00.000Z",
  updatedAt: "2026-01-19T10:30:00.000Z"
}
```

---

## Examples

### Complete Chat Integration

```javascript
import React from 'react';
import { useSymbolicName } from '../lib/useSymbolicName';
import { formatSymbolicName, extractSymbolicMentions } from '../lib/utils';
import CredAIMessage from '../credai/CredAIMessage';

function ChatExample() {
  const { symbolicName } = useSymbolicName();
  
  const message = {
    id: 1,
    text: "Hello §(Alice) and §(Bob)!",
    sender: "user",
    timestamp: new Date().toISOString()
  };
  
  // Get mentions
  const mentions = extractSymbolicMentions(message.text);
  console.log(mentions);  // ['§(Alice)', '§(Bob)']
  
  return (
    <div>
      <p>Logged in as: {symbolicName}</p>
      <CredAIMessage 
        message={message}
        userName={parseSymbolicName(symbolicName)}
      />
    </div>
  );
}
```

### Profile Update

```javascript
import { useSymbolicName } from '../lib/useSymbolicName';
import { isValidSymbolicName } from '../lib/utils';

function ProfileEditor() {
  const { symbolicName, updateSymbolicName } = useSymbolicName();
  const [newName, setNewName] = useState('');
  
  const handleSubmit = async () => {
    if (!isValidSymbolicName(newName)) {
      alert('Invalid §name format');
      return;
    }
    
    const success = await updateSymbolicName(newName);
    if (success) {
      alert('Name updated successfully!');
    }
  };
  
  return (
    <div>
      <p>Current: {symbolicName}</p>
      <input 
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="§(NewName)"
      />
      <button onClick={handleSubmit}>Update</button>
    </div>
  );
}
```

---

## Error Handling

```javascript
const { symbolicName, error } = useSymbolicName();

if (error) {
  // Handle errors:
  // - "No user logged in"
  // - "Invalid symbolic name format..."
  // - Firebase errors
  console.error('Symbolic name error:', error);
}
```

---

## Best Practices

1. **Always validate before updating:**
   ```javascript
   if (isValidSymbolicName(newName)) {
     await updateSymbolicName(newName);
   }
   ```

2. **Handle loading states:**
   ```javascript
   const { symbolicName, loading } = useSymbolicName();
   if (loading) return <Spinner />;
   ```

3. **Use formatSymbolicName for consistency:**
   ```javascript
   // ✅ Good
   const name = formatSymbolicName(username);
   
   // ❌ Avoid manually constructing
   const name = `§(${username})`;
   ```

4. **Sanitize user input:**
   ```javascript
   const sanitized = parseSymbolicName(userInput);
   const formatted = formatSymbolicName(sanitized);
   ```

---

## TypeScript Types (Future)

```typescript
type SymbolicName = string;  // Format: §(username)

interface UserData {
  symbolicName: SymbolicName;
  createdAt: string;
  updatedAt: string;
}

interface UseSymbolicNameResult {
  symbolicName: SymbolicName | null;
  loading: boolean;
  error: string | null;
  updateSymbolicName: (name: SymbolicName) => Promise<boolean>;
}
```
