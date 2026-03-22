# New Developer Onboarding

> Welcome to nx-mono-arch. This guide gets you from zero to productive.

## Step 1: Set Up Your Environment

```bash
# Clone the repository
git clone https://github.com/<your-org>/nx-mono-arch.git
cd nx-mono-arch

# Install dependencies
pnpm install

# Verify everything works
pnpm nx run-many -t typecheck
```

## Step 2: Understand the Structure

```
src/teams/     → Team-owned code (where you'll work)
src/shared/    → Shared primitives (types, utils)
ops/           → Infrastructure & DevOps
docs/          → Documentation & onboarding
tools/         → Governance & generators
```

Read the [root README](../../README.md) for the full directory structure and naming conventions.

## Step 3: Pick Your Role-Specific Guide

| Your Role             | Guide                                            | What It Covers                           |
| --------------------- | ------------------------------------------------ | ---------------------------------------- |
| 🖥️ Backend Developer  | [backend-developer.md](./backend-developer.md)   | APIs, workers, consumers, domain libs    |
| 🌐 Frontend Developer | [frontend-developer.md](./frontend-developer.md) | Web apps, micro-frontends, design system |
| 📱 Mobile Developer   | [mobile-developer.md](./mobile-developer.md)     | Mobile apps, BFF, push notifications     |
| ⚙️ DevOps / SRE       | [devops-engineer.md](./devops-engineer.md)       | Terraform, K8s, CI, compliance           |

## Step 4: Find Your Team

Each team has a `README.md` explaining what they own and how to get started:

| Team     | Path                                                                 | Domain                                |
| -------- | -------------------------------------------------------------------- | ------------------------------------- |
| Platform | [`src/teams/platform/README.md`](../../src/teams/platform/README.md) | Auth, messaging, observability        |
| Orders   | [`src/teams/orders/README.md`](../../src/teams/orders/README.md)     | Order lifecycle, payments             |
| Products | [`src/teams/products/README.md`](../../src/teams/products/README.md) | Catalog, inventory, pricing           |
| Web      | [`src/teams/web/README.md`](../../src/teams/web/README.md)           | Customer portal, admin, design system |
| Mobile   | [`src/teams/mobile/README.md`](../../src/teams/mobile/README.md)     | Consumer app, driver app              |

## Step 5: Key Commands

```bash
# Visualize the project dependency graph
pnpm nx graph

# Build affected projects (what your changes impact)
pnpm nx affected -t build

# Type check everything
pnpm nx run-many -t typecheck

# Format code
pnpm nx format --write
```

## Key Documents

| Document                                             | Purpose                                             |
| ---------------------------------------------------- | --------------------------------------------------- |
| [`README.md`](../../README.md)                       | Project overview, naming conventions                |
| [`ARCHITECTURE.md`](../../ARCHITECTURE.md)           | Full architecture (patterns, decisions, team model) |
| [`src/shared/README.md`](../../src/shared/README.md) | Shared library rules                                |
| [`ops/README.md`](../../ops/README.md)               | Infrastructure & DevOps guide                       |
| [`tools/governance/`](../../tools/governance/)       | ARB, RFC process, policies                          |
