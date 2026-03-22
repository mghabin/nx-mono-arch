/**
 * @platform/core — Platform team's core library.
 *
 * Provides foundational services used by all teams:
 *   - Health check helpers
 *   - Service metadata
 *   - Configuration loading
 */

import type { LivenessResponse, ReadinessResponse } from '@shared/types';

// ─── Service Metadata ──────────────────────────────────────────

export interface ServiceMetadata {
  name: string;
  version: string;
  team: string;
  environment: string;
}

export function createServiceMetadata(
  name: string,
  team: string,
  version = '0.0.0',
): ServiceMetadata {
  return {
    name,
    version,
    team,
    environment: process.env['NODE_ENV'] ?? 'development',
  };
}

// ─── Health Check Builder ──────────────────────────────────────

type HealthCheck = () => Promise<'ok' | 'error'>;

export class HealthCheckBuilder {
  private checks: Record<string, HealthCheck> = {};
  private startTime = Date.now();

  addCheck(name: string, check: HealthCheck): this {
    this.checks[name] = check;
    return this;
  }

  async liveness(): Promise<LivenessResponse> {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }

  async readiness(): Promise<ReadinessResponse> {
    const results: Record<string, 'ok' | 'error'> = {};

    for (const [name, check] of Object.entries(this.checks)) {
      try {
        results[name] = await check();
      } catch {
        results[name] = 'error';
      }
    }

    const allOk = Object.values(results).every((r) => r === 'ok');

    return {
      status: allOk ? 'ready' : 'not_ready',
      timestamp: new Date().toISOString(),
      checks: results,
    };
  }
}

// ─── Configuration ─────────────────────────────────────────────

export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}
