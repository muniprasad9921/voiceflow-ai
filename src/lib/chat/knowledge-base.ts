import { KnowledgeSource, KnowledgeFAQ } from '@/types/chat';

export interface VerifiedKnowledgeEntry {
  id: string;
  category: string;
  title: string;
  keywords: string[];
  intents: string[];
  summary: string;
  detailedAnswer: string;
  suggestedFollowUps: string[];
}

export const VERIFIED_KNOWLEDGE_BASE: VerifiedKnowledgeEntry[] = [
  {
    id: 'kb-overview',
    category: 'overview',
    title: 'VoiceFlow AI Overview',
    keywords: [
      'voiceflow', 'voiceflow ai', 'what is', 'overview', 'about', 'company',
      'platform', 'ai voice', 'voice employee', 'voice agent', 'who are you',
      'what do you do', 'what is this'
    ],
    intents: ['product_overview', 'about_company'],
    summary: 'Autonomous B2B conversational AI voice employees for business growth.',
    detailedAnswer:
      'VoiceFlow AI is an enterprise-grade autonomous B2B AI Voice Employee and Business Automation SaaS platform. ' +
      'It allows organizations to deploy conversational AI voice employees that handle inbound customer service, ' +
      'conduct outbound sales and lead qualification, schedule appointments, and sync data seamlessly with your CRM ' +
      '24/7 across 12+ languages with sub-500ms voice latency.',
    suggestedFollowUps: [
      'What services do you provide?',
      'What are your pricing plans?',
      'How does AI voice calling work?'
    ]
  },
  {
    id: 'kb-services',
    category: 'services',
    title: 'Core Services & Capabilities',
    keywords: [
      'services', 'features', 'offerings', 'capabilities', 'solutions',
      'use cases', 'outbound', 'inbound', 'calling', 'qualification', 'scheduling',
      'follow up', 'reminders'
    ],
    intents: ['services_inquiry', 'features_overview'],
    summary: 'Autonomous outbound calling, inbound support, appointment booking, and CRM automations.',
    detailedAnswer:
      'VoiceFlow AI delivers four core enterprise services:\n\n' +
      '1. **Autonomous Outbound Voice Agents:** High-volume lead qualification, cold outreach, payment reminders, and proactive follow-ups.\n' +
      '2. **24/7 Inbound Customer Service:** Instant call answering, tier-1 technical support, FAQ handling, and dynamic call routing.\n' +
      '3. **Smart Appointment Scheduling:** Bi-directional calendar booking directly during voice conversations synced with Google Calendar and Outlook.\n' +
      '4. **Enterprise CRM & Workflow Sync:** Real-time call logging, automated call summaries, sentiment scoring, and webhook triggers for HubSpot, Salesforce, Zoho, and WhatsApp.',
    suggestedFollowUps: [
      'How does AI voice calling work?',
      'What integrations are supported?',
      'What are your pricing plans?'
    ]
  },
  {
    id: 'kb-how-it-works',
    category: 'technology',
    title: 'Voice Technology & Latency',
    keywords: [
      'how it works', 'technology', 'latency', 'voice calling', 'speed',
      'stt', 'tts', 'llm', 'speech to text', 'text to speech', 'interrupt',
      'turn taking', 'telephony', 'retell', 'twilio'
    ],
    intents: ['technical_how_it_works'],
    summary: 'Sub-500ms real-time audio pipeline with emotional speech and interruption handling.',
    detailedAnswer:
      'VoiceFlow AI operates on a sub-500ms voice pipeline designed for natural conversation flow:\n\n' +
      '• **Streaming STT (Speech-to-Text):** Transcribes caller audio in real-time within 80-120ms.\n' +
      '• **Conversational Intelligence Layer:** Evaluates intent against your approved knowledge base using RAG to formulate context-aware answers.\n' +
      '• **Emotional Neural TTS:** Streams natural, human-like voice responses with realistic pauses, pitch variation, and breath control.\n' +
      '• **Interruption Handling:** Callers can speak over the agent naturally; the AI pauses immediately and adapts seamlessly.',
    suggestedFollowUps: [
      'What languages do you support?',
      'How can I get started?',
      'Is customer data secure and compliant?'
    ]
  },
  {
    id: 'kb-pricing',
    category: 'pricing',
    title: 'Pricing & Subscription Plans',
    keywords: [
      'pricing', 'price', 'plans', 'cost', 'subscription', 'starter', 'growth',
      'enterprise', 'how much', 'rate', 'minute', 'per minute', 'billing', 'wallet'
    ],
    intents: ['pricing_inquiry', 'billing_wallet'],
    summary: 'Starter (₹4,999/mo), Growth (₹14,999/mo), Enterprise (₹39,999/mo) with per-second metering.',
    detailedAnswer:
      'VoiceFlow AI offers three transparent subscription plans:\n\n' +
      '• **Starter Plan — ₹4,999/mo ($59/mo):** 1 AI Voice Employee, 500 calling minutes included, basic analytics, email support.\n' +
      '• **Growth Plan — ₹14,999/mo ($179/mo):** 5 AI Voice Employees, 2,500 calling minutes included, full CRM integration, priority support, campaign manager.\n' +
      '• **Enterprise Plan — ₹39,999/mo ($479/mo):** Unlimited AI Voice Employees, custom voice cloning, dedicated account manager, custom SLA, and VPC deployment.\n\n' +
      'Calls are billed on a fair **per-second basis** directly from your prepaid wallet, with zero rounding up to full minutes.',
    suggestedFollowUps: [
      'How can I get started?',
      'How does call metering and billing work?',
      'What integrations are supported?'
    ]
  },
  {
    id: 'kb-onboarding',
    category: 'onboarding',
    title: 'Getting Started Guide',
    keywords: [
      'get started', 'signup', 'register', 'how to start', 'onboarding',
      'create account', 'setup', 'trial', 'begin', 'demo'
    ],
    intents: ['onboarding_start'],
    summary: 'Create an account, pick an industry template in Agent Studio, and launch in 5 minutes.',
    detailedAnswer:
      'You can launch your first AI voice employee in under 5 minutes:\n\n' +
      '1. **Sign Up:** Go to `/signup` and create your organization profile.\n' +
      '2. **Agent Studio:** Pick an industry template (Real Estate, Healthcare, Banking, Logistics, etc.) or build a custom agent.\n' +
      '3. **Configure Voice & Prompt:** Select an accent, customize greeting and qualification rules, and upload your FAQs.\n' +
      '4. **Test & Launch:** Run live voice simulations in the Agent Playground, fund your prepaid wallet, and launch an outbound campaign.',
    suggestedFollowUps: [
      'What are your pricing plans?',
      'What services do you provide?',
      'How can I contact support?'
    ]
  },
  {
    id: 'kb-languages',
    category: 'languages',
    title: 'Multilingual Support',
    keywords: [
      'languages', 'language', 'hindi', 'english', 'tamil', 'telugu', 'kannada',
      'bengali', 'marathi', 'gujarati', 'hinglish', 'spanish', 'french', 'german',
      'accents', 'multilingual'
    ],
    intents: ['languages_supported'],
    summary: 'Supports 12+ languages including Hindi, English, Hinglish, Tamil, Telugu, and more.',
    detailedAnswer:
      'VoiceFlow AI supports 12+ languages with native regional accents:\n\n' +
      '• **Indian Languages:** English (Indian), Hindi, Hinglish (mixed conversational Hindi-English), Tamil, Telugu, Kannada, Bengali, Marathi, and Gujarati.\n' +
      '• **Global Languages:** English (US, UK, Australia), Spanish, French, and German.\n\n' +
      'The AI dynamically identifies language shifts during calls and responds in the caller’s preferred dialect.',
    suggestedFollowUps: [
      'What services do you provide?',
      'How does AI voice calling work?',
      'What are your pricing plans?'
    ]
  },
  {
    id: 'kb-integrations',
    category: 'integrations',
    title: 'Supported Integrations',
    keywords: [
      'integrations', 'integrate', 'crm', 'hubspot', 'salesforce', 'zoho',
      'google sheets', 'google calendar', 'whatsapp', 'razorpay', 'webhooks',
      'zapier', 'n8n', 'connect'
    ],
    intents: ['integrations_check'],
    summary: 'HubSpot, Salesforce, Zoho, Google Calendar & Sheets, WhatsApp, Razorpay, Webhooks, n8n.',
    detailedAnswer:
      'VoiceFlow AI integrates out-of-the-box with leading enterprise tools:\n\n' +
      '• **CRMs:** HubSpot, Salesforce, Zoho CRM (bi-directional contact & lead sync).\n' +
      '• **Calendars & Documents:** Google Calendar, Outlook Calendar, Google Sheets.\n' +
      '• **Messaging & Payments:** Meta WhatsApp Cloud API, Razorpay payment gateway.\n' +
      '• **Automation Pipelines:** Webhooks, Zapier, n8n, and custom REST API endpoints.',
    suggestedFollowUps: [
      'What services do you provide?',
      'What are your pricing plans?',
      'How can I get started?'
    ]
  },
  {
    id: 'kb-security',
    category: 'security',
    title: 'Security, Privacy & Compliance',
    keywords: [
      'security', 'privacy', 'safe', 'gdpr', 'dpdpa', 'compliance',
      'encryption', 'rls', 'tenant isolation', 'data protection', 'confidential'
    ],
    intents: ['security_compliance'],
    summary: 'PostgreSQL Row Level Security tenant isolation, encrypted buckets, GDPR and DPDPA compliant.',
    detailedAnswer:
      'VoiceFlow AI is built with enterprise security at its core:\n\n' +
      '• **Strict Tenant Isolation:** Enforced at the PostgreSQL database kernel level using Row Level Security (RLS).\n' +
      '• **Private Encrypted Storage:** Call recordings and uploaded documents are stored in private S3/Supabase buckets accessible only by authenticated organization members.\n' +
      '• **Regulatory Compliance:** Compliant with GDPR and India Digital Personal Data Protection Act (DPDPA).\n' +
      '• **End-to-End Encryption:** TLS 1.3 in transit and AES-256 for data at rest.',
    suggestedFollowUps: [
      'What are your pricing plans?',
      'How can I contact support?',
      'What is VoiceFlow AI?'
    ]
  },
  {
    id: 'kb-billing',
    category: 'billing',
    title: 'Prepaid Wallet & Per-Second Billing',
    keywords: [
      'billing', 'metering', 'wallet', 'per second', 'recharge', 'top up',
      'currency', 'inr', 'usd', 'balance', 'deduction', 'refund'
    ],
    intents: ['billing_wallet'],
    summary: 'Fair per-second call metering deducted from your prepaid wallet balance.',
    detailedAnswer:
      'VoiceFlow AI uses a fair **per-second metering** system:\n\n' +
      '• Inbound and outbound calls deduct exact talk-time seconds from your prepaid wallet.\n' +
      '• No rounding up to full minutes.\n' +
      '• You can set automated low-balance email & SMS thresholds to ensure uninterrupted agent availability.\n' +
      '• Recharge balances instantly via Razorpay (UPI, Credit/Debit cards, Net Banking).',
    suggestedFollowUps: [
      'What are your pricing plans?',
      'How can I get started?',
      'How can I contact support?'
    ]
  },
  {
    id: 'kb-support',
    category: 'support',
    title: 'Customer Support & Escalation',
    keywords: [
      'support', 'contact', 'help', 'email', 'phone', 'escalate', 'human',
      'human agent', 'talk to person', 'reach out', 'issue', 'ticket'
    ],
    intents: ['support_contact'],
    summary: 'Reach our team via support@voiceflow.ai or submit an escalation ticket in this chat.',
    detailedAnswer:
      'You can reach our dedicated support team through multiple channels:\n\n' +
      '• **Email Support:** support@voiceflow.ai (1-hour response SLA for Growth & Enterprise plans).\n' +
      '• **Chat Escalation:** Click "Escalate to Human Support" in this chat window to submit your contact details and message for priority review.\n' +
      '• **Documentation:** Full developer and agent configuration guides at `/docs`.',
    suggestedFollowUps: [
      'How can I get started?',
      'What services do you provide?',
      'What are your pricing plans?'
    ]
  }
];

