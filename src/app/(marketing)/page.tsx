import Link from "next/link";
import {
  Bot,
  Phone,
  BarChart3,
  Globe2,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Building2,
  HeartPulse,
  GraduationCap,
  ShoppingCart,
  Car,
  Landmark,
  UtensilsCrossed,
  Briefcase,
  ChevronDown,
  MessageSquare,
  Target,
  TrendingUp,
  Shield,
  Layers,
  BookOpen,
} from "lucide-react";

// ── Stat ─────────────────────────────────────────────────────────────────────
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-white mb-1">{value}</div>
      <div className="text-indigo-200 text-sm">{label}</div>
    </div>
  );
}

// ── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
      <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-4 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-800/40 transition-colors">
        <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// ── Industry card ─────────────────────────────────────────────────────────────
function IndustryCard({
  icon: Icon,
  name,
  use,
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  use: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/40 dark:to-violet-900/40 flex items-center justify-center mb-3 group-hover:from-indigo-100 group-hover:to-violet-100 transition-colors">
        <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{name}</div>
      <div className="text-slate-500 dark:text-slate-400 text-xs">{use}</div>
    </div>
  );
}

// ── Pricing tier ─────────────────────────────────────────────────────────────
function PricingTier({
  name,
  price,
  description,
  features,
  highlight,
  cta,
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}) {
  return (
    <div
      className={`relative rounded-2xl p-8 border ${
        highlight
          ? "border-indigo-500 bg-gradient-to-b from-indigo-600 to-violet-700 shadow-2xl shadow-indigo-500/30"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
      }`}
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
            MOST POPULAR
          </span>
        </div>
      )}
      <div className={`text-sm font-semibold mb-1 ${highlight ? "text-indigo-200" : "text-indigo-600 dark:text-indigo-400"}`}>
        {name}
      </div>
      <div className={`text-4xl font-bold mb-1 ${highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>
        {price}
      </div>
      <div className={`text-sm mb-6 ${highlight ? "text-indigo-200" : "text-slate-500 dark:text-slate-400"}`}>
        {description}
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${highlight ? "text-indigo-200" : "text-indigo-500"}`} />
            <span className={`text-sm ${highlight ? "text-indigo-100" : "text-slate-600 dark:text-slate-300"}`}>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className={`block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all ${
          highlight
            ? "bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg"
            : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

// ── FAQ item ──────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-slate-100 dark:border-slate-700">
      <summary className="flex items-center justify-between py-5 cursor-pointer list-none">
        <span className="font-medium text-slate-900 dark:text-white">{q}</span>
        <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
      </summary>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed pb-5">{a}</p>
    </details>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const features = [
    { icon: Bot, title: "AI Voice Employees", description: "Autonomous agents that call leads, handle inbound queries, and book appointments — 24/7, no breaks, no sick days." },
    { icon: Globe2, title: "12 Indian Languages", description: "Converse naturally in Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, and more." },
    { icon: Target, title: "Smart Lead Qualification", description: "AI asks the right questions, scores leads by intent, and surfaces only the ones worth your team's time." },
    { icon: MessageSquare, title: "Automated Follow-ups", description: "Trigger WhatsApp messages, emails, or callbacks after each call based on outcome and AI-detected intent." },
    { icon: BarChart3, title: "Real-time Analytics", description: "Track answer rates, conversion rates, agent performance, and campaign ROI from one live dashboard." },
    { icon: Layers, title: "No-Code Integrations", description: "Connect your CRM, Google Calendar, Meta Lead Ads, Sheets, and 50+ tools in minutes — no developer needed." },
  ];

  const industries = [
    { icon: Building2, name: "Real Estate", use: "Lead qualification & site visit booking" },
    { icon: HeartPulse, name: "Healthcare", use: "Appointment scheduling & follow-ups" },
    { icon: GraduationCap, name: "Education", use: "Admissions counselling & enrollment" },
    { icon: Landmark, name: "Banking & Finance", use: "Loan leads & KYC assistance" },
    { icon: Shield, name: "Insurance", use: "Policy inquiry & premium renewal" },
    { icon: ShoppingCart, name: "E-commerce", use: "Order support & upsell campaigns" },
    { icon: Car, name: "Automobile", use: "Test drive booking & follow-up" },
    { icon: UtensilsCrossed, name: "Restaurants", use: "Table reservations & order support" },
    { icon: Briefcase, name: "Recruitment", use: "Candidate screening & interviews" },
    { icon: TrendingUp, name: "Enterprise Sales", use: "Outbound prospecting at scale" },
  ];

  const faqs = [
    { q: "What languages does VoiceFlow AI support?", a: "VoiceFlow AI currently supports English, Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, Bengali, Gujarati, and Punjabi — based on the capabilities of our integrated voice providers. We continuously add new languages as providers expand their offerings." },
    { q: "Will my customers know they're talking to an AI?", a: "Yes — and that's a legal and ethical requirement. VoiceFlow AI agents are configured to disclose they are AI-powered assistants at the start of every call. This also complies with TRAI guidelines on automated calls." },
    { q: "Can I customise what the AI says on each call?", a: "Absolutely. The Agent Studio lets you define the persona, instructions, qualification questions, conversation flow, and even the voice. You can also upload your business knowledge so the AI answers questions accurately." },
    { q: "How does billing work?", a: "You pay per minute of AI calling time, plus a monthly platform fee based on your plan. Credits are deducted from your wallet in real time. There are no hidden charges — you can see the per-call cost in your wallet history." },
    { q: "Is my customer data safe?", a: "All data is encrypted at rest and in transit. Each organisation's data is strictly isolated using Row Level Security in the database. We never use your customer data to train any AI models." },
    { q: "Can I try before I buy?", a: "Yes. The Free plan lets you create agents, simulate conversations in the testing playground, and explore the full dashboard. You only need to add credits when you're ready to run real calls." },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 pt-24 pb-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-indigo-300 text-xs font-medium">AI Voice Employees — Now in 12 Indian Languages</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
            Your AI Voice Employees
            <br />
            <span className="gradient-text">Work While You Sleep</span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Deploy AI agents that call leads, qualify prospects, book appointments, and follow up — 24/7, in your customers' language, at a fraction of human cost.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/signup"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-8 py-4 rounded-xl shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 text-lg"
            >
              Start Free — No Credit Card
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/features"
              className="flex items-center gap-2 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 font-medium px-8 py-4 rounded-xl transition-all text-lg"
            >
              See How It Works
            </Link>
          </div>

          {/* Language badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {["English", "हिन्दी", "తెలుగు", "தமிழ்", "ಕನ್ನಡ", "മലയാളം", "मराठी", "বাংলা", "ਪੰਜਾਬੀ", "ગુજરાતી"].map((lang) => (
              <span
                key={lang}
                className="bg-white/5 border border-white/10 text-slate-300 text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm"
              >
                {lang}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <StatCard value="10K+" label="Calls per day" />
            <StatCard value="12" label="Languages" />
            <StatCard value="< ₹2" label="Per minute" />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">How It Works</div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Go live in under 30 minutes</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">No engineering required. Set up your AI employee, upload your knowledge, and start calling.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent dark:via-indigo-800" />
            {[
              { n: "01", icon: Bot, title: "Create Your AI Employee", desc: "Name your agent, set its role, choose language, and describe its personality in plain English." },
              { n: "02", icon: BookOpen, title: "Add Your Knowledge", desc: "Upload FAQs, PDFs, your website URL, or type information. Your agent learns your business instantly." },
              { n: "03", icon: Phone, title: "Launch & Monitor", desc: "Import leads, run a campaign, and watch your AI make calls, qualify prospects, and book appointments in real time." },
            ].map(({ n, icon: Icon, title, desc }) => (
              <div key={n} className="text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/30 dark:to-violet-900/30 flex items-center justify-center mx-auto mb-5 border border-indigo-100 dark:border-indigo-800">
                  <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-xs font-bold text-indigo-400 tracking-widest mb-2">{n}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">Features</div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Everything your sales team needs — automated</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">Industries</div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Built for businesses like yours</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">Pre-built agent templates for every sector, ready to deploy in minutes.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {industries.map((i) => (
              <IndustryCard key={i.name} {...i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ANALYTICS PREVIEW ────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-indigo-950 to-violet-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">Analytics</div>
              <h2 className="text-4xl font-bold text-white mb-6">Know exactly what your AI is doing</h2>
              <p className="text-indigo-200 text-lg mb-8 leading-relaxed">
                Every call is recorded, transcribed, summarised, and analysed. See answer rates, conversion rates, campaign ROI, and agent performance — all in one dashboard.
              </p>
              <ul className="space-y-3">
                {["Call-level transcripts and AI summaries", "Agent performance rankings", "Cost per qualified lead", "Best-performing calling hours", "Language-wise conversion rates"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <span className="text-indigo-100">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fake dashboard card */}
            <div className="bg-slate-900/60 rounded-2xl border border-indigo-800/40 p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-white font-semibold">Campaign Performance</div>
                  <div className="text-indigo-400 text-xs">Last 7 days</div>
                </div>
                <div className="text-green-400 text-sm font-semibold">↑ 23%</div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[{ label: "Total Calls", value: "2,847" }, { label: "Qualified", value: "612" }, { label: "Booked", value: "184" }, { label: "Cost/Lead", value: "₹47" }].map((m) => (
                  <div key={m.label} className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-800/30">
                    <div className="text-indigo-300 text-xs mb-1">{m.label}</div>
                    <div className="text-white text-2xl font-bold">{m.value}</div>
                  </div>
                ))}
              </div>
              {/* Fake bar chart */}
              <div className="flex items-end gap-2 h-16">
                {[40, 65, 50, 80, 72, 90, 68].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-indigo-600 to-violet-500 opacity-80" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span key={d} className="text-indigo-500 text-xs">{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-3">Pricing</div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Start free, scale as you grow</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Pay only for what you use. No contracts. No surprises.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingTier
              name="Free"
              price="₹0"
              description="Forever free. No credit card."
              features={["1 AI employee", "Simulation / testing only", "50 demo calls", "1 knowledge base", "Basic analytics", "Email support"]}
              cta="Get Started Free"
            />
            <PricingTier
              name="Growth"
              price="₹4,999"
              description="per month + ₹1.5/min calling"
              highlight
              features={["5 AI employees", "Unlimited real calls", "Bulk campaigns", "5 knowledge bases", "CRM & calendar integrations", "WhatsApp follow-ups", "Priority support"]}
              cta="Start 14-day Trial"
            />
            <PricingTier
              name="Enterprise"
              price="Custom"
              description="For large teams and agencies"
              features={["Unlimited AI employees", "Dedicated infrastructure", "Custom integrations", "SLA guarantee", "TRAI compliance tools", "On-boarding & training", "Dedicated account manager"]}
              cta="Contact Sales"
            />
          </div>
          <p className="text-center text-slate-400 text-sm mt-8">All plans include end-to-end encryption, multi-tenant data isolation, and audit logs.</p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Frequently asked questions</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {faqs.map((f) => (
              <FaqItem key={f.q} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-violet-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-amber-300" />
            <span className="text-white text-sm font-medium">Join businesses already using VoiceFlow AI</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to hire your first<br />AI employee?
          </h2>
          <p className="text-indigo-200 text-xl mb-10">Start free today. Your first AI agent can be live and calling in under 30 minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-8 py-4 rounded-xl text-lg shadow-2xl shadow-indigo-900/30 transition-all hover:-translate-y-0.5"
            >
              Create Free Account
            </Link>
            <Link
              href="/contact"
              className="border border-white/30 text-white hover:border-white hover:bg-white/5 font-semibold px-8 py-4 rounded-xl text-lg transition-all"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

