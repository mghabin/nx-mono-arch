# Architecture Decision Records (ADRs)

> This directory contains Architecture Decision Records — short documents capturing important architectural decisions and their rationale.

## Format

Each ADR follows this structure:

```
docs/architecture/decision-records/
├── 0001-use-nx-monorepo.md
├── 0002-team-based-directory-structure.md
├── 0003-pnpm-as-package-manager.md
└── ...
```

## Template

```markdown
# ADR-NNNN: [Title]

**Date**: YYYY-MM-DD
**Status**: Proposed | Accepted | Deprecated | Superseded by ADR-NNNN
**Deciders**: [Names or teams]

## Context

What is the issue that we're seeing that is motivating this decision?

## Decision

What is the change that we're proposing and/or doing?

## Consequences

What becomes easier or harder because of this change?
```

## References

- [Michael Nygard's ADR format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ARCHITECTURE.md](../../../ARCHITECTURE.md) for the full architecture document
- [RFC process](../../../tools/governance/rfc/) for larger proposals requiring team review