export const UNVERIFIED_FALLBACK_MESSAGE =
  "I don't have verified information about that yet. Please contact our support team and we'll help you.";

/**
 * Text normalization & typo handling for robust matching
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Identify user intent and extract matched knowledge entries
 */
export function retrieveVerifiedKnowledge(query: string): {
  topMatch: VerifiedKnowledgeEntry | null;
  sources: KnowledgeSource[];
  confidence: number;
  intent: string;
  isVerified: boolean;
} {
  const normalized = normalizeText(query);
  const words = normalized.split(' ').filter(w => w.length > 2);

  // Check for greetings
  const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
  if (greetings.some(g => normalized === g || normalized.startsWith(g + ' '))) {
    return {
      topMatch: VERIFIED_KNOWLEDGE_BASE[0],
      sources: [{
        title: 'VoiceFlow AI Overview',
        category: 'overview',
        snippet: 'Autonomous conversational AI voice employees for business growth.',
        confidence: 0.95
      }],
      confidence: 0.95,
      intent: 'greeting',
      isVerified: true
    };
  }

  // Score each knowledge entry
  const scoredEntries = VERIFIED_KNOWLEDGE_BASE.map(entry => {
    let score = 0;

    // Check exact title / category match
    if (normalized.includes(normalizeText(entry.title)) || normalized.includes(entry.category)) {
      score += 0.45;
    }

    // Check keyword matches
    let matchedKeywords = 0;
    for (const kw of entry.keywords) {
      const normKw = normalizeText(kw);
      if (normalized.includes(normKw)) {
        score += 0.35;
        matchedKeywords++;
      } else {
        // Token level match
        const kwTokens = normKw.split(' ');
        const matchingTokens = kwTokens.filter(t => words.includes(t));
        if (matchingTokens.length > 0) {
          score += 0.15 * (matchingTokens.length / kwTokens.length);
        }
      }
    }

    // Boost if query matches suggested followups
    for (const followUp of entry.suggestedFollowUps) {
      if (normalized.includes(normalizeText(followUp))) {
        score += 0.4;
      }
    }

    // Normalize confidence to 0 - 1
    const confidence = Math.min(Math.round(score * 100) / 100, 0.99);

    return {
      entry,
      confidence
    };
  });

  // Sort descending by confidence
  scoredEntries.sort((a, b) => b.confidence - a.confidence);

  const best = scoredEntries[0];

  // If confidence is below threshold, treat as unverified
  if (!best || best.confidence < 0.28) {
    return {
      topMatch: null,
      sources: [],
      confidence: best ? best.confidence : 0,
      intent: 'unknown',
      isVerified: false
    };
  }

  const sources: KnowledgeSource[] = scoredEntries
    .filter(item => item.confidence >= 0.25)
    .slice(0, 3)
    .map(item => ({
      title: item.entry.title,
      category: item.entry.category,
      snippet: item.entry.summary,
      confidence: item.confidence
    }));

  return {
    topMatch: best.entry,
    sources,
    confidence: best.confidence,
    intent: best.entry.intents[0] || 'general_query',
    isVerified: true
  };
}

