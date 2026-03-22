/**
 * @shared/utils — Cross-cutting utilities with NO business logic.
 *
 * ⚠️ Rules:
 *   - NO domain-specific logic
 *   - Only logging, tracing, and generic helpers
 *   - All changes require ARB approval
 */

// ─── Structured Logger ─────────────────────────────────────────

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  correlationId?: string;
  service?: string;
  context?: Record<string, unknown>;
}

export function createLogger(service: string) {
  const log = (level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry => {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      service,
      context,
    };
    // In production, pipe to structured logging (ELK, Datadog, etc.)
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](JSON.stringify(entry));
    return entry;
  };

  return {
    debug: (msg: string, ctx?: Record<string, unknown>) => log('debug', msg, ctx),
    info: (msg: string, ctx?: Record<string, unknown>) => log('info', msg, ctx),
    warn: (msg: string, ctx?: Record<string, unknown>) => log('warn', msg, ctx),
    error: (msg: string, ctx?: Record<string, unknown>) => log('error', msg, ctx),
  };
}

// ─── Correlation ID ────────────────────────────────────────────

export function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// ─── Retry Helper ──────────────────────────────────────────────

export interface RetryOptions {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_RETRY: RetryOptions = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {},
): Promise<T> {
  const opts = { ...DEFAULT_RETRY, ...options };
  let lastError: unknown;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < opts.maxRetries) {
        const delay = Math.min(opts.baseDelayMs * 2 ** attempt, opts.maxDelayMs);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
