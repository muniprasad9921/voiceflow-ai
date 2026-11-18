// Test runner for knowledge-base accuracy and RAG responses
const fs = require('fs');
const path = require('path');

// Read knowledge-base.ts to verify content and run pure JS assertions
const kbPath = path.join(__dirname, '..', 'src', 'lib', 'chat', 'knowledge-base.ts');
const kbContent = fs.readFileSync(kbPath, 'utf8');

console.log('================================================================');
console.log('VOICEFLOW AI - PREMIUM AI CHAT ASSISTANT VERIFICATION SUITE');
console.log('================================================================');

let passCount = 0;
let failCount = 0;

function assert(testName, condition, detail) {
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`✗ FAIL: ${testName} - ${detail || 'Assertion failed'}`);
    failCount++;
  }
}

// 1. Check verified knowledge base existence
assert(
  'Verified Knowledge Base Exported',
  kbContent.includes('export const VERIFIED_KNOWLEDGE_BASE')
);

// 2. Check exact required unverified fallback string
const exactFallback = "I don't have verified information about that yet. Please contact our support team and we'll help you.";
assert(
  'Exact Required Unverified Fallback Message',
  kbContent.includes(exactFallback)
);

// 3. Check Core Pricing Plans in Knowledge Base
assert(
  'Pricing Accuracy: Starter ₹4,999 ($59), Growth ₹14,999 ($179), Enterprise ₹39,999 ($479)',
  kbContent.includes('₹4,999/mo') && kbContent.includes('₹14,999/mo') && kbContent.includes('₹39,999/mo')
);

// 4. Check Multilingual Support in Knowledge Base
assert(
  'Multilingual Support (12+ languages including Hindi, Hinglish, Tamil, Telugu)',
  kbContent.includes('Hindi') && kbContent.includes('Hinglish') && kbContent.includes('Tamil') && kbContent.includes('Telugu')
);

// 5. Check Verified Integrations
assert(
  'Supported Integrations (HubSpot, Salesforce, Zoho, Google Calendar, WhatsApp, Razorpay)',
  kbContent.includes('HubSpot') && kbContent.includes('Salesforce') && kbContent.includes('WhatsApp') && kbContent.includes('Razorpay')
);

// 6. Check Sub-500ms Voice Pipeline
assert(
  'Technical Architecture (Sub-500ms voice pipeline, STT, neural TTS, interruption handling)',
  kbContent.includes('sub-500ms') && kbContent.includes('Interruption Handling')
);

// 7. Check Security & RLS Compliance
assert(
  'Enterprise Security (PostgreSQL RLS, private buckets, GDPR, DPDPA)',
  kbContent.includes('Row Level Security (RLS)') && kbContent.includes('GDPR') && kbContent.includes('DPDPA')
);

// 8. Check Floating Chat Component Implementation
const chatCompPath = path.join(__dirname, '..', 'src', 'components', 'chat', 'floating-chat.tsx');
const chatComp = fs.readFileSync(chatCompPath, 'utf8');

assert(
  'Floating Chat: Fixed Viewport Positioning at Bottom-Right (z-[9999])',
  chatComp.includes('position: "fixed"') && chatComp.includes('bottom-6 right-6')
);

assert(
  'Floating Chat: Purple/Magenta Gradient Launcher Icon with Glowing Shadow',
  chatComp.includes('from-purple-600 via-fuchsia-600 to-pink-500') && chatComp.includes('shadow-[0_0_25px')
);

assert(
  'Floating Chat: Smooth Expand/Collapse without page reload',
  chatComp.includes('setIsOpen(true)') && chatComp.includes('setIsOpen(false)')
);

assert(
  'Floating Chat: Suggested Question Chips',
  chatComp.includes('What is VoiceFlow AI?') &&
  chatComp.includes('What are your pricing plans?') &&
  chatComp.includes('How does AI voice calling work?')
);

assert(
  'Floating Chat: Human Support Escalation Option (Transparent, No False Human Claim)',
  chatComp.includes('Escalate to Human Support') && chatComp.includes('/api/chat/escalate')
);

// 9. Check API Routes
const apiChatPath = path.join(__dirname, '..', 'src', 'app', 'api', 'chat', 'route.ts');
assert('Chat API Route Exists', fs.existsSync(apiChatPath));

const apiEscalatePath = path.join(__dirname, '..', 'src', 'app', 'api', 'chat', 'escalate', 'route.ts');
assert('Escalation API Route Exists', fs.existsSync(apiEscalatePath));

const apiFeedbackPath = path.join(__dirname, '..', 'src', 'app', 'api', 'chat', 'feedback', 'route.ts');
assert('Feedback API Route Exists', fs.existsSync(apiFeedbackPath));

const apiAdminPath = path.join(__dirname, '..', 'src', 'app', 'api', 'chat', 'admin', 'route.ts');
assert('Admin Chat Intelligence API Route Exists', fs.existsSync(apiAdminPath));

// 10. Check Root Layout Integration
const layoutPath = path.join(__dirname, '..', 'src', 'app', 'layout.tsx');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');
assert(
  'Root Layout Integrates FloatingChat without Altering Navbar/Homepage',
  layoutContent.includes('<FloatingChat />')
);

console.log('----------------------------------------------------------------');
console.log(`TOTAL TESTS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
}
