# Enterprise Monorepo Architecture

> Scalable Nx monorepo template inspired by Google, Meta, Stripe architecture patterns.

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Architecture Principles](#architecture-principles)
4. [Team Ownership Model](#team-ownership-model)
5. [Package Publishing Rules](#package-publishing-rules)
6. [Technology Stack](#technology-stack)
7. [Microservices Patterns](docs/architecture/patterns.md)
8. [Anti-Corruption Pattern](#anti-corruption-pattern)
9. [Security & Compliance](#security--compliance)
10. [Governance](#governance)
11. [Infrastructure](#infrastructure)
12. [Implementation Plan](docs/architecture/implementation-plan.md)
13. [Risks & Mitigations](docs/architecture/risks.md)

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

> Detailed patterns documentation has been extracted for single responsibility.
> See **[docs/architecture/patterns.md](docs/architecture/patterns.md)** for the full reference.

Adopted patterns include: event-driven architecture, CQRS, saga, circuit breaker, retry/timeout/bulkhead, BFF, health checks, and deployment strategies (rolling, blue-green, canary).

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

> Detailed phased rollout has been extracted for single responsibility.
> See **[docs/architecture/implementation-plan.md](docs/architecture/implementation-plan.md)** for phases 1–5.

---

## Risks & Mitigations

> Detailed risk analysis and Big Tech comparison have been extracted for single responsibility.
> See **[docs/architecture/risks.md](docs/architecture/risks.md)** for the full reference.

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
