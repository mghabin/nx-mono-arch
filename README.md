# nx-mono-arch

> Enterprise-grade Nx monorepo template designed to scale from small teams to 500-2000+ developers.

[![Nx](https://img.shields.io/badge/Nx-22.6.0-143055?logo=nx)](https://nx.dev)
[![Nx Cloud](https://img.shields.io/badge/Nx%20Cloud-Ready-brightgreen)](https://nx.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## What is this?

A production-ready monorepo template showing how to organize code at scale using [Nx](https://nx.dev).

### Key Features

- **Team Ownership** — Each team owns their bounded context under `src/teams/<name>/`
- **Technology Agnostic** — Supports any frontend, backend, mobile, or cloud stack
- **Minimal Shared** — Only primitives and utilities in `src/shared/`, no business logic
- **Anti-Corruption Layers** — Adapters isolate teams from each other's API changes
- **Enterprise Governance** — ARB, RFC process, dependency policies
- **Nx Cloud** — Remote caching and distributed task execution

## Where Do I Go?

| I am a...                 | Start here                                                                     | What I'll find                           |
| ------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------- |
| 🖥️ **Backend Developer**  | [`src/teams/<team>/apps/*-api/`](src/teams/)                                   | APIs, workers, consumers, orchestrators  |
| 🌐 **Frontend Developer** | [`src/teams/web/`](src/teams/web/)                                             | Web apps, micro-frontends, design system |
| 📱 **Mobile Developer**   | [`src/teams/mobile/`](src/teams/mobile/)                                       | React Native / Expo apps, mobile BFF     |
| ⚙️ **DevOps / SRE**       | [`ops/`](ops/)                                                                 | Terraform, Kubernetes, CI, compliance    |
| 🏗️ **Platform Engineer**  | [`src/teams/platform/`](src/teams/platform/)                                   | Auth, observability, messaging, config   |
| 📐 **Architect**          | [`ARCHITECTURE.md`](ARCHITECTURE.md), [`tools/governance/`](tools/governance/) | ADRs, RFCs, policies                     |
| 🆕 **New to the repo**    | [`docs/onboarding/`](docs/onboarding/)                                         | Role-specific onboarding guides          |

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full architecture document.

## Directory Structure

```
nx-mono-arch/
├── src/                        # All source code
│   ├── teams/                  # Team-owned bounded contexts
│   │   ├── platform/           # Platform & infrastructure services
│   │   ├── orders/             # Orders domain (API, worker, consumer)
│   │   ├── products/           # Products domain (API, worker, consumer)
│   │   ├── mobile/             # Mobile apps
│   │   └── web/                # Web apps, micro-frontends
│   ├── shared/                 # Minimal shared primitives
│   │   ├── libs/               # @shared/types, @shared/utils
│   │   └── packages/           # Publishable configs, SDKs
│   └── packages/               # Top-level workspace packages
│
├── ops/                        # Operational concerns (DevOps starts here)
│   ├── infra/                  # Terraform, Kubernetes, Helm
│   ├── ci/                     # CI pipeline templates, policies
│   ├── compliance/             # SOC2, GDPR evidence
│   └── scripts/                # Automation scripts
│
├── docs/                       # Documentation
│   ├── architecture/           # ADRs, API contracts
│   ├── onboarding/             # Role-specific developer guides
│   └── runbooks/               # Incident response
│
├── tools/                      # Governance & dev tooling
│   ├── governance/             # ARB, RFC, policies
│   ├── generators/             # Nx custom generators
│   └── validators/             # Custom linting rules
│
└── [config files]              # nx.json, package.json, tsconfig.*, etc.
```

### Design Philosophy

| Directory | Contains                       | Rationale                                        |
| --------- | ------------------------------ | ------------------------------------------------ |
| `src/`    | All compilable source code     | Clear boundary: "if it compiles, it's in `src/`" |
| `ops/`    | Infrastructure, CI, compliance | Operational concerns separated from code         |
| `docs/`   | Documentation                  | Industry standard at root for GitHub rendering   |
| `tools/`  | Governance, generators         | Dev tooling and process                          |

## Naming Conventions

Every deployable artifact uses a **suffix** that tells you what it is, how it deploys, and what infrastructure it needs:

### Backend Services

| Suffix           | Type                                | Deploys with              | Example                                         |
| ---------------- | ----------------------------------- | ------------------------- | ----------------------------------------------- |
| `*-api`          | REST / gRPC / GraphQL API           | Load balancer, ingress    | `order-api`, `product-api`                      |
| `*-worker`       | Background job processor            | Queue (Bull, Celery, SQS) | `payment-worker`, `email-worker`                |
| `*-consumer`     | Event/message subscriber            | Pub/Sub (Kafka, RabbitMQ) | `inventory-consumer`, `analytics-consumer`      |
| `*-orchestrator` | Workflow/saga coordinator           | Temporal, Step Functions  | `order-orchestrator`, `onboarding-orchestrator` |
| `*-scheduler`    | Cron / periodic tasks               | Cron trigger, CloudWatch  | `report-scheduler`, `cleanup-scheduler`         |
| `*-stream`       | Real-time stream processor          | Kafka Streams, Flink      | `clickstream-stream`, `fraud-stream`            |
| `*-gateway`      | API Gateway / BFF                   | Edge, public-facing       | `api-gateway`, `mobile-gateway`                 |
| `*-proxy`        | Reverse proxy / protocol translator | Sidecar, mesh             | `grpc-proxy`, `websocket-proxy`                 |
| `*-fn`           | Serverless function                 | Lambda, Cloud Functions   | `resize-fn`, `webhook-fn`                       |
| `*-migration`    | Database migration runner           | One-off job               | `order-migration`                               |
| `*-seed`         | Data seeder / fixture loader        | One-off job               | `catalog-seed`                                  |

### Frontend Apps

| Suffix                     | Type                            | Example                              |
| -------------------------- | ------------------------------- | ------------------------------------ |
| `*-portal` / `*-dashboard` | SPA (React, Angular, Vue)       | `customer-portal`, `admin-dashboard` |
| `*-web`                    | SSR app (Next.js, Nuxt)         | `storefront-web`, `docs-web`         |
| `*-mfe`                    | Micro-frontend fragment         | `checkout-mfe`, `profile-mfe`        |
| `*-site`                   | Static site (Astro, Docusaurus) | `marketing-site`, `api-docs-site`    |
| `*-widget`                 | Embeddable component            | `chat-widget`, `feedback-widget`     |
| `*-emails`                 | Transactional email templates   | `order-emails`, `marketing-emails`   |
| `design-system`            | Storybook / component library   | `design-system`                      |

### Mobile Apps

| Suffix         | Type                             | Example                      |
| -------------- | -------------------------------- | ---------------------------- |
| `*-app`        | Mobile app (RN, Flutter, native) | `consumer-app`, `driver-app` |
| `*-mobile-bff` | Backend-for-frontend (mobile)    | `mobile-bff`                 |

### Libraries (non-deployable)

| Name Pattern       | Purpose                              | Example                    |
| ------------------ | ------------------------------------ | -------------------------- |
| `domain`           | Pure models, events, business rules  | `@orders/domain`           |
| `data-access`      | Repository, ORM, database queries    | `@orders/data-access`      |
| `feature-*`        | Feature module (UI + logic)          | `@web/feature-checkout`    |
| `ui` / `ui-*`      | Presentational components            | `@web/ui`, `@mobile/ui`    |
| `state`            | State management                     | `@web/state`               |
| `messaging`        | Event bus abstractions, producers    | `@platform/messaging`      |
| `auth`             | Auth utilities, guards               | `@platform/auth`           |
| `observability`    | Logging, tracing, metrics            | `@platform/observability`  |
| `config`           | Configuration loading, validation    | `@platform/config`         |
| `sdk` / `client-*` | API client SDK for other teams       | `@orders/sdk`              |
| `adapter-*`        | Anti-corruption layer                | `@orders/adapter-payments` |
| `contract`         | Shared API schema (OpenAPI, Proto)   | `@orders/contract`         |
| `jobs`             | Job definitions for worker/scheduler | `@orders/jobs`             |
| `testing`          | Test utilities, factories, mocks     | `@shared/testing`          |
| `util` / `util-*`  | Pure utility functions               | `@shared/utils`            |

### Tests

| Directory            | Purpose                                  |
| -------------------- | ---------------------------------------- |
| `tests/contract/`    | Consumer-driven contract verification    |
| `tests/integration/` | Service + real dependencies              |
| `tests/e2e/`         | Full flow through multiple services      |
| `tests/load/`        | k6, Artillery, JMeter scripts            |
| `tests/smoke/`       | Post-deploy health verification          |
| `tests/visual/`      | Screenshot regression (Chromatic, Percy) |

## Template Setup

After creating a new repository from this template, customize the following placeholders:

| Placeholder | Files to update |
|---|---|
| `<your-org>` | `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `docs/onboarding/new-developer.md` |
| Nx Cloud | Run `pnpm nx connect` to link your own Nx Cloud workspace |

Search for `<your-org>` across the repo and replace with your GitHub organization/contact info.

## Quick Start

```bash
# Install dependencies
pnpm install

# Visualize the project graph
pnpm run graph

# Type check all projects
pnpm run typecheck

# Run all tests
pnpm run test

# Connect to Nx Cloud (optional, for remote caching & CI distribution)
pnpm nx connect
```

## Common Commands

```bash
# Run a specific target for a project
pnpm nx build <project-name>
pnpm nx test <project-name>
pnpm nx lint <project-name>

# Run affected projects only (CI-optimized)
pnpm nx affected -t build
pnpm nx affected -t test

# Generate a new library
pnpm nx g @nx/js:lib src/teams/<team>/libs/<lib-name> --publishable --importPath=@<team>/<lib-name>
```

## Adding a New Team

```bash
# 1. Create team directory structure
mkdir -p src/teams/new-team/{apps,libs,packages,tests/{contract,integration,e2e,load}}

# 2. Generate domain library
pnpm nx g @nx/js:lib src/teams/new-team/libs/domain --publishable --importPath=@new-team/domain

# 3. Add a team README (see src/teams/orders/README.md as template)

# 4. Add team-specific configuration
# See ARCHITECTURE.md → Team Ownership Model
```

## Technology Support

This template supports any technology via Nx plugins:

| Stack               | Plugin                         |
| ------------------- | ------------------------------ |
| React / Next.js     | `@nx/react`, `@nx/next`        |
| Angular             | `@nx/angular`                  |
| Vue                 | `@nx/vue`                      |
| Node / NestJS       | `@nx/node`                     |
| .NET                | `@nx/dotnet-core`              |
| React Native / Expo | `@nx/react-native`, `@nx/expo` |
| Python              | `@nx/python`                   |
| Go, Rust, Java...   | Community plugins or custom    |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide. In summary:

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Follow the team ownership model
3. Submit RFCs for cross-team changes (`tools/governance/rfc/template.md`)
4. All shared changes require ARB approval

## Security

See [SECURITY.md](./SECURITY.md) for vulnerability reporting.

## License

[MIT](./LICENSE)
