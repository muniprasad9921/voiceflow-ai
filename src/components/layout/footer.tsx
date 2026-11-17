"use client";

import Link from "next/link";
import { Bot, ExternalLink } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "AI Voice Employees", href: "/features" },
    { label: "Agent Studio", href: "/features#studio" },
    { label: "Outbound Calling", href: "/features#outbound" },
    { label: "Inbound Calling", href: "/features#inbound" },
    { label: "Bulk Campaigns", href: "/features#campaigns" },
    { label: "Integrations", href: "/features#integrations" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Industries", href: "/industries" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Blog", href: "/blog" },
    { label: "Help Center", href: "/help" },
    { label: "API Reference", href: "/docs/api" },
    { label: "Status", href: "/status" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "TRAI Compliance", href: "/compliance" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold text-white">VoiceFlow</span>
                <span className="text-xs font-semibold text-indigo-400 tracking-widest uppercase">AI</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-5 text-slate-500">
              AI voice employees that call leads, book appointments, and qualify customers — 24/7 in 12 languages.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors text-xs font-bold text-slate-400 hover:text-white">
                X
              </a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors text-xs font-bold text-slate-400 hover:text-white">
                in
              </a>
              <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <div className="text-white font-semibold text-sm mb-4">{section}</div>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-slate-800 pt-10 pb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-white font-medium mb-1">Stay updated</div>
              <div className="text-sm text-slate-500">Get product updates, tips, and AI calling best practices.</div>
            </div>
            <form className="flex gap-2 w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            © 2026 VoiceFlow AI Technologies Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-xs text-slate-700">
            Made with ❤️ in India · Compliant with TRAI DLT regulations
          </p>
        </div>
      </div>
    </footer>
  );
}
