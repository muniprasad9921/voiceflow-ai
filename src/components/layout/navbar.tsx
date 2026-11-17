"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Zap,
  BarChart3,
  Globe2,
  Users,
  Bot,
  BookOpen,
  FileText,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

const productLinks = [
  {
    label: "AI Voice Employees",
    description: "Deploy autonomous calling agents 24/7",
    href: "/product/voice-employees",
    icon: Bot,
  },
  {
    label: "Smart Dialer",
    description: "Intelligent outbound calling at scale",
    href: "/product/smart-dialer",
    icon: Zap,
  },
  {
    label: "Analytics Dashboard",
    description: "Real-time call insights and reporting",
    href: "/product/analytics",
    icon: BarChart3,
  },
  {
    label: "CRM Integrations",
    description: "Connect with your existing workflow",
    href: "/product/integrations",
    icon: Users,
  },
];

const featureLinks = [
  {
    label: "Multi-Language AI",
    description: "12 Indian languages supported",
    href: "/features#multilanguage",
    icon: Globe2,
  },
  {
    label: "Lead Qualification",
    description: "Score and prioritize leads automatically",
    href: "/features#qualification",
    icon: Users,
  },
  {
    label: "Voice Customization",
    description: "Human-like voices for your brand",
    href: "/features#voice",
    icon: Zap,
  },
];

const resourceLinks = [
  { label: "Documentation", description: "Guides and API references", href: "/docs", icon: BookOpen },
  { label: "Blog", description: "Tips, updates and case studies", href: "/blog", icon: FileText },
  { label: "Help Center", description: "FAQs and support resources", href: "/help", icon: HelpCircle },
];

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Industries", href: "/industries" },
  { label: "Pricing", href: "/pricing" },
];

function WaveformLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow duration-300">
        <div className="flex items-end gap-0.5 h-5 px-1">
          {[3, 5, 7, 5, 3].map((h, i) => (
            <div
              key={i}
              className="wave-bar w-1 rounded-full bg-white"
              style={{ height: `${h * 2}px` }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          VoiceFlow
        </span>
        <span className="text-xs font-semibold text-indigo-600 tracking-widest uppercase">
          AI
        </span>
      </div>
    </Link>
  );
}

function DropdownMenu({
  items,
  onClose,
}: {
  items: { label: string; description: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
  onClose: () => void;
}) {
  return (
    <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/60 dark:shadow-slate-900/60 border border-slate-100 dark:border-slate-800 overflow-hidden z-50">
      <div className="p-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 transition-colors">
                <Icon className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function NavItem({
  label,
  href,
  dropdown,
}: {
  label: string;
  href?: string;
  dropdown?: { label: string; description: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = href ? pathname.startsWith(href) : false;

  if (dropdown) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            open
              ? "text-indigo-600"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {label}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && <DropdownMenu items={dropdown} onClose={() => setOpen(false)} />}
      </div>
    );
  }

  return (
    <Link
      href={href!}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-950"
          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
      }`}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm shadow-slate-200/50 dark:shadow-slate-900/50 border-b border-slate-100 dark:border-slate-800"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <WaveformLogo />

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavItem label="Product" dropdown={productLinks} />
              <NavItem label="Features" dropdown={featureLinks} />
              {navLinks.map((link) => (
                <NavItem key={link.href} label={link.label} href={link.href} />
              ))}
              <NavItem label="Resources" dropdown={resourceLinks} />
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 duration-200"
              >
                Start Free Trial
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-slate-950 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <WaveformLogo />
              <button
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-1">
              {/* Product */}
              <div>
                <button
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => setMobileExpanded(mobileExpanded === "product" ? null : "product")}
                >
                  Product
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === "product" ? "rotate-180" : ""}`} />
                </button>
                {mobileExpanded === "product" && (
                  <div className="mt-1 ml-3 space-y-1">
                    {productLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <item.icon className="w-4 h-4 text-indigo-600" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Features */}
              <div>
                <button
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => setMobileExpanded(mobileExpanded === "features" ? null : "features")}
                >
                  Features
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === "features" ? "rotate-180" : ""}`} />
                </button>
                {mobileExpanded === "features" && (
                  <div className="mt-1 ml-3 space-y-1">
                    {featureLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <item.icon className="w-4 h-4 text-indigo-600" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Resources */}
              <div>
                <button
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => setMobileExpanded(mobileExpanded === "resources" ? null : "resources")}
                >
                  Resources
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === "resources" ? "rotate-180" : ""}`} />
                </button>
                {mobileExpanded === "resources" && (
                  <div className="mt-1 ml-3 space-y-1">
                    {resourceLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <item.icon className="w-4 h-4 text-indigo-600" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full px-4 py-3 rounded-xl text-sm font-medium text-center text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold hover:from-indigo-500 hover:to-violet-500 transition-all"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
