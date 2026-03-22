# Orders Team

> Owns the order lifecycle — creation, payment processing, fulfillment, and cancellation.

> 📋 **Note**: This README documents the **target architecture**. Services and libraries listed below are created incrementally using Nx generators as your team grows.

## Service Inventory

| Path                       | Type         | Suffix           | Description                                              |
| -------------------------- | ------------ | ---------------- | -------------------------------------------------------- |
| `apps/order-api/`          | API          | `*-api`          | REST/gRPC API for order management                       |
| `apps/order-worker/`       | Worker       | `*-worker`       | Processes async jobs (invoice generation, notifications) |
| `apps/order-consumer/`     | Consumer     | `*-consumer`     | Subscribes to payment/inventory events                   |
| `apps/order-orchestrator/` | Orchestrator | `*-orchestrator` | Saga: create → pay → fulfill → complete                  |
| `apps/order-migration/`    | Migration    | `*-migration`    | Database schema migrations                               |

## Library Inventory

| Path                     | Import Path                | Purpose                                           |
| ------------------------ | -------------------------- | ------------------------------------------------- |
| `libs/domain/`           | `@orders/domain`           | Order models, events, pure business rules         |
| `libs/data-access/`      | `@orders/data-access`      | Repository pattern, database queries              |
| `libs/messaging/`        | `@orders/messaging`        | Event publishing (OrderCreated, OrderCompleted)   |
| `libs/jobs/`             | `@orders/jobs`             | Job definitions shared between worker & scheduler |
| `libs/contract/`         | `@orders/contract`         | OpenAPI/Proto schema (API contract)               |
| `libs/sdk/`              | `@orders/sdk`              | Client SDK for other teams to call Order API      |
| `libs/adapter-payments/` | `@orders/adapter-payments` | Anti-corruption layer for payment provider        |

## Who Works Here

- **Backend developers** — API endpoints, business logic, event handlers
- **QA engineers** — Contract tests, integration tests, load tests

## Domain Events Published

| Event             | Payload                 | Consumers                                       |
| ----------------- | ----------------------- | ----------------------------------------------- |
| `order.created`   | `OrderCreatedPayload`   | Products (inventory reservation), Analytics     |
| `order.completed` | `OrderCompletedPayload` | Fulfillment, Notifications                      |
| `order.cancelled` | `OrderCancelledPayload` | Products (inventory release), Payments (refund) |

## Dependencies

- `@shared/types` — Primitives (UUID, ISO8601, Currency, DomainEvent)
- `@platform/messaging` — Event bus abstraction
- `@platform/observability` — Logging, tracing

## Tests

| Path                 | Type        | Purpose                                  |
| -------------------- | ----------- | ---------------------------------------- |
| `tests/contract/`    | Contract    | Consumer-driven contract verification    |
| `tests/integration/` | Integration | API + database + message broker          |
| `tests/e2e/`         | E2E         | Full order flow (create → pay → fulfill) |
| `tests/load/`        | Load        | k6 scripts for API throughput            |

## Getting Started

```bash
# Start the order API locally
pnpm nx serve order-api

# Run unit tests
pnpm nx test @orders/domain

# Run integration tests
pnpm nx test order-api --configuration=integration
```
