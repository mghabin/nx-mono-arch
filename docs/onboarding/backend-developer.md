# Backend Developer Onboarding

> Everything you need to start building APIs, workers, consumers, and services.

## Your Home Base

Your code lives in `src/teams/<your-team>/`. Each team owns a bounded context:

| Team     | Domain                         | Path                  |
| -------- | ------------------------------ | --------------------- |
| Orders   | Order lifecycle, payments      | `src/teams/orders/`   |
| Products | Catalog, inventory, pricing    | `src/teams/products/` |
| Platform | Auth, messaging, observability | `src/teams/platform/` |

## What You'll Build

| Type                 | Suffix           | What it does                                       |
| -------------------- | ---------------- | -------------------------------------------------- |
| **API**              | `*-api`          | HTTP/gRPC/GraphQL endpoints behind a load balancer |
| **Worker**           | `*-worker`       | Processes background jobs from a queue (Bull, SQS) |
| **Consumer**         | `*-consumer`     | Subscribes to events via pub/sub (Kafka, RabbitMQ) |
| **Orchestrator**     | `*-orchestrator` | Coordinates multi-step workflows (Temporal, sagas) |
| **Scheduler**        | `*-scheduler`    | Runs periodic/cron tasks                           |
| **Stream Processor** | `*-stream`       | Real-time stream processing (Kafka Streams)        |
| **Migration**        | `*-migration`    | Database schema migrations                         |

## Project Structure

```
src/teams/orders/
├── apps/
│   ├── order-api/           # Your API server
│   ├── order-worker/        # Background job processor
│   └── order-consumer/      # Event subscriber
├── libs/
│   ├── domain/              # Pure models, events, business rules (NO I/O)
│   ├── data-access/         # Repository pattern, database queries
│   ├── messaging/           # Event publishing helpers
│   ├── jobs/                # Job definitions (shared between worker/scheduler)
│   ├── contract/            # OpenAPI/Proto schema
│   └── sdk/                 # Client SDK for other teams
└── tests/
    ├── contract/            # Consumer-driven contract tests
    ├── integration/         # API + DB + broker tests
    ├── e2e/                 # Full flow tests
    └── load/                # k6 performance scripts
```

## Key Libraries You'll Use

| Import                    | Purpose                                      | Owner    |
| ------------------------- | -------------------------------------------- | -------- |
| `@shared/types`           | UUID, ISO8601, Currency, DomainEvent, Result | ARB      |
| `@shared/utils`           | Logger, retry, correlation ID                | ARB      |
| `@platform/core`          | Health checks, service metadata              | Platform |
| `@platform/messaging`     | Event bus (publish/subscribe)                | Platform |
| `@platform/observability` | Structured logging, tracing                  | Platform |
| `@platform/auth`          | JWT validation, RBAC guards                  | Platform |

## Common Tasks

```bash
# Generate a new library for your team
pnpm nx g @nx/js:lib src/teams/orders/libs/data-access --publishable --importPath=@orders/data-access

# Start your API locally
pnpm nx serve order-api

# Run your domain tests
pnpm nx test @orders/domain

# Run integration tests
pnpm nx test order-api --configuration=integration

# Type check your team's code
pnpm nx run-many -t typecheck --projects='@orders/*'
```

## Rules

1. **Domain libs are pure** — No I/O, no database, no HTTP in `libs/domain/`. Only models, events, and business rules.
2. **Use the SDK pattern** — Other teams consume your API via `@orders/sdk`, not by importing your internals.
3. **Events over direct calls** — Prefer publishing domain events over synchronous API calls between teams.
4. **Contract tests** — If another team depends on your API, write contract tests.
5. **Migrations are separate** — Database migrations run as a separate `*-migration` app, not inside your API.

## Next Steps

1. Read your team's `README.md` (e.g., `src/teams/orders/README.md`)
2. Review `ARCHITECTURE.md` for the full architecture
3. Check `tools/governance/policies/dependency-policy.md` for dependency rules
