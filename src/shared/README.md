# Shared Libraries & Packages

> Minimal shared primitives consumed by all teams. **No business logic allowed here.**

## Rules

1. **Only primitives and utilities** — Types, helpers, constants. Never domain models.
2. **ARB approval required** — All changes to shared code require Architecture Review Board sign-off.
3. **Backward compatible** — Shared packages follow semver; breaking changes need an RFC.
4. **Minimal surface area** — If only 2 teams need it, it doesn't belong here. Use an SDK instead.

## Library Inventory

| Path          | Import Path     | Purpose                                                                         |
| ------------- | --------------- | ------------------------------------------------------------------------------- |
| `libs/types/` | `@shared/types` | Branded types (UUID, ISO8601, Currency), DomainEvent, Result, PaginatedResponse |
| `libs/utils/` | `@shared/utils` | Structured logger, retry with backoff, correlation ID generator                 |

## Planned Libraries

| Name              | Import Path         | Purpose                                              |
| ----------------- | ------------------- | ---------------------------------------------------- |
| `libs/testing/`   | `@shared/testing`   | Test factories, matchers, mock utilities             |
| `libs/constants/` | `@shared/constants` | Environment names, HTTP status codes, regex patterns |
| `libs/errors/`    | `@shared/errors`    | Error classes, error codes, error serialization      |

## Publishable Packages (Planned)

> These packages are part of the target architecture. Create them as your team grows, replacing `@myorg` with your organization scope.

| Path                        | Package Name             | Purpose                         |
| --------------------------- | ------------------------ | ------------------------------- |
| `packages/eslint-config/`   | `@myorg/eslint-config`   | Shared ESLint configuration     |
| `packages/tsconfig/`        | `@myorg/tsconfig`        | Shared TypeScript configuration |
| `packages/prettier-config/` | `@myorg/prettier-config` | Shared Prettier configuration   |

## Who Maintains This

- **Architecture Review Board (ARB)** — Approves all changes
- **Platform Team** — Day-to-day maintenance
- **Any team** — Can propose additions via RFC

## When to Add Something Here vs. Team-Owned

| Scenario         | Where it goes                                  |
| ---------------- | ---------------------------------------------- |
| Used by 3+ teams | `src/shared/libs/`                             |
| Used by 2 teams  | SDK in the owning team (`@orders/sdk`)         |
| Used by 1 team   | Team's own `libs/` directory                   |
| Business logic   | **Never here** — goes in team's `libs/domain/` |
