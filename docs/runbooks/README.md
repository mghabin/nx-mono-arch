# Runbooks

> Operational runbooks for incident response, deployment, and troubleshooting.

## Structure

```
docs/runbooks/
├── incident-response.md        # How to handle production incidents
├── deployment-rollback.md      # How to roll back a failed deployment
├── database-recovery.md        # Database backup and restore procedures
├── scaling-procedures.md       # How to scale services up/down
└── on-call-guide.md            # On-call rotation and escalation
```

## Template

Each runbook should follow this format:

```markdown
# Runbook: [Title]

**Last Updated**: YYYY-MM-DD
**Owner**: [Team]
**Severity**: P1 (critical) | P2 (high) | P3 (medium) | P4 (low)

## Symptoms

What does the problem look like? What alerts fire?

## Diagnosis

Step-by-step investigation:

1. Check [specific dashboard/log]
2. Run [specific command]
3. Look for [specific pattern]

## Resolution

Step-by-step fix:

1. [Action]
2. [Action]
3. Verify with [check]

## Escalation

If this doesn't resolve the issue:
- Contact: [team/person]
- Slack: [channel]
```

## References

- [ops/README.md](../../ops/README.md) — Infrastructure and CI/CD guide
- [ARCHITECTURE.md](../../ARCHITECTURE.md) — System architecture
- [docs/onboarding/devops-engineer.md](../onboarding/devops-engineer.md) — DevOps onboarding
