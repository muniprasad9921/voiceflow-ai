"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  Minus,
  Send,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  RefreshCw,
  User,
  AlertCircle,
  HelpCircle,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { ChatMessage, KnowledgeSource } from "@/types/chat";

const DEFAULT_SUGGESTED_QUESTIONS = [
  "What is VoiceFlow AI?",
  "What services do you provide?",
  "How does AI voice calling work?",
  "What are your pricing plans?",
  "How can I get started?",
  "How can I contact support?",
];

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(
    DEFAULT_SUGGESTED_QUESTIONS
  );
  const [showEscalation, setShowEscalation] = useState(false);
  const [escalationForm, setEscalationForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [escalationStatus, setEscalationStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [escalationResultMsg, setEscalationResultMsg] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize or restore session
  useEffect(() => {
    let existingSession = localStorage.getItem("vf_chat_session_id");
    if (!existingSession) {
      existingSession = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("vf_chat_session_id", existingSession);
    }
    setSessionId(existingSession);

    // Initial welcome message
    const welcomeMsg: ChatMessage = {
      id: "welcome-1",
      conversation_id: "init",
      sender_type: "assistant",
      content:
        "Hi! Welcome to VoiceFlow AI 👋 I'm your AI assistant. How can I help you today?",
      created_at: new Date().toISOString(),
      is_verified: true,
    };
    setMessages([welcomeMsg]);
  }, []);

  // Auto-scroll to bottom on message updates
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen, showEscalation]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      conversation_id: conversationId || "init",
      sender_type: "user",
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationId,
          sessionId,
          history: messages.slice(-6).map((m) => ({
            sender_type: m.sender_type,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to receive response");
      }

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      const assistantMsg: ChatMessage = {
        id: data.messageId || `asst-${Date.now()}`,
        conversation_id: data.conversationId,
        sender_type: "assistant",
        content: data.reply,
        sources: data.sources,
        intent: data.intent,
        confidence: data.confidence,
        is_verified: data.isVerified,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (data.suggestedQuestions && data.suggestedQuestions.length > 0) {
        setSuggestedQuestions(data.suggestedQuestions);
      }
    } catch (err: unknown) {
      const errText =
        err instanceof Error ? err.message : "Connection interrupted.";
      setErrorMessage(
        "Unable to reach the assistant. Please check your connection or contact support@voiceflow.ai."
      );
      const fallbackAssistantMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        conversation_id: conversationId || "init",
        sender_type: "assistant",
        content:
          "I experienced a momentary connection interruption. Please try again or reach out to support@voiceflow.ai.",
        created_at: new Date().toISOString(),
        is_verified: false,
      };
      setMessages((prev) => [...prev, fallbackAssistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = async (
    messageId: string,
    feedback: "helpful" | "unhelpful"
  ) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedback } : m))
    );

    try {
      await fetch("/api/chat/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, feedback }),
      });
    } catch (err) {
      console.warn("Feedback save error:", err);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        conversation_id: "init",
        sender_type: "assistant",
        content:
          "Chat cleared! Hi, how else can I help you today with VoiceFlow AI?",
        created_at: new Date().toISOString(),
        is_verified: true,
      },
    ]);
    setSuggestedQuestions(DEFAULT_SUGGESTED_QUESTIONS);
    setErrorMessage(null);
    setShowEscalation(false);
  };

  const handleEscalationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalationForm.name || !escalationForm.email || !escalationForm.message) {
      return;
    }

    setEscalationStatus("submitting");
    try {
      const res = await fetch("/api/chat/escalate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          ...escalationForm,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit escalation");
      }

      setEscalationStatus("success");
      setEscalationResultMsg(data.message);

      // Add a confirmation message to chat
      const confirmMsg: ChatMessage = {
        id: `esc-${Date.now()}`,
        conversation_id: conversationId || "init",
        sender_type: "assistant",
        content: `✅ ${data.message}`,
        created_at: new Date().toISOString(),
        is_verified: true,
      };
      setMessages((prev) => [...prev, confirmMsg]);
      setTimeout(() => {
        setShowEscalation(false);
        setEscalationStatus("idle");
        setEscalationForm({ name: "", email: "", phone: "", message: "" });
      }, 3500);
    } catch (err: unknown) {
      setEscalationStatus("error");
      setEscalationResultMsg(
        err instanceof Error
          ? err.message
          : "Submission failed. Please email support@voiceflow.ai."
      );
    }
  };

  return (
    <>
      {/* 1. Floating AI Chat Launcher Button (Strictly Fixed at Bottom-Right Corner) */}
      <div
        className="fixed bottom-6 right-6 sm:bottom-6 sm:right-6 max-sm:bottom-4 max-sm:right-4 z-[9999] pointer-events-auto"
        style={{ position: "fixed" }}
      >
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Chat Support"
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 text-white shadow-[0_0_25px_rgba(168,85,247,0.55)] hover:shadow-[0_0_35px_rgba(217,70,239,0.75)] hover:scale-105 active:scale-95 transition-all duration-300 ease-out cursor-pointer"
          >
            {/* Subtle rotating glow ring on hover */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-300" />

            {/* Sparkles / Bot Icon */}
            <Sparkles className="w-6 h-6 animate-pulse transition-transform duration-300 group-hover:rotate-12" />

            {/* Online Pulse Badge */}
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950" />
            </span>
          </button>
        )}
      </div>

      {/* 2. Chat Window (Slides Upward Above Bottom-Right Corner) */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 max-sm:bottom-4 max-sm:right-4 z-[9999] w-[400px] max-w-[calc(100vw-32px)] h-[600px] max-h-[85vh] flex flex-col bg-slate-950/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(168,85,247,0.25)] overflow-hidden transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-5"
          style={{ position: "fixed" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/60 border-b border-purple-500/20 select-none">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 text-white shadow-md">
                <Sparkles className="w-4 h-4" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                  VoiceFlow AI Assistant
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    AI
                  </span>
                </h3>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online | Ready to help
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Refresh / Clear Chat */}
              <button
                onClick={handleClearChat}
                title="Clear Chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Minimize */}
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize Chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender_type === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[88%] ${
                    msg.sender_type === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  {msg.sender_type === "assistant" && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs shadow-sm mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {msg.sender_type === "user" && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className="group relative flex flex-col">
                    <div
                      className={`px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed rounded-2xl break-words whitespace-pre-wrap ${
                        msg.sender_type === "user"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none shadow-md shadow-purple-950/40"
                          : "bg-slate-900/90 border border-slate-800 text-slate-100 rounded-bl-none shadow-sm"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Sources Badge (if assistant and verified) */}
                    {msg.sender_type === "assistant" &&
                      msg.sources &&
                      msg.sources.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1.5 ml-1 flex-wrap">
                          <span className="text-[10px] text-slate-400">
                            Verified Source:
                          </span>
                          {msg.sources.map((s, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950/50 border border-purple-800/40 text-purple-300 font-medium"
                            >
                              {s.title}
                            </span>
                          ))}
                        </div>
                      )}

                    {/* Actions Row for Assistant Messages */}
                    {msg.sender_type === "assistant" && msg.id !== "welcome-1" && (
                      <div className="flex items-center gap-2 mt-1.5 ml-1 text-slate-400 text-xs">
                        {/* Copy */}
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="flex items-center gap-1 hover:text-white transition-colors"
                          title="Copy answer"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span className="text-[10px]">
                            {copiedId === msg.id ? "Copied" : "Copy"}
                          </span>
                        </button>

                        {/* Feedback */}
                        <span className="text-slate-600">•</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleFeedback(msg.id, "helpful")}
                            className={`p-1 rounded hover:text-emerald-400 transition-colors ${
                              msg.feedback === "helpful"
                                ? "text-emerald-400"
                                : ""
                            }`}
                            title="Helpful"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, "unhelpful")}
                            className={`p-1 rounded hover:text-rose-400 transition-colors ${
                              msg.feedback === "unhelpful"
                                ? "text-rose-400"
                                : ""
                            }`}
                            title="Not helpful"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timestamp */}
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-xs">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-none bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            {/* Error Banner if any */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Escalation Form Drawer */}
            {showEscalation && (
              <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-500/30 text-xs text-slate-200 space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-purple-300 font-medium">
                    <Headphones className="w-4 h-4" />
                    <span>Escalate to Human Support</span>
                  </div>
                  <button
                    onClick={() => setShowEscalation(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Our live support team will review your inquiry and follow up
                  via email. Please provide your details below:
                </p>

                <form onSubmit={handleEscalationSubmit} className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={escalationForm.name}
                    onChange={(e) =>
                      setEscalationForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email *"
                    value={escalationForm.email}
                    onChange={(e) =>
                      setEscalationForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={escalationForm.phone}
                    onChange={(e) =>
                      setEscalationForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder="How can we assist you? *"
                    value={escalationForm.message}
                    onChange={(e) =>
                      setEscalationForm((p) => ({
                        ...p,
                        message: e.target.value,
                      }))
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                  />

                  {escalationStatus === "error" && (
                    <p className="text-rose-400 text-[10px]">
                      {escalationResultMsg}
                    </p>
                  )}
                  {escalationStatus === "success" && (
                    <p className="text-emerald-400 text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Request submitted!
                    </p>
                  )}

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowEscalation(false)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={escalationStatus === "submitting"}
                      className="px-3 py-1 rounded bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium disabled:opacity-50"
                    >
                      {escalationStatus === "submitting"
                        ? "Submitting..."
                        : "Submit Request"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Suggested Question Chips */}
            {suggestedQuestions.length > 0 && !showEscalation && (
              <div className="pt-2">
                <p className="text-[11px] text-slate-400 mb-2 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-purple-400" /> Suggested
                  questions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-left text-xs px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-purple-950/70 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-white transition-all duration-200 cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Controls & Input Area */}
          <div className="p-3 bg-slate-900/80 border-t border-purple-500/20 space-y-2">
            {/* Quick Actions Bar */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Press Enter to send</span>
              <button
                type="button"
                onClick={() => setShowEscalation((prev) => !prev)}
                className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Headphones className="w-3 h-3" />
                <span>Talk to a Human</span>
              </button>
            </div>

            {/* Input & Send Button */}
            <div className="flex items-end gap-2 bg-slate-950 border border-slate-800 focus-within:border-purple-500/60 rounded-xl px-3 py-1.5 transition-colors">
              <textarea
                ref={inputRef}
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none max-h-24 py-1"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send message"
                className="flex-shrink-0 p-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
