# Enterprise Monorepo Architecture

> Scalable Nx monorepo template inspired by Google, Meta, Stripe architecture patterns.

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Architecture Principles](#architecture-principles)
4. [Team Ownership Model](#team-ownership-model)
5. [Package Publishing Rules](#package-publishing-rules)
6. [Technology Stack](#technology-stack)
7. [Microservices Patterns](#microservices-patterns)
8. [Anti-Corruption Pattern](#anti-corruption-pattern)
9. [Security & Compliance](#security--compliance)
10. [Governance](#governance)
11. [Infrastructure](#infrastructure)
12. [Implementation Plan](#implementation-plan)
13. [Risks & Mitigations](#risks--mitigations)

---

## Overview

This monorepo is designed to scale from a small team to 500-2000+ developers across multiple products and technologies:

- **Frontend**: Any framework (React, Vue, Angular, Svelte, etc.)
- **Backend**: Any runtime (.NET, Node, Go, Python, Java, Rust, etc.)
- **Mobile**: Any approach (Native, React Native, Flutter, Expo)
- **Infrastructure**: Any cloud (AWS, Azure, GCP, on-prem)
- **Package Manager**: pnpm (npm/yarn also supported)

> **Note**: This architecture is technology-agnostic. The examples above are just examples - add any Nx plugin to support your specific stack.

### Key Characteristics

| Characteristic   | Implementation                                     |
| ---------------- | -------------------------------------------------- |
| Team Ownership   | Each team owns their `src/teams/<name>/` directory |
| Bounded Contexts | No shared databases - each team owns their data    |
| API Contracts    | OpenAPI first with contract testing                |
| Security         | RBAC, audit logging, multi-layer scanning          |
| Compliance       | SOC2/GDPR ready from day one                       |

---

## Directory Structure

```
nx-mono-arch/
├── src/                                      # All source code
│   ├── teams/                                # Team-owned bounded contexts
│   │   ├── platform/                         # Platform & Infrastructure team
│   │   │   ├── apps/
│   │   │   │   ├── api-gateway/              # API Gateway (Node/.NET)
│   │   │   │   ├── identity-provider/        # Auth server
│   │   │   │   └── admin-portal/             # Internal admin tool
│   │   │   ├── libs/
│   │   │   │   ├── core/                     # @platform/core (published)
│   │   │   │   ├── config/                   # @platform/config (published)
│   │   │   │   ├── security/                 # @platform/security (RBAC, auth)
│   │   │   │   └── infra/                    # Internal only
│   │   │   └── packages/
│   │   │
│   │   ├── orders/                           # Orders bounded context
│   │   │   ├── apps/
│   │   │   │   └── order-service/            # .NET microservice
│   │   │   ├── libs/
│   │   │   │   ├── domain/                   # @orders/domain (published)
│   │   │   │   ├── data-access/              # Internal - owns DB
│   │   │   │   └── features/                 # Internal only
│   │   │   ├── packages/
│   │   │   │   └── api/                      # @orders/api (generated client)
│   │   │   └── tests/
│   │   │       └── contract/                 # Contract tests
│   │   │
│   │   ├── products/                         # Products bounded context
│   │   │   ├── apps/
│   │   │   │   └── product-service/          # .NET microservice
│   │   │   ├── libs/
│   │   │   │   ├── domain/                   # @products/domain
│   │   │   │   ├── data-access/              # Internal
│   │   │   │   └── features/                 # Internal
│   │   │   ├── packages/
│   │   │   │   └── api/                      # @products/api
│   │   │   └── tests/
│   │   │
│   │   ├── mobile/                           # Mobile team (cross-cutting)
│   │   │   ├── apps/
│   │   │   │   ├── consumer-app/             # Expo app
│   │   │   │   └── business-app/             # Expo app
│   │   │   ├── libs/
│   │   │   │   ├── features/                 # Mobile-specific features
│   │   │   │   └── adapters/                 # @teams/mobile/adapters
│   │   │   └── packages/
│   │   │
│   │   └── web/                              # Web team (cross-cutting)
│   │       ├── apps/
│   │       │   ├── customer-portal/          # React app
│   │       │   └── admin-dashboard/          # React app
│   │       ├── libs/
│   │       │   ├── features/                 # Web-specific features
│   │       │   └── adapters/                 # @teams/web/adapters (ACL)
│   │       └── packages/
│   │
│   ├── shared/                               # MINIMAL shared - primitives only
│   │   ├── libs/
│   │   │   ├── types/                        # @shared/types
│   │   │   │   ├── primitives/               # Basic types only
│   │   │   │   └── events/                   # Cross-team events
│   │   │   └── utils/                        # @shared/utils (no business logic)
│   │   │       ├── logging/                  # Structured logging
│   │   │       └── tracing/                  # Distributed tracing
│   │   └── packages/
│   │       └── api-client-generator/         # OpenAPI code generation
│   │
│   └── packages/                             # Top-level workspace packages
│
├── ops/                                      # Operational concerns
│   ├── infra/                                # Infrastructure as Code
│   │   ├── terraform/
│   │   │   ├── modules/                      # Reusable modules
│   │   │   │   ├── vpc/
│   │   │   │   ├── aks/
│   │   │   │   ├── app-service/
│   │   │   │   └── database/
│   │   │   ├── environments/
│   │   │   │   ├── dev/
│   │   │   │   ├── staging/
│   │   │   │   ├── prod-us/
│   │   │   │   ├── prod-eu/
│   │   │   │   └── prod-ap/
│   │   │   └── global/
│   │   │       ├── dns/
│   │   │       ├── cdn/
│   │   │       └── waf/
│   │   └── kubernetes/
│   │       ├── base/
│   │       └── environments/
│   ├── ci/                                   # CI/CD templates
│   │   ├── templates/
│   │   │   ├── dotnet.yml
│   │   │   ├── node.yml
│   │   │   └── mobile.yml
│   │   └── policies/
│   │       ├── branch-protection.yml
│   │       └── required-checks.yml
│   ├── compliance/                           # Compliance evidence
│   │   ├── soc2/
│   │   │   └── controls/
│   │   └── gdpr/
│   │       └── data-map/
│   └── scripts/                              # Automation scripts
│
├── docs/                                     # Documentation
│   ├── architecture/
│   │   ├── decision-records/                 # ADRs
│   │   └── api-contracts/
│   ├── onboarding/
│   │   ├── new-developer.md
│   │   └── team-setup.md
│   └── runbooks/
│       ├── incident-response.md
│       └── deployment-rollback.md
│
├── tools/                                    # Governance & dev tooling
│   ├── governance/                           # Architecture governance
│   │   ├── arb/                              # Architecture Review Board
│   │   │   ├── README.md
│   │   │   └── members.json
│   │   ├── rfc/                              # RFC process
│   │   │   ├── template.md
│   │   │   └── archive/
│   │   └── policies/                         # Team policies
│   │       ├── dependency-policy.md
│   │       ├── versioning-policy.md
│   │       └── testing-policy.md
│   ├── generators/                           # Nx custom generators
│   └── validators/                           # Custom linting rules
│
├── .github/                                  # GitHub Actions
│   └── workflows/
│       ├── ci.yml
│       ├── security.yml                  # (planned)
│       └── dependency-review.yml         # (planned)
│
└── [config files]                            # nx.json, package.json, tsconfig.*, etc.
```

### Design Philosophy

| Directory | Contains                                | Rationale                                        |
| --------- | --------------------------------------- | ------------------------------------------------ |
| `src/`    | All compilable source code              | Clear boundary: "if it compiles, it's in `src/`" |
| `ops/`    | Infrastructure, CI, compliance, scripts | Operational concerns separated from code         |
| `docs/`   | Documentation                           | Industry standard at root for GitHub rendering   |
| `tools/`  | Governance, generators, validators      | Dev tooling and process                          |

---

## Architecture Principles

### 1. Team Ownership

Each team owns their directory under `src/teams/<team-name>/`:

- Independent deployment pipelines
- Own their database schema
- Publish their own packages
- Set their own coding standards (within governance bounds)

### 2. Bounded Contexts (Domain-Driven)

```
❌ BAD: Shared database between teams
✅ GOOD: Each team owns their data store

src/teams/orders/apps/order-service/  → owns orders DB
src/teams/products/apps/product-service/ → owns products DB

# If orders need products → call product-service API
```

### 3. Minimal Shared

```
❌ BAD: @shared/* contains business logic
✅ GOOD: @shared/* only contains:
  - Primitive types (string, number, date)
  - Cross-team event definitions
  - Logging utilities
  - No domain-specific logic
```

### 4. Anti-Corruption Layers

```
src/teams/web/libs/adapters/                # Adapter layer
├── orders-adapter/
│   ├── orders-api.adapter.ts               # Wraps @orders/api
│   ├── mappers/                            # Maps backend → frontend types
│   └── mocks/                              # For development
└── products-adapter/

# Frontend NEVER imports @orders/api directly
# Frontend imports from @teams/web/adapters
```

### 5. API Contracts

- Backend teams define OpenAPI specifications
- CI generates type-safe clients automatically
- Contract tests ensure compatibility
- Frontend consumes via adapters

---

## Team Ownership Model

### Team Types

| Team Type              | Example          | Characteristics                                |
| ---------------------- | ---------------- | ---------------------------------------------- |
| **Domain Team**        | orders, products | Owns data, publishes domain packages           |
| **Cross-Cutting Team** | web, mobile      | Consumes multiple domain APIs                  |
| **Platform Team**      | platform         | Provides infrastructure, security, shared libs |

### Team Structure

Each team follows this pattern:

```
src/teams/<team-name>/
├── apps/                    # Deployable applications
│   └── <app-name>/
├── libs/                    # Internal libraries
│   ├── domain/              # Published domain models
│   ├── data-access/         # Internal - database access
│   ├── features/            # Internal - feature logic
│   └── adapters/            # Internal - API adapters (if frontend team)
├── packages/                # Published npm packages
│   └── api/                 # Generated API client
└── tests/                   # Team-specific tests
    └── contract/            # API contract tests
```

---

## Package Publishing Rules

| Package                | Publish | Who Can Use             | Governance              |
| ---------------------- | ------- | ----------------------- | ----------------------- |
| `@platform/*`          | ✅ Yes  | All teams               | ARB approval            |
| `@teams/*/domain`      | ✅ Yes  | Any team                | Team owns               |
| `@teams/*/api`         | ✅ Yes  | Any team (via adapters) | Auto-generated          |
| `@teams/*/adapters`    | ❌ No   | Own team only           | Team internal           |
| `@teams/*/data-access` | ❌ No   | Own team only           | Never published         |
| `@teams/*/features`    | ❌ No   | Own team only           | Never published         |
| `@shared/types`        | ✅ Yes  | All teams               | ARB - primitives only   |
| `@shared/utils`        | ✅ Yes  | All teams               | ARB - no business logic |

### Versioning Strategy

```
Phase 1 (Internal):
  @orders/domain: 0.0.1-alpha.1

Phase 2 (Beta):
  @orders/domain: 0.1.0-beta.1
  → Deprecation timeline starts

Phase 3 (Stable):
  @orders/domain: 1.0.0
  → 12-month support for major versions

Migration:
  @orders/domain: 2.0.0
  → Old version still works for 12 months
```

---

## Technology Stack

> **Note**: This architecture is technology-agnostic. The examples below show what's currently supported, but Nx can accommodate virtually any tech stack.

### Nx Plugins (Current)

```
@nx/react        # React / Next.js applications
@nx/react-native # React Native apps
@nx/expo         # Expo mobile apps
@nx/angular      # Angular applications
@nx/vue          # Vue.js applications
@nx/next         # Next.js applications
@nx/dotnet-core  # .NET microservices
@nx/node         # Node.js / Express / NestJS services
@nx/python       # Python applications
@nx/java         # Java / Spring Boot
@nx/workspace    # Workspace management
@nx/rollup       # Bundling shared packages
@nx/eslint       # Linting
@nx/jest         # Testing
@nx/vitest       # Testing (faster alternative)
@nx/playwright   # E2E testing
@nx/cypress      # E2E testing
```

### Extensible to Any Stack

| If you want to add... | Use Nx Plugin |
| --------------------- | ------------- |
| Go services           | `@nx/go`      |
| Rust services         | `@nx/rust`    |
| Swift/iOS             | `@nx/swift`   |
| Kotlin/Android        | `@nx/android` |
| Scala                 | `@nx/scala`   |
| Ruby                  | `@nx/ruby`    |
| PHP                   | `@nx/php`     |

**Custom Plugins**: If Nx doesn't support your stack, you can create custom plugins using `@nx/plugin`.

### Additional Tools (Flexible)

| Category          | Tool                   | Alternative                      |
| ----------------- | ---------------------- | -------------------------------- |
| Package Manager   | pnpm                   | npm, yarn                        |
| CI/CD             | GitHub Actions         | GitLab CI, Jenkins, Azure DevOps |
| IaC               | Terraform              | Pulumi, CloudFormation, CDK      |
| Orchestration     | Kubernetes             | Docker Swarm, Nomad, ECS         |
| API Documentation | OpenAPI/Swagger        | GraphQL Schema, gRPC proto       |
| Monitoring        | Prometheus + Grafana   | Datadog, New Relic, CloudWatch   |
| Logging           | Elasticsearch + Kibana | Datadog, CloudWatch Logs         |

### Philosophy

```
✅ This architecture supports:
   - Any frontend framework (React, Vue, Angular, Svelte, etc.)
   - Any backend runtime (.NET, Node, Go, Python, Java, Rust, etc.)
   - Any mobile approach (Native, React Native, Flutter, Expo)
   - Any cloud provider (AWS, Azure, GCP, on-prem)

✅ Just add the appropriate Nx plugin and follow the team structure
```

---

## Microservices Patterns

> Inspired by [microservices.io](https://microservices.io/patterns/index.html) — this section maps each adopted pattern to a concrete location in our repo.

### Pattern Map

| Category          | Pattern                          | Adopted     | Where in Repo                                               |
| ----------------- | -------------------------------- | ----------- | ----------------------------------------------------------- |
| **Decomposition** | Decompose by Business Capability | ✅          | `src/teams/orders/`, `src/teams/products/`                  |
| **Decomposition** | Decompose by Subdomain (DDD)     | ✅          | Each team = bounded context                                 |
| **Communication** | API Gateway                      | ✅          | `src/teams/platform/apps/api-gateway/`                      |
| **Communication** | Messaging / Event-Driven         | ✅          | See [Event-Driven Architecture](#event-driven-architecture) |
| **Data**          | Database per Service             | ✅          | Each service owns its DB                                    |
| **Data**          | CQRS                             | ✅          | See [CQRS](#cqrs-command-query-responsibility-segregation)  |
| **Data**          | Saga                             | ✅          | See [Saga](#saga-distributed-transactions)                  |
| **Data**          | Event Sourcing                   | 🔲 Optional | Per-team decision                                           |
| **Reliability**   | Circuit Breaker                  | ✅          | See [Resilience Patterns](#resilience-patterns)             |
| **Reliability**   | Retry / Timeout / Bulkhead       | ✅          | See [Resilience Patterns](#resilience-patterns)             |
| **External API**  | API Gateway                      | ✅          | `src/teams/platform/apps/api-gateway/`                      |
| **External API**  | Backend for Frontend (BFF)       | ✅          | See [BFF](#backend-for-frontend-bff)                        |
| **Discovery**     | Service Registry                 | ✅          | Kubernetes DNS (automatic)                                  |
| **Observability** | Health Check API                 | ✅          | See [Health Check Standard](#health-check-standard)         |
| **Observability** | Distributed Tracing              | ✅          | `src/shared/libs/utils/tracing/`                            |
| **Observability** | Log Aggregation                  | ✅          | `src/shared/libs/utils/logging/`                            |
| **Observability** | Audit Logging                    | ✅          | `src/teams/platform/libs/security/`                         |
| **Deployment**    | Service per Container            | ✅          | `ops/infra/kubernetes/`                                     |
| **Deployment**    | Blue-Green / Canary              | ✅          | See [Deployment Strategies](#deployment-strategies)         |
| **Testing**       | Consumer-driven Contract Test    | ✅          | `src/teams/*/tests/contract/`                               |
| **Security**      | Access Token / RBAC              | ✅          | `src/teams/platform/libs/security/`                         |
| **UI**            | Micro Frontend (implicit)        | ✅          | Separate `web` and `mobile` teams                           |

### Event-Driven Architecture

Teams communicate asynchronously via domain events. Events are the primary mechanism for cross-team data propagation.

```
Event Flow:
  orders team → publishes OrderCreated event
  products team → subscribes and updates inventory
  web team → subscribes and updates UI in real-time
```

#### Event Schema Convention

All cross-team events are defined in `src/shared/libs/types/events/`:

```typescript
// src/shared/libs/types/events/order-events.ts
export interface DomainEvent<T = unknown> {
  eventId: string; // UUID
  eventType: string; // e.g. "order.created"
  aggregateId: string; // e.g. order ID
  aggregateType: string; // e.g. "Order"
  timestamp: string; // ISO 8601
  version: number; // Schema version
  source: string; // e.g. "orders-service"
  correlationId: string; // For distributed tracing
  payload: T;
}

export interface OrderCreatedPayload {
  orderId: string;
  customerId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  totalAmount: number;
}

export interface OrderCompletedPayload {
  orderId: string;
  completedAt: string;
}

// Type-safe event definitions
export type OrderCreatedEvent = DomainEvent<OrderCreatedPayload>;
export type OrderCompletedEvent = DomainEvent<OrderCompletedPayload>;
```

#### Event Ownership Rules

| Rule                         | Description                                           |
| ---------------------------- | ----------------------------------------------------- |
| **Producer owns the schema** | The team that publishes the event defines its type    |
| **Consumers adapt**          | Consuming teams map events to their internal models   |
| **Backward compatible**      | New fields are optional; old fields are never removed |
| **Versioned**                | `version` field allows schema evolution               |

#### Recommended Message Brokers

| Broker            | Best For                        | Notes                 |
| ----------------- | ------------------------------- | --------------------- |
| Apache Kafka      | High throughput, event sourcing | Persistent, ordered   |
| RabbitMQ          | Task queues, RPC patterns       | Flexible routing      |
| AWS SNS/SQS       | Cloud-native, fan-out           | Managed, serverless   |
| Azure Service Bus | Enterprise, transactions        | Sessions, dead-letter |
| Redis Streams     | Lightweight, real-time          | Low latency           |

### CQRS (Command Query Responsibility Segregation)

Separate read and write models for complex domains:

```
┌─────────────────────────────────────────────────┐
│                  API Gateway                    │
│         src/teams/platform/apps/api-gateway     │
└──────────────┬──────────────────┬───────────────┘
               │                  │
        ┌──────▼──────┐   ┌──────▼──────┐
        │  Commands   │   │  Queries    │
        │  (writes)   │   │  (reads)    │
        └──────┬──────┘   └──────┬──────┘
               │                  │
        ┌──────▼──────┐   ┌──────▼──────┐
        │  Write DB   │   │  Read DB    │
        │  (primary)  │──▶│  (replica)  │
        └─────────────┘   └─────────────┘
                    events
```

**When to Use CQRS:**

- High read-to-write ratio (10:1 or more)
- Complex domain logic on writes, simple reads
- Different scaling needs for reads vs writes

**When NOT to Use CQRS:**

- Simple CRUD operations
- Low traffic services
- Small teams (added complexity not justified)

### Saga (Distributed Transactions)

When a business operation spans multiple services, use the Saga pattern instead of distributed transactions:

```
Order Placement Saga (Choreography):

  ┌─────────┐     OrderCreated     ┌──────────┐
  │ Orders  │─────────────────────▶│ Products │
  │ Service │                      │ Service  │
  └─────────┘                      └────┬─────┘
       ▲                                │
       │         InventoryReserved      │
       │◀───────────────────────────────┘
       │
       │         PaymentProcessed   ┌──────────┐
       │◀───────────────────────────│ Payment  │
       │                            │ Service  │
       │                            └──────────┘
       │
       ▼
  OrderConfirmed
```

#### Saga Types

| Type              | How It Works                                       | Best For                 |
| ----------------- | -------------------------------------------------- | ------------------------ |
| **Choreography**  | Each service publishes events, next service reacts | Simple flows (2-4 steps) |
| **Orchestration** | Central coordinator tells each service what to do  | Complex flows (5+ steps) |

#### Compensating Transactions

Every saga step must have a compensating action for rollback:

```
Step 1: Reserve Inventory    → Compensate: Release Inventory
Step 2: Process Payment      → Compensate: Refund Payment
Step 3: Confirm Order        → Compensate: Cancel Order
```

### Resilience Patterns

All inter-service communication must implement resilience patterns. These live in the adapter layer.

#### Circuit Breaker

```typescript
// src/teams/web/libs/adapters/orders-adapter/circuit-breaker.ts
enum CircuitState {
  CLOSED = 'CLOSED', // Normal operation
  OPEN = 'OPEN', // Failing, reject requests
  HALF_OPEN = 'HALF_OPEN', // Testing recovery
}

interface CircuitBreakerConfig {
  failureThreshold: number; // Failures before opening (e.g., 5)
  resetTimeout: number; // Ms before trying again (e.g., 30000)
  monitorWindow: number; // Ms to count failures in (e.g., 60000)
}

// Usage in adapter:
const ordersCircuit = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 30_000,
  monitorWindow: 60_000,
});

export class OrdersAdapter {
  async getOrders(): Promise<OrderView[]> {
    return ordersCircuit.execute(() => OrdersService.listOrders());
  }
}
```

#### Full Resilience Stack

| Pattern             | Purpose                   | Default Config                       |
| ------------------- | ------------------------- | ------------------------------------ |
| **Circuit Breaker** | Stop cascading failures   | 5 failures → open for 30s            |
| **Retry**           | Handle transient failures | 3 retries, exponential backoff       |
| **Timeout**         | Prevent hanging requests  | 5s for reads, 30s for writes         |
| **Bulkhead**        | Isolate resource pools    | Separate thread pools per service    |
| **Fallback**        | Graceful degradation      | Cache, default values, or error page |

### Backend for Frontend (BFF)

Each frontend platform gets its own BFF that aggregates multiple backend APIs:

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Web Portal  │  │  Mobile App  │  │  Admin Panel  │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                  │                  │
┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐
│   Web BFF    │  │  Mobile BFF  │  │  Admin BFF   │
│  (Node/Next) │  │  (Node)      │  │  (Node)      │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
         ┌────────┐ ┌────────┐ ┌──────────┐
         │Orders  │ │Products│ │ Platform │
         │Service │ │Service │ │ Services │
         └────────┘ └────────┘ └──────────┘
```

**Where in repo:**

- Web BFF: `src/teams/web/apps/web-bff/`
- Mobile BFF: `src/teams/mobile/apps/mobile-bff/`
- Admin BFF: `src/teams/platform/apps/admin-portal/`

### Health Check Standard

Every service **MUST** expose health check endpoints:

```typescript
// Platform requirement for all services
// Implemented in: src/teams/platform/libs/core/health/

// GET /health — Liveness probe (is the process alive?)
interface LivenessResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
}

// GET /ready — Readiness probe (can it serve traffic?)
interface ReadinessResponse {
  status: 'ready' | 'not_ready';
  timestamp: string;
  checks: {
    database: 'ok' | 'error';
    cache: 'ok' | 'error';
    messageBroker: 'ok' | 'error';
    dependencies: Record<string, 'ok' | 'error'>;
  };
}
```

**Kubernetes Integration:**

```yaml
# ops/infra/kubernetes/base/deployment-template.yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
```

### Deployment Strategies

```
┌────────────────────────────────────────────────────────────┐
│                   Deployment Strategies                     │
├────────────────┬───────────────┬───────────────────────────┤
│   Strategy     │   Risk Level  │   When to Use             │
├────────────────┼───────────────┼───────────────────────────┤
│ Rolling Update │   🟢 Low      │ Default for most services │
│ Blue-Green     │   🟢 Low      │ Zero-downtime required    │
│ Canary         │   🟡 Medium   │ High-traffic services     │
│ Feature Flags  │   🟢 Low      │ Gradual feature rollout   │
└────────────────┴───────────────┴───────────────────────────┘
```

#### Rolling Update (Default)

```yaml
# ops/infra/kubernetes/base/deployment-template.yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 0
    maxSurge: 1
```

#### Blue-Green

```
                        Load Balancer
                             │
                 ┌───────────┼───────────┐
                 ▼                       ▼
          ┌─────────────┐        ┌─────────────┐
          │  Blue (v1)  │        │ Green (v2)  │
          │  (current)  │        │  (new)      │
          └─────────────┘        └─────────────┘
                                       │
                              Switch traffic
                              after validation
```

#### Canary

```
          Load Balancer (traffic splitting)
                    │
          ┌─────────┼─────────┐
          ▼                   ▼
   ┌─────────────┐    ┌─────────────┐
   │ Stable (v1) │    │ Canary (v2) │
   │    95%      │    │     5%      │
   └─────────────┘    └─────────────┘
                            │
                  Gradually increase %
                  if metrics are healthy
```

**Rollback Policy:** If error rate exceeds 1% or p99 latency increases by 50%, automatically roll back.

---

## Anti-Corruption Pattern

### Problem

When backend teams change their APIs, frontend teams shouldn't be affected directly.

### Solution: Adapter Layer

```typescript
// src/teams/web/libs/adapters/orders-adapter/index.ts
import { OrdersService } from '@orders/api';
import type { Order } from '@orders/domain';

// Internal interface that frontend uses
export interface OrderView {
  id: string;
  displayName: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
}

// Adapter maps backend → frontend types
export class OrdersAdapter {
  async getOrders(): Promise<OrderView[]> {
    const orders = await OrdersService.listOrders();
    return orders.map(this.mapToView);
  }

  private mapToView(order: Order): OrderView {
    return {
      id: order.id,
      displayName: order.displayTitle,
      total: order.totalAmount,
      status: this.mapStatus(order.state),
    };
  }

  private mapStatus(state: string): OrderView['status'] {
    // Handle backend changes without breaking frontend
    const mapping: Record<string, OrderView['status']> = {
      created: 'pending',
      processing: 'pending',
      done: 'completed',
      cancelled: 'cancelled',
    };
    return mapping[state] || 'pending';
  }
}
```

### Benefits

1. **Isolation**: Backend changes don't leak into frontend code
2. **Flexibility**: Can map multiple backend versions
3. **Testability**: Easy to mock in tests
4. **Ownership**: Each team owns their adapter

---

## Security & Compliance

### Security Layers

```yaml
# .github/workflows/security.yml
- name: Secret scanning
  uses: trufflesecurity/trufflehog

- name: Dependency vulnerability scan
  uses: snyk/actions/node

- name: SAST scan
  uses: semgrep/semgrep

- name: Container scan
  uses: aquasecurity/trivy-policies
```

### RBAC (Role-Based Access Control)

```typescript
// src/teams/platform/libs/security/rbac/index.ts
export interface Permission {
  resource: string;
  action: 'read' | 'write' | 'delete' | 'admin';
  scope: 'own' | 'team' | 'department' | 'global';
}

export function checkPermission(user: User, permission: Permission): boolean {
  // Enforce least privilege
  // Audit all permission checks
}
```

### Compliance Structure

```
ops/compliance/
├── soc2/
│   ├── controls/
│   │   ├── access-control.md
│   │   ├── encryption.md
│   │   └── audit-logging.md
│   └── audit/
│       └── 2024-audit-report.pdf
├── gdpr/
│   ├── data-map/
│   │   └── data-flow-diagram.md
│   ├── retention/
│   │   └── data-retention-policy.md
│   └── privacy/
│       └── privacy-notice.md
└── audit-logs/
    └── immutable-log-store/
```

---

## Governance

### Architecture Review Board (ARB)

```
tools/governance/arb/
├── README.md           # Charter, mission, process
├── members.json        # Current members
└── meetings/           # Meeting notes
```

**ARB Responsibilities:**

- Approve new `@shared/*` packages
- Review cross-team dependencies
- Enforce architecture standards
- Resolve conflicts

**SLA:**

- 48h for simple approvals
- 1 week for complex proposals

### RFC Process

```
tools/governance/rfc/
├── template.md         # RFC template
├── archive/            # Past RFCs
└── active/             # Active proposals
```

**RFC Template:**

```markdown
# RFC: <Title>

## Summary

<One paragraph>

## Motivation

Why this change?

## Detailed Design

Technical details

## Alternatives

What else was considered?

## Risks

What could go wrong?

## Timeline

Implementation plan
```

### Policies

```
tools/governance/policies/
├── dependency-policy.md      # When to create shared libs
├── versioning-policy.md      # Semantic versioning rules (planned)
├── testing-policy.md         # Required test coverage (planned)
├── security-policy.md        # Security requirements (planned)
└── documentation-policy.md   # Documentation standards (planned)
```

---

## Infrastructure

### Multi-Region Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      GLOBAL LAYER                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                    │
│  │   DNS   │  │   CDN   │  │   WAF   │                    │
│  └────┬────┘  └────┬────┘  └────┬────┘                    │
└───────┼────────────┼────────────┼──────────────────────────┘
        │            │            │
        ▼            ▼            ▼
┌───────────────┬───────────────┬───────────────┐
│   US-EAST     │   EU-WEST     │   AP-SOUTH    │
│  ┌─────────┐  │  ┌─────────┐  │  ┌─────────┐  │
│  │ K8s/AKS │  │  │ K8s/AKS │  │  │ K8s/AKS │  │
│  └─────────┘  │  └─────────┘  │  └─────────┘  │
│  ┌─────────┐  │  ┌─────────┐  │  ┌─────────┐  │
│  │  SQL    │  │  │  SQL    │  │  │  SQL    │  │
│  └─────────┘  │  └─────────┘  │  └─────────┘  │
│  ┌─────────┐  │  ┌─────────┐  │  ┌─────────┐  │
│  │  Redis  │  │  │  Redis  │  │  │  Redis  │  │
│  └─────────┘  │  └─────────┘  │  └─────────┘  │
└───────────────┴───────────────┴───────────────┘
```

### Terraform Structure

```
ops/infra/terraform/
├── modules/                    # Reusable modules
│   ├── vpc/                    # VPC configuration
│   ├── aks/                    # Kubernetes cluster
│   ├── app-service/            # App Service (Azure)
│   ├── rds/                    # Relational DB
│   └── elasticache/            # Redis/Cache
│
├── environments/               # Environment-specific
│   ├── dev/                    # Development
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── staging/                # Staging
│   ├── prod-us/                # US Production
│   ├── prod-eu/                # EU Production
│   └── prod-ap/                # APAC Production
│
└── global/                     # Global resources
    ├── dns/
    ├── cdn/
    └── waf/
```

---

## Implementation Plan

### Phase 1: Foundation (Week 1)

```bash
# 1. Initialize Nx workspace
npx create-nx-workspace@latest nx-mono-arch --pm=pnpm

# 2. Install core plugins
pnpm add -D @nx/react @nx/react-native @nx/expo @nx/dotnet-core @nx/node
pnpm add -D @nx/jest @nx/vitest @nx/eslint @nx/rollup

# 3. Configure nx.json
# 4. Set up tsconfig base
# 5. Create folder structure (src/, ops/, docs/, tools/)
```

### Phase 2: Core Infrastructure (Week 2)

1. Create platform team structure
2. Implement `@platform/core` and `@platform/config`
3. Set up API Gateway skeleton
4. Configure security libs
5. Set up shared types and utils

### Phase 3: Sample Teams (Week 3)

1. Create orders team with .NET service
2. Create web team with React app
3. Set up OpenAPI generation
4. Implement adapters pattern
5. Configure dependency rules

### Phase 4: Governance (Week 4)

1. Set up ARB process and meetings
2. Configure Nx dependency constraints
3. Add CI/CD templates
4. Create documentation templates
5. Set up security scanning

### Phase 5: Enterprise Features (Week 5+)

1. Multi-region Terraform setup
2. Kubernetes manifests
3. Observability integration
4. Compliance documentation
5. Disaster recovery procedures

---

## Risks & Mitigations

### Extended Risk Analysis (Research-Based)

#### 1. Nx/Build Performance at Scale

| Risk                            | Severity  | Evidence                           | Mitigation                                 |
| ------------------------------- | --------- | ---------------------------------- | ------------------------------------------ |
| 100+ projects = slow `nx graph` | 🟠 Medium | Nx forums, GitHub issues           | Use Nx Cloud, limit project depth          |
| `nx affected` becomes slow      | 🟠 Medium | Performance degrades >500 projects | Split workspaces, use task filtering       |
| IDE lag with many projects      | 🟡 Low    | VS Code with large workspaces      | Workspace recommendations, sparse checkout |

**Research Finding**: Nx officially supports 100s of projects, but 1000+ requires careful architecture.

**Recommended: Nx Cloud**

```json
// nx.json - with Nx Cloud
{
  "targetDefaults": {
    "build": {
      "cache": true,
      "inputs": ["^build"]
    },
    "test": {
      "cache": true,
      "inputs": ["^build"]
    }
  },
  "useInferencePlugins": false,
  "nxCloudId": "YOUR-NX-CLOUD-ID" // Set via: pnpm nx connect
}
```

**Setup**:

1. Sign up at [nx.app](https://nx.app) (free for small teams)
2. Connect workspace: `pnpm nx connect`
3. Get access token and add to `nx.json`

**What Nx Cloud Stores** (Privacy-Safe):
| Data | Stored | Notes |
|------|--------|-------|
| Source code | ❌ No | Never uploaded |
| File hashes | ✅ Yes | For cache invalidation |
| Build artifacts | ✅ Yes | Compiled outputs only |
| Build metadata | ✅ Yes | Times, success/failure |

**Privacy Note**: Only hashes and compiled outputs are stored - no source code. For strict requirements, Nx Cloud Enterprise (self-hosted) is available.

**Additional Optimizations**:

1. **Limit Project Depth**:

   - Keep directory nesting to max 3 levels
   - Avoid deeply nested libs structure

2. **Use Task Filtering**:

```bash
pnpm nx build app-name --skip-nx-cache  # For CI
pnpm nx affected -t build               # Only build affected
```

3. **Split Large Workspaces** (if >500 projects):

   - Consider multiple Nx workspaces
   - Use Nx's "show" plugin to filter projects

4. **IDE Optimization**:
   - Use VS Code Workspace Trust
   - Disable Nxls extension for non-project files
   - Use sparse checkout for large repos

#### 2. .NET + Node Integration Challenges

| Risk                             | Severity  | Evidence                                    | Mitigation                                        |
| -------------------------------- | --------- | ------------------------------------------- | ------------------------------------------------- |
| Different build systems          | 🟠 Medium | .NET uses MSBuild, Node uses rollup/esbuild | Standardize Nx targets, separate pipelines        |
| Testing fragmentation            | 🟡 Low    | xUnit vs Jest/Vitest                        | Consolidate to Vitest for JS, keep xUnit for .NET |
| NuGet + npm dependency conflicts | 🟠 Medium | Version conflicts between ecosystems        | Separate package registries, lock files           |

**Research Finding**: @nx/dotnet-core is less mature than @nx/react - expect some friction.

#### 3. Dependency Hell

| Risk                            | Severity  | Evidence                      | Mitigation                              |
| ------------------------------- | --------- | ----------------------------- | --------------------------------------- |
| Diamond dependencies            | 🟠 Medium | A→B→C and A→D→C conflict      | Flatten dependencies, use pnpm strict   |
| Transitive dependency conflicts | 🟠 Medium | Common in large monorepos     | Dedup, lock versions at workspace level |
| Phantom dependencies            | 🟡 Low    | pnpm prevents this by default | Use pnpm (already selected)             |

**Research Finding**: pnpm's strictness helps, but requires team discipline.

#### 4. Migration from Polyrepo

| Risk                        | Severity  | Evidence                           | Mitigation                             |
| --------------------------- | --------- | ---------------------------------- | -------------------------------------- |
| History loss                | 🟡 Low    | Git history doesn't transfer       | Use git subtree for partial migration  |
| Initial chaos               | 🟠 Medium | Every team moves at different pace | Phased migration, pilot teams first    |
| Breaking existing workflows | 🟠 Medium | Teams resist change                | Extensive onboarding, champion program |

**Research Finding**: Most failures happen in first 6 months - plan for it.

#### 5. Module Boundary Enforcement Pain

| Risk                              | Severity  | Evidence                      | Mitigation                           |
| --------------------------------- | --------- | ----------------------------- | ------------------------------------ |
| Strict boundaries frustrate teams | 🟠 Medium | Common complaint in Nx issues | Balance strictness with practicality |
| False positives in linting        | 🟡 Low    | Sometimes blocks valid code   | Regular rule review, escape hatches  |
| Circular dependencies sneak in    | 🟠 Medium | Easy to create accidentally   | Automated graph checks in CI         |

**Research Finding**: Teams often relax boundaries after initial period - plan for this.

#### 6. When to Choose Monorepo vs Polyrepo

| Factor    | Monorepo Better                  | Polyrepo Better            |
| --------- | -------------------------------- | -------------------------- |
| Team size | < 500 developers                 | > 1000 developers          |
| Coupling  | High (frequent shared changes)   | Low (independent releases) |
| Culture   | Trust-based, shared ownership    | Strict team boundaries     |
| Velocity  | Need atomic changes across teams | Teams work independently   |
| Tooling   | Can invest in monorepo tooling   | Standard CI/CD acceptable  |

**Research Finding**: Airbnb, Google moved to monorepo; many others use polyrepo successfully.

### Known Risks (Original)

| Risk                            | Severity  | Mitigation                          |
| ------------------------------- | --------- | ----------------------------------- |
| Monorepo at extreme scale       | 🟠 Medium | Git shallow clones, sparse checkout |
| Cross-team dependency conflicts | 🟠 Medium | ARB, contract testing, adapters     |
| Governance bottleneck           | 🟠 Medium | SLAs, self-service for low-risk     |
| Nx learning curve               | 🟡 Low    | Comprehensive onboarding            |

### What Big Tech Does Differently

| Company | Approach               | Why We Don't                |
| ------- | ---------------------- | --------------------------- |
| Google  | Custom VCS (Piper)     | Can't build custom VCS      |
| Meta    | Custom VCS (Sapling)   | Git is sufficient           |
| Google  | Bazel build            | Nx is closest open-source   |
| Meta    | Direct commits to main | PR workflow provides review |

### When to Consider Changes

- **500+ developers**: Consider splitting into multiple monorepos
- **1000+ developers**: Consider custom tooling investment
- **Extreme scale**: Look at Google/Meta patterns

---

## Comparison with Big Tech

| Aspect             | Google              | Meta                | Stripe         | Our Architecture |
| ------------------ | ------------------- | ------------------- | -------------- | ---------------- |
| Repo Type          | Single giant        | Single giant        | Monorepo       | Monorepo         |
| VCS                | Piper (custom)      | Sapling (custom)    | Git            | Git              |
| Build System       | Blaze/Bazel         | Buck                | Custom + Bazel | Nx               |
| Team Model         | Directory ownership | Directory ownership | Team ownership | Team ownership   |
| Package Management | Direct imports      | Direct imports      | Internal gems  | pnpm             |
| Code Review        | Minimal             | Minimal             | PR-based       | PR-based         |

**Our architecture matches the spirit of Big Tech while using practical, standard tools.**

---

## Quick Reference

### Create a New Team

```bash
# 1. Create team directory
mkdir -p src/teams/new-team/{apps,libs,packages,tests}

# 2. Add to nx.json project references
# 3. Create domain package
pnpm nx g @nx/workspace:package src/teams/new-team/libs/domain

# 4. Set up publishing
# 5. Configure CI pipeline
```

### Add a New Application

```bash
# React app
pnpm nx g @nx/react:app src/teams/web/apps/new-app

# .NET service
pnpm nx g @nx/dotnet-core:app src/teams/orders/apps/order-service

# Expo mobile
pnpm nx g @nx/expo:app src/teams/mobile/apps/new-app
```

### Publish a Package

```bash
# Build and publish
pnpm nx run orders-domain:build
pnpm nx run orders-domain:publish
```

---

## Additional Resources

- [Microservices Patterns (microservices.io)](https://microservices.io/patterns/index.html)
- [Nx Documentation](https://nx.dev)
- [Nx Cloud](https://nx.app)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Terraform Documentation](https://www.terraform.io/docs)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

---

_Last Updated: 2026-03-22_
_Architecture Version: 5.0_
_Status: Ready for Implementation_
