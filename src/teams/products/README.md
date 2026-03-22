# Products Team

> Owns the product catalog, inventory management, and pricing.

> 📋 **Note**: This README documents the **target architecture**. Services and libraries listed below are created incrementally using Nx generators as your team grows.

## Service Inventory

| Path                       | Type      | Suffix        | Description                                              |
| -------------------------- | --------- | ------------- | -------------------------------------------------------- |
| `apps/product-api/`        | API       | `*-api`       | REST/gRPC API for product catalog & pricing              |
| `apps/inventory-consumer/` | Consumer  | `*-consumer`  | Subscribes to order events for stock reservation/release |
| `apps/catalog-worker/`     | Worker    | `*-worker`    | Async jobs (image processing, search indexing)           |
| `apps/product-migration/`  | Migration | `*-migration` | Database schema migrations                               |
| `apps/catalog-seed/`       | Seed      | `*-seed`      | Seed product catalog with fixture data                   |

## Library Inventory

| Path                   | Import Path                | Purpose                                                 |
| ---------------------- | -------------------------- | ------------------------------------------------------- |
| `libs/domain/`         | `@products/domain`         | Product models, events, pure business rules             |
| `libs/data-access/`    | `@products/data-access`    | Repository pattern, database queries                    |
| `libs/messaging/`      | `@products/messaging`      | Event publishing (ProductCreated, InventoryUpdated)     |
| `libs/contract/`       | `@products/contract`       | OpenAPI/Proto schema (API contract)                     |
| `libs/sdk/`            | `@products/sdk`            | Client SDK for other teams to query products            |
| `libs/adapter-search/` | `@products/adapter-search` | Anti-corruption layer for search provider (Algolia, ES) |

## Who Works Here

- **Backend developers** — Catalog API, inventory logic, event handlers
- **Data engineers** — Search indexing, analytics events
- **QA engineers** — Contract tests, integration tests

## Domain Events Published

| Event               | Payload                   | Consumers                                              |
| ------------------- | ------------------------- | ------------------------------------------------------ |
| `product.created`   | `ProductCreatedPayload`   | Search (indexing), Analytics                           |
| `inventory.updated` | `InventoryUpdatedPayload` | Orders (availability check), Notifications (low stock) |

## Dependencies

- `@shared/types` — Primitives (UUID, ISO8601, Currency, DomainEvent)
- `@platform/messaging` — Event bus abstraction
- `@platform/observability` — Logging, tracing

## Tests

| Path                 | Type        | Purpose                                        |
| -------------------- | ----------- | ---------------------------------------------- |
| `tests/contract/`    | Contract    | Consumer-driven contract verification          |
| `tests/integration/` | Integration | API + database + search engine                 |
| `tests/e2e/`         | E2E         | Full catalog flow (create → search → purchase) |
| `tests/load/`        | Load        | k6 scripts for catalog query throughput        |

## Getting Started

```bash
# Start the product API locally
pnpm nx serve product-api

# Run unit tests
pnpm nx test @products/domain

# Seed the catalog
pnpm nx serve catalog-seed
```
