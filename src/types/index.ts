// ============================================================
// VoiceFlow AI – Central type exports
// ============================================================
// Re-exports everything from database.ts and adds higher-level
// app-specific types used across the UI and API layers.
// ============================================================

export type { Database, Json } from './database'

// ── Enum types ──────────────────────────────────────────────
export type {
  OrgMemberRole,
  AgentStatus,
  PhoneNumberType,
  LeadStatus,
  CampaignStatus,
  CampaignType,
  CallDirection,
  CallStatus,
  DocumentContentType,
  DocumentStatus,
  WalletTransactionType,
  SubscriptionPlan,
} from './database'

// ── Row / DTO helpers ────────────────────────────────────────
export type { Row, InsertDto, UpdateDto } from './database'

// ── Named row types ──────────────────────────────────────────
export type {
  Profile,
  Organization,
  OrganizationMember,
  AIAgent,
  PhoneNumber,
  Contact,
  Lead,
  Campaign,
  Call,
  KnowledgeBase,
  KnowledgeDocument,
  Wallet,
  WalletTransaction,
  Subscription,
  Notification,
  AuditLog,
} from './database'

// ============================================================
// App-specific types
// ============================================================

/** Supabase auth session user shape (simplified) */
export interface AuthUser {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
}

/** Active org context stored in session / zustand */
export interface ActiveOrg {
  id: string
  name: string
  slug: string
  logo_url: string | null
  role: OrgMemberRole
  plan: SubscriptionPlan
  is_active: boolean
}

/** Generic paginated API response */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  has_more: boolean
}

/** Generic API error */
export interface ApiError {
  code: string
  message: string
  details?: unknown
}

/** Generic API success/error wrapper */
export type ApiResponse<T> =
  | { success: true; data: T; error?: never }
  | { success: false; error: ApiError; data?: never }

// ── Dashboard stats ──────────────────────────────────────────
export interface DashboardStats {
  total_calls: number
  total_duration_seconds: number
  total_contacts: number
  active_campaigns: number
  total_agents: number
  wallet_balance: number
  calls_today: number
  calls_this_week: number
  calls_this_month: number
  avg_call_duration_seconds: number
  conversion_rate: number
}

// ── Call analytics ───────────────────────────────────────────
export interface CallAnalytics {
  date: string
  total: number
  completed: number
  failed: number
  no_answer: number
  duration_seconds: number
}

// ── Campaign progress ────────────────────────────────────────
export interface CampaignProgress {
  total_contacts: number
  called: number
  completed: number
  failed: number
  pending: number
  percentage: number
}

// ── Knowledge base with document count ──────────────────────
export interface KnowledgeBaseWithCount {
  id: string
  name: string
  description: string | null
  document_count: number
  created_at: string
  updated_at: string
}

// ── Notification types ───────────────────────────────────────
export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'call_completed'
  | 'campaign_started'
  | 'campaign_ended'
  | 'payment_received'
  | 'low_balance'

// ── Sidebar navigation item ──────────────────────────────────
export interface NavItem {
  title: string
  href: string
  icon?: string
  badge?: string | number
  disabled?: boolean
  external?: boolean
  children?: NavItem[]
}

// ── Table column definition ──────────────────────────────────
export interface TableColumn<T = unknown> {
  key: keyof T | string
  label: string
  sortable?: boolean
  hidden?: boolean
  width?: string | number
}

// ── Filter / sort state ──────────────────────────────────────
export interface TableFilters {
  search?: string
  status?: string
  page?: number
  per_page?: number
  sort_by?: string
  sort_dir?: 'asc' | 'desc'
  [key: string]: unknown
}

// ── Upload progress ──────────────────────────────────────────
export interface UploadProgress {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'done' | 'error'
  error?: string
  url?: string
}

// ── Retell AI types ──────────────────────────────────────────
export interface RetellCallWebhookPayload {
  event: string
  call_id: string
  agent_id: string
  call_status: string
  start_timestamp?: number
  end_timestamp?: number
  duration_ms?: number
  transcript?: string
  recording_url?: string
  metadata?: Record<string, unknown>
}

// Re-export OrgMemberRole for use in types without importing from database
type OrgMemberRole = import('./database').OrgMemberRole
type SubscriptionPlan = import('./database').SubscriptionPlan
