# Platform Team

> Owns cross-cutting infrastructure services — authentication, observability, messaging, configuration, and developer experience.

> 📋 **Note**: This README documents the **target architecture**. Services and libraries listed below are created incrementally using Nx generators as the platform grows.

## Service Inventory

| Path                         | Type     | Suffix       | Description                                            |
| ---------------------------- | -------- | ------------ | ------------------------------------------------------ |
| `apps/api-gateway/`          | Gateway  | `*-gateway`  | API Gateway / reverse proxy (rate limiting, routing)   |
| `apps/identity-provider/`    | API      | `*-provider` | Auth service (OAuth2, OIDC, SSO, MFA)                  |
| `apps/notification-service/` | Service  | `*-service`  | Multi-channel notifications (email, SMS, push, in-app) |
| `apps/audit-logger/`         | Consumer | `*-logger`   | Subscribes to all domain events, writes audit trail    |
| `apps/config-service/`       | API      | `*-service`  | Dynamic configuration, feature flags, A/B tests        |
| `apps/file-service/`         | API      | `*-service`  | File upload, storage, CDN management                   |
| `apps/search-service/`       | API      | `*-service`  | Search aggregation (Elasticsearch, Algolia)            |
| `apps/email-worker/`         | Worker   | `*-worker`   | Email rendering & delivery (MJML, SendGrid)            |
| `apps/sms-worker/`           | Worker   | `*-worker`   | SMS delivery (Twilio, SNS)                             |

## Library Inventory

| Path                    | Import Path                 | Purpose                                             |
| ----------------------- | --------------------------- | --------------------------------------------------- |
| `libs/core/`            | `@platform/core`            | Health checks, service metadata, env config         |
| `libs/auth/`            | `@platform/auth`            | JWT validation, RBAC guards, session management     |
| `libs/messaging/`       | `@platform/messaging`       | Event bus abstraction (publish, subscribe, schemas) |
| `libs/observability/`   | `@platform/observability`   | Structured logging, distributed tracing, metrics    |
| `libs/config/`          | `@platform/config`          | Config loading, validation, feature flag client     |
| `libs/cache/`           | `@platform/cache`           | Redis/caching abstractions                          |
| `libs/storage/`         | `@platform/storage`         | File storage abstraction (S3, GCS, Azure Blob)      |
| `libs/rate-limiting/`   | `@platform/rate-limiting`   | Rate limiting middleware                            |
| `libs/circuit-breaker/` | `@platform/circuit-breaker` | Circuit breaker pattern implementation              |
| `libs/testing/`         | `@platform/testing`         | Platform test utilities, test containers            |

## Who Works Here

- **Platform engineers** — Infrastructure services, cross-cutting concerns
- **SRE / DevOps** — Observability, gateway configuration, scaling
- **Security engineers** — Identity provider, audit logging, RBAC

## Dependencies

- `@shared/types` — Primitives (UUID, ISO8601, DomainEvent)
- `@shared/utils` — Logger, retry, correlation ID

## Tests

| Path                 | Type        | Purpose                                    |
| -------------------- | ----------- | ------------------------------------------ |
| `tests/contract/`    | Contract    | Gateway routing contract tests             |
| `tests/integration/` | Integration | Auth flows, message broker, cache          |
| `tests/e2e/`         | E2E         | Full auth flow (register → login → access) |
| `tests/load/`        | Load        | Gateway throughput, auth service latency   |
| `tests/smoke/`       | Smoke       | Post-deploy health check verification      |

## Getting Started

```bash
# Start the API gateway
pnpm nx serve api-gateway

# Start the identity provider
pnpm nx serve identity-provider

# Run platform library tests
pnpm nx test @platform/core
pnpm nx test @platform/auth
```
