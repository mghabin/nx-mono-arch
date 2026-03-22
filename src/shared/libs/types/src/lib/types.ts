/**
 * @shared/types — Shared primitive types and cross-team event definitions.
 *
 * ⚠️ Rules:
 *   - NO business logic
 *   - NO domain-specific types
 *   - Only primitives, events, and cross-cutting concerns
 *   - All changes require ARB approval
 */

// ─── Primitive Types ───────────────────────────────────────────

export type UUID = string;
export type ISO8601 = string;
export type Email = string;
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AED';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  correlationId: string;
}

export type Result<T, E = ApiError> = { success: true; data: T } | { success: false; error: E };

// ─── Domain Events ─────────────────────────────────────────────

export interface DomainEvent<T = unknown> {
  eventId: UUID;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  timestamp: ISO8601;
  version: number;
  source: string;
  correlationId: string;
  payload: T;
}

// ─── Health Check ──────────────────────────────────────────────

export interface LivenessResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: ISO8601;
  uptime: number;
}

export interface ReadinessResponse {
  status: 'ready' | 'not_ready';
  timestamp: ISO8601;
  checks: Record<string, 'ok' | 'error'>;
}
