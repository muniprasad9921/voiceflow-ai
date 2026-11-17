import type { Metadata } from "next";
import React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "VoiceFlow AI — AI Voice Employees That Close Deals While You Sleep",
    template: "%s | VoiceFlow AI",
  },
  description:
    "Deploy AI voice employees that call leads, book appointments, qualify customers, and follow up — 24/7 in 12 languages. No missed calls. No burnout. Just results.",
  keywords: [
    "AI voice agent",
    "AI calling bot",
    "automated calling",
    "lead qualification",
    "appointment booking",
    "voice AI",
    "conversational AI",
    "sales automation",
    "Indian languages AI",
    "Telugu AI",
    "Hindi AI",
  ],
  authors: [{ name: "VoiceFlow AI" }],
  creator: "VoiceFlow AI",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://voiceflow.ai",
    siteName: "VoiceFlow AI",
    title: "VoiceFlow AI — AI Voice Employees That Close Deals While You Sleep",
    description:
      "Deploy AI voice employees that call leads, book appointments, qualify customers, and follow up — 24/7 in 12 languages.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VoiceFlow AI — AI Voice Employees",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceFlow AI — AI Voice Employees That Close Deals While You Sleep",
    description:
      "Deploy AI voice employees that call leads, book appointments, and qualify customers 24/7 in 12 languages.",
    creator: "@voiceflowai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="min-h-full flex flex-col antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
