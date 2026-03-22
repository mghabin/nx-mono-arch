# Contributing to nx-mono-arch

Thank you for considering contributing to this project! This document explains how to get started.

## Prerequisites

- **Node.js** 20+ (see `.nvmrc`)
- **pnpm** 10+ (`corepack enable` to activate)
- **Git** with a configured user

## Getting Started

```bash
# Fork and clone the repository (replace <your-org> with your GitHub organization)
git clone https://github.com/<your-org>/nx-mono-arch.git
cd nx-mono-arch

# Install dependencies
pnpm install

# Verify the workspace
pnpm nx run-many -t typecheck
```

## Development Workflow

### Branch Naming

| Type    | Pattern               | Example                      |
| ------- | --------------------- | ---------------------------- |
| Feature | `feat/<team>/<desc>`  | `feat/orders/add-refund-api` |
| Bugfix  | `fix/<team>/<desc>`   | `fix/platform/auth-timeout`  |
| Docs    | `docs/<desc>`         | `docs/update-onboarding`     |
| Infra   | `infra/<desc>`        | `infra/add-staging-env`      |
| Chore   | `chore/<desc>`        | `chore/update-dependencies`  |

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(orders): add order cancellation endpoint
fix(platform): resolve auth token refresh race condition
docs: update backend onboarding guide
chore: bump TypeScript to 5.9
```

### Making Changes

1. Create a branch from `main`
2. Make your changes in the appropriate team directory
3. Run checks locally before pushing:

```bash
# Type check
pnpm nx run-many -t typecheck

# Format
pnpm nx format:check

# Lint (if configured)
pnpm nx run-many -t lint

# Test (if configured)
pnpm nx run-many -t test
```

4. Push and open a Pull Request

### Pull Request Guidelines

- Fill out the PR template completely
- Link related issues
- Ensure CI passes
- Request review from the owning team (see team `README.md` files)
- Keep PRs focused — one concern per PR

## Architecture Decisions

For significant changes that affect multiple teams or shared infrastructure:

1. Create an RFC using the template at `tools/governance/rfc/template.md`
2. Submit it for ARB review (see `tools/governance/arb/README.md`)
3. Wait for approval before implementing

## Directory Rules

- **Stay in your team's directory** — don't modify another team's private code
- **Use published packages** — consume other teams through their `domain` or `sdk` packages
- **Shared packages require ARB approval** — see `tools/governance/policies/dependency-policy.md`

## Reporting Issues

- Use GitHub Issues with the provided templates
- Include reproduction steps, expected behavior, and actual behavior
- Label with the appropriate team

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.
