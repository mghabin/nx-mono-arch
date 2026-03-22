# Dependency Policy

## Purpose

Define rules for managing dependencies between teams and packages in the monorepo.

## Rules

### 1. Team Boundaries

- Teams **MUST NOT** directly import from another team's `libs/data-access/` or `libs/features/`
- Teams **MAY** import from another team's published `domain` or `api` packages
- Frontend teams **MUST** consume backend APIs through adapters, never directly

### 2. Shared Packages

- `@shared/*` packages **MUST** contain only primitives, utilities, and cross-team event definitions
- `@shared/*` **MUST NOT** contain business logic
- New `@shared/*` packages require **ARB approval**

### 3. Adding External Dependencies

- New npm dependencies **SHOULD** be added at the workspace root
- Security-sensitive dependencies require **security review**
- Dependencies with known vulnerabilities **MUST NOT** be added

### 4. Dependency Direction

```
✅ Allowed:
  src/teams/web → @orders/api (via adapter)
  src/teams/web → @shared/types
  src/teams/orders → @platform/core

❌ Forbidden:
  src/teams/web → src/teams/orders/libs/data-access
  src/teams/orders → src/teams/products/libs/features
  @shared/* → src/teams/*
```

### 5. Version Pinning

- Lock files **MUST** be committed
- Major version upgrades require team review
- Security patches **SHOULD** be applied within 48 hours