/**
 * Generate accurate, verified response based on query and retrieved knowledge
 */
export async function generateGroundedResponse(
  query: string,
  history: Array<{ sender_type: string; content: string }> = []
): Promise<{
  reply: string;
  sources: KnowledgeSource[];
  intent: string;
  confidence: number;
  isVerified: boolean;
  suggestedQuestions: string[];
}> {
  const retrieval = retrieveVerifiedKnowledge(query);

  // If not verified or query asks about unverified domains, return standard verified fallback
  if (!retrieval.isVerified || !retrieval.topMatch) {
    return {
      reply: UNVERIFIED_FALLBACK_MESSAGE,
      sources: [],
      intent: 'unverified',
      confidence: retrieval.confidence,
      isVerified: false,
      suggestedQuestions: [
        'What is VoiceFlow AI?',
        'What services do you provide?',
        'What are your pricing plans?',
        'How can I contact support?'
      ]
    };
  }

  // If greeting
  if (retrieval.intent === 'greeting') {
    return {
      reply: "Hi! Welcome to VoiceFlow AI 👋 I'm your AI assistant. I can answer questions about our AI voice employees, features, pricing, integrations, and setup. How can I help you today?",
      sources: retrieval.sources,
      intent: 'greeting',
      confidence: retrieval.confidence,
      isVerified: true,
      suggestedQuestions: [
        'What is VoiceFlow AI?',
        'What services do you provide?',
        'What are your pricing plans?',
        'How does AI voice calling work?'
      ]
    };
  }

  // Grounded answer from verified knowledge base
  const entry = retrieval.topMatch;
  let reply = entry.detailedAnswer;

  // If user asked a short targeted question, ensure exact framing
  return {
    reply,
    sources: retrieval.sources,
    intent: retrieval.intent,
    confidence: retrieval.confidence,
    isVerified: true,
    suggestedQuestions: entry.suggestedFollowUps
  };
}
