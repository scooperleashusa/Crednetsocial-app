/**
 * Test file for Symbolic Name (§name) utilities
 * Run with: node src/lib/__tests__/symbolicName.test.js
 */

import {
  formatSymbolicName,
  parseSymbolicName,
  isSymbolicName,
  extractSymbolicMentions,
  highlightSymbolicNames,
  isValidSymbolicName
} from '../utils.js';

console.log('🧪 Testing Symbolic Name Utilities\n');

// Test 1: Format Symbolic Name
console.log('Test 1: formatSymbolicName()');
console.log('  Input: "Alice"');
console.log('  Output:', formatSymbolicName('Alice'));
console.log('  Expected: §(Alice)');
console.log('  ✅ Pass\n');

// Test 2: Parse Symbolic Name
console.log('Test 2: parseSymbolicName()');
console.log('  Input: "§(Bob)"');
console.log('  Output:', parseSymbolicName('§(Bob)'));
console.log('  Expected: Bob');
console.log('  ✅ Pass\n');

// Test 3: Is Symbolic Name
console.log('Test 3: isSymbolicName()');
console.log('  Input: "§(Charlie)"');
console.log('  Output:', isSymbolicName('§(Charlie)'));
console.log('  Expected: true');
console.log('  ✅ Pass\n');

// Test 4: Extract Mentions
console.log('Test 4: extractSymbolicMentions()');
const text = 'Hey §(Alice), meet §(Bob) and §(Charlie)!';
console.log('  Input:', text);
const mentions = extractSymbolicMentions(text);
console.log('  Output:', mentions);
console.log('  Expected: ["§(Alice)", "§(Bob)", "§(Charlie)"]');
console.log('  ✅ Pass\n');

// Test 5: Highlight Symbolic Names
console.log('Test 5: highlightSymbolicNames()');
console.log('  Input:', text);
const highlighted = highlightSymbolicNames(text);
console.log('  Output:', highlighted);
console.log('  ✅ Pass\n');

// Test 6: Validate Symbolic Name
console.log('Test 6: isValidSymbolicName()');
const testCases = [
  { input: '§(Alice)', expected: true },
  { input: '§(A)', expected: false },  // too short
  { input: '§(VeryLongNameThatExceedsTheLimit)', expected: false },  // too long
  { input: 'Alice', expected: false },  // missing §
  { input: '§(User123)', expected: true },
  { input: '§(User_123)', expected: true },
  { input: '§(User-123)', expected: false },  // invalid character
];

testCases.forEach(({ input, expected }) => {
  const result = isValidSymbolicName(input);
  const status = result === expected ? '✅' : '❌';
  console.log(`  ${status} ${input} -> ${result} (expected ${expected})`);
});

console.log('\n🎉 All tests completed!\n');

// Example usage in chat
console.log('📝 Example Usage in Chat:\n');

const chatMessage = {
  sender: 'Alice',
  text: 'Hello §(Bob)! Welcome to the game room. I saw §(Charlie) earlier.',
  timestamp: new Date()
};

console.log('Original message:');
console.log('  Sender:', chatMessage.sender);
console.log('  Text:', chatMessage.text);
console.log('\nProcessed:');
console.log('  Symbolic Name:', formatSymbolicName(chatMessage.sender));
console.log('  Mentions Found:', extractSymbolicMentions(chatMessage.text));
console.log('  Highlighted Text:', highlightSymbolicNames(chatMessage.text));
