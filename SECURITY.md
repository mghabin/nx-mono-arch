# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

### How to Report

1. **Email**: Send details to `security@<your-org>.com`
   > ⚠️ **Template users**: Replace `<your-org>` with your organization's domain.
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

| Step              | Timeline     |
| ----------------- | ------------ |
| Acknowledgment    | 48 hours     |
| Initial triage    | 1 week       |
| Fix & disclosure  | 30 days      |

### Scope

This policy applies to:
- All code in this repository
- Dependencies declared in `package.json`
- Infrastructure-as-code in `ops/`
- CI/CD pipeline configurations

### Dependency Security

- We use `pnpm audit` to monitor known vulnerabilities
- Security patches are applied within 48 hours of disclosure
- Major dependency upgrades require team review (see `tools/governance/policies/dependency-policy.md`)

## Security Best Practices for Contributors

- Never commit secrets, API keys, or credentials
- Use environment variables for sensitive configuration (see `@platform/core` → `getRequiredEnv()`)
- Follow the dependency policy for adding new packages
- Report suspicious activity in the CI/CD pipeline immediately
