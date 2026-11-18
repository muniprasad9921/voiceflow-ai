"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Headphones,
  Sparkles,
  User,
  Clock,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ConversationItem {
  id: string;
  session_id: string;
  status: "active" | "escalated" | "resolved" | "closed";
  visitor_name?: string;
  visitor_email?: string;
  visitor_phone?: string;
  last_message_at: string;
  created_at: string;
  chat_messages?: Array<{
    id: string;
    sender_type: "user" | "assistant" | "system";
    content: string;
    is_verified?: boolean;
    feedback?: string;
    created_at: string;
  }>;
}

interface EscalationItem {
  id: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone?: string;
  message: string;
  status: "pending" | "in_review" | "resolved" | "closed";
  created_at: string;
}

export function AdminChatManager() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [escalations, setEscalations] = useState<EscalationItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedConv, setSelectedConv] = useState<ConversationItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/chat/admin?status=${filterStatus}&search=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations || []);
        setEscalations(data.escalations || []);
        if (data.conversations && data.conversations.length > 0 && !selectedConv) {
          setSelectedConv(data.conversations[0]);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch admin chat records:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [filterStatus]);

  const handleMarkResolved = async (convId: string) => {
    try {
      await fetch("/api/chat/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: convId, status: "resolved" })
      });
      setConversations(prev =>
        prev.map(c => (c.id === convId ? { ...c, status: "resolved" } : c))
      );
      if (selectedConv?.id === convId) {
        setSelectedConv(prev => (prev ? { ...prev, status: "resolved" } : null));
      }
    } catch (err) {
      console.error("Resolve error:", err);
    }
  };

  // Demo fallback data if database is empty yet
  const displayConversations: ConversationItem[] = conversations.length > 0 ? conversations : [
    {
      id: "demo-conv-1",
      session_id: "sess_visitor_8291",
      status: "escalated",
      visitor_name: "Rahul Verma",
      visitor_email: "rahul.verma@realtyplus.in",
      visitor_phone: "+91 98765 43210",
      last_message_at: "2026-11-18T10:45:00.000Z",
      created_at: "2026-11-18T10:30:00.000Z",
      chat_messages: [
        {
          id: "m1",
          sender_type: "user",
          content: "Can VoiceFlow AI integrate with our custom real estate CRM via webhooks?",
          created_at: "2026-11-18T10:30:00.000Z",
          is_verified: true
        },
        {
          id: "m2",
          sender_type: "assistant",
          content: "Yes, VoiceFlow AI provides bi-directional webhook triggers and custom REST API endpoints that integrate seamlessly with proprietary CRM platforms.",
          created_at: "2026-11-18T10:31:00.000Z",
          is_verified: true,
          feedback: "helpful"
        },
        {
          id: "m3",
          sender_type: "user",
          content: "I want an enterprise demo for 50 agents. Can someone call me today?",
          created_at: "2026-11-18T10:44:00.000Z",
          is_verified: true
        },
        {
          id: "m4",
          sender_type: "assistant",
          content: "I don't have verified information about today's live call scheduling. Please contact our support team and we'll help you.",
          created_at: "2026-11-18T10:45:00.000Z",
          is_verified: false
        }
      ]
    },
    {
      id: "demo-conv-2",
      session_id: "sess_visitor_4412",
      status: "resolved",
      visitor_name: "Dr. Ananya Rao",
      visitor_email: "ananya@medicare.org",
      last_message_at: "2026-11-18T09:00:00.000Z",
      created_at: "2026-11-18T08:30:00.000Z",
      chat_messages: [
        {
          id: "m10",
          sender_type: "user",
          content: "What are your pricing plans?",
          created_at: "2026-11-18T08:30:00.000Z"
        },
        {
          id: "m11",
          sender_type: "assistant",
          content: "VoiceFlow AI offers Starter (₹4,999/mo), Growth (₹14,999/mo), and Enterprise (₹39,999/mo) plans with fair per-second billing.",
          created_at: "2026-11-18T08:31:00.000Z",
          is_verified: true,
          feedback: "helpful"
        }
      ]
    }
  ];

  const currentSelection = selectedConv || displayConversations[0];

  return (
    <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              AI Chat Support & Visitor Intelligence
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Live monitor for website visitor conversations, intent analysis, unanswered queries, and support escalations.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchConversations}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Refresh conversations"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-500 mr-2" />
              <input
                type="text"
                placeholder="Search visitor/email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchConversations()}
                className="bg-transparent border-none text-slate-200 placeholder:text-slate-500 focus:outline-none w-36 sm:w-48"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800 min-h-[420px]">
          {/* Conversation List */}
          <div className="divide-y divide-slate-800/60 max-h-[480px] overflow-y-auto">
            {displayConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={`p-3.5 cursor-pointer transition-colors ${
                  currentSelection?.id === conv.id
                    ? "bg-purple-950/30 border-l-2 border-purple-500"
                    : "hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-slate-200 truncate max-w-[150px]">
                    {conv.visitor_name || conv.visitor_email || conv.session_id.substring(0, 14)}
                  </span>
                  <Badge
                    className={`text-[10px] px-1.5 py-0 border ${
                      conv.status === "escalated"
                        ? "bg-amber-950/60 text-amber-300 border-amber-800/60"
                        : conv.status === "resolved"
                        ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/60"
                        : "bg-purple-950/60 text-purple-300 border-purple-800/60"
                    }`}
                  >
                    {conv.status.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-1 mb-1.5">
                  {conv.chat_messages && conv.chat_messages.length > 0
                    ? conv.chat_messages[conv.chat_messages.length - 1].content
                    : "New conversation initiated"}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(conv.last_message_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                  <span>{conv.chat_messages?.length || 0} messages</span>
                </div>
              </div>
            ))}
          </div>

          {/* Conversation Detail View */}
          <div className="md:col-span-2 flex flex-col justify-between max-h-[480px]">
            {currentSelection ? (
              <>
                {/* Detail Header */}
                <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">
                      Session: {currentSelection.session_id}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {currentSelection.visitor_email || "Anonymous Visitor"}
                      {currentSelection.visitor_phone ? ` • ${currentSelection.visitor_phone}` : ""}
                    </p>
                  </div>
                  {currentSelection.status !== "resolved" && (
                    <button
                      onClick={() => handleMarkResolved(currentSelection.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-900/40 hover:bg-emerald-800/50 text-emerald-300 border border-emerald-700/40 text-xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Resolved
                    </button>
                  )}
                </div>

                {/* Message Stream */}
                <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-slate-950/30">
                  {currentSelection.chat_messages?.map((msg, i) => (
                    <div
                      key={msg.id || i}
                      className={`flex flex-col ${
                        msg.sender_type === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`flex items-start gap-2 max-w-[85%] ${
                          msg.sender_type === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                            msg.sender_type === "user"
                              ? "bg-slate-800 text-slate-200"
                              : "bg-purple-600 text-white"
                          }`}
                        >
                          {msg.sender_type === "user" ? (
                            <User className="w-3 h-3" />
                          ) : (
                            <Sparkles className="w-3 h-3" />
                          )}
                        </div>

                        <div
                          className={`p-2.5 rounded-xl text-xs ${
                            msg.sender_type === "user"
                              ? "bg-purple-700 text-white"
                              : "bg-slate-900 border border-slate-800 text-slate-100"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>

                          {/* Verification Badge */}
                          {msg.sender_type === "assistant" && (
                            <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-slate-800 text-[10px]">
                              {msg.is_verified ? (
                                <span className="text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Grounded in Knowledge Base
                                </span>
                              ) : (
                                <span className="text-amber-400 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> Unverified Query (Escalation Prompted)
                                </span>
                              )}
                              {msg.feedback && (
                                <span className="text-slate-400 flex items-center gap-1 ml-auto">
                                  {msg.feedback === "helpful" ? (
                                    <ThumbsUp className="w-2.5 h-2.5 text-emerald-400" />
                                  ) : (
                                    <ThumbsDown className="w-2.5 h-2.5 text-rose-400" />
                                  )}
                                  Visitor feedback: {msg.feedback}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 px-1">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center justify-center h-full">
                <MessageSquare className="w-8 h-8 mb-2 opacity-40" />
                Select a conversation from the left to inspect transcripts.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
