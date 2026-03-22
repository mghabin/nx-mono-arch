# Architecture Review Board (ARB)

## Charter

The ARB is responsible for maintaining architectural consistency across the monorepo.

## Responsibilities

- Approve new `@shared/*` packages
- Review cross-team dependencies
- Enforce architecture standards defined in [ARCHITECTURE.md](../../../ARCHITECTURE.md)
- Resolve inter-team conflicts
- Review and approve RFCs

## SLA

| Request Type     | Response Time |
| ---------------- | ------------- |
| Simple approval  | 48 hours      |
| Complex proposal | 1 week        |
| Emergency change | Same day      |

## Members

See [members.json](./members.json) for current ARB members.

## Process

1. Submit an RFC in `tools/governance/rfc/`
2. ARB reviews within SLA
3. Approved → implement; Rejected → revise or close
