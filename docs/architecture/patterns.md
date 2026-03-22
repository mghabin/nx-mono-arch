# Microservices Patterns

← Back to [ARCHITECTURE.md](../../ARCHITECTURE.md)

> Inspired by [microservices.io](https://microservices.io/patterns/index.html) — this document maps each adopted pattern to a concrete location in our repo.

---

## Pattern Map

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

---

## Event-Driven Architecture

Teams communicate asynchronously via domain events. Events are the primary mechanism for cross-team data propagation.

```
Event Flow:
  orders team → publishes OrderCreated event
  products team → subscribes and updates inventory
  web team → subscribes and updates UI in real-time
```

### Event Schema Convention

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

### Event Ownership Rules

| Rule                         | Description                                           |
| ---------------------------- | ----------------------------------------------------- |
| **Producer owns the schema** | The team that publishes the event defines its type    |
| **Consumers adapt**          | Consuming teams map events to their internal models   |
| **Backward compatible**      | New fields are optional; old fields are never removed |
| **Versioned**                | `version` field allows schema evolution               |

### Recommended Message Brokers

| Broker            | Best For                        | Notes                 |
| ----------------- | ------------------------------- | --------------------- |
| Apache Kafka      | High throughput, event sourcing | Persistent, ordered   |
| RabbitMQ          | Task queues, RPC patterns       | Flexible routing      |
| AWS SNS/SQS       | Cloud-native, fan-out           | Managed, serverless   |
| Azure Service Bus | Enterprise, transactions        | Sessions, dead-letter |
| Redis Streams     | Lightweight, real-time          | Low latency           |

---

## CQRS (Command Query Responsibility Segregation)

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

---

## Saga (Distributed Transactions)

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

### Saga Types

| Type              | How It Works                                       | Best For                 |
| ----------------- | -------------------------------------------------- | ------------------------ |
| **Choreography**  | Each service publishes events, next service reacts | Simple flows (2-4 steps) |
| **Orchestration** | Central coordinator tells each service what to do  | Complex flows (5+ steps) |

### Compensating Transactions

Every saga step must have a compensating action for rollback:

```
Step 1: Reserve Inventory    → Compensate: Release Inventory
Step 2: Process Payment      → Compensate: Refund Payment
Step 3: Confirm Order        → Compensate: Cancel Order
```

---

## Resilience Patterns

All inter-service communication must implement resilience patterns. These live in the adapter layer.

### Circuit Breaker

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

### Full Resilience Stack

| Pattern             | Purpose                   | Default Config                       |
| ------------------- | ------------------------- | ------------------------------------ |
| **Circuit Breaker** | Stop cascading failures   | 5 failures → open for 30s            |
| **Retry**           | Handle transient failures | 3 retries, exponential backoff       |
| **Timeout**         | Prevent hanging requests  | 5s for reads, 30s for writes         |
| **Bulkhead**        | Isolate resource pools    | Separate thread pools per service    |
| **Fallback**        | Graceful degradation      | Cache, default values, or error page |

---

## Backend for Frontend (BFF)

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

---

## Health Check Standard

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

---

## Deployment Strategies

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

### Rolling Update (Default)

```yaml
# ops/infra/kubernetes/base/deployment-template.yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 0
    maxSurge: 1
```

### Blue-Green

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

### Canary

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

## References

- [Microservices Patterns (microservices.io)](https://microservices.io/patterns/index.html)
- [ARCHITECTURE.md](../../ARCHITECTURE.md) — Core architecture document
