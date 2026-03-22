# Operations

> Infrastructure, CI/CD, compliance, and automation. **DevOps and SRE start here.**

## Directory Map

| Path                             | Owner         | Description                                                       |
| -------------------------------- | ------------- | ----------------------------------------------------------------- |
| `infra/terraform/`               | Platform Team | Infrastructure as Code (AWS, GCP, Azure)                          |
| `infra/terraform/modules/`       | Platform Team | Reusable Terraform modules (VPC, EKS, RDS, etc.)                  |
| `infra/terraform/environments/`  | Platform Team | Per-environment configs (dev, staging, prod-us, prod-eu, prod-ap) |
| `infra/terraform/global/`        | Platform Team | Global resources (CDN, DNS, WAF)                                  |
| `infra/kubernetes/base/`         | Platform Team | Base K8s manifests (namespaces, RBAC, network policies)           |
| `infra/kubernetes/environments/` | Platform Team | Per-environment overlays (Kustomize / Helm values)                |
| `ci/templates/`                  | Platform Team | Reusable CI pipeline templates (build, test, deploy)              |
| `ci/policies/`                   | Platform Team | OPA / Conftest policies for CI gates                              |
| `compliance/soc2/`               | Security Team | SOC2 control evidence and audit artifacts                         |
| `compliance/gdpr/`               | Security Team | GDPR data mapping and processing records                          |
| `scripts/`                       | Platform Team | Automation scripts (backup, rotate secrets, deploy)               |

## Who Works Here

- **DevOps / SRE** — Terraform, Kubernetes, CI pipelines, monitoring
- **Platform engineers** — Infrastructure modules, deployment strategies
- **Security engineers** — Compliance evidence, policies, access controls

## Infrastructure Stack

| Layer                   | Tool              | Path                     |
| ----------------------- | ----------------- | ------------------------ |
| Cloud provisioning      | Terraform         | `infra/terraform/`       |
| Container orchestration | Kubernetes        | `infra/kubernetes/`      |
| CI/CD                   | GitHub Actions    | `../.github/workflows/`  |
| Policy enforcement      | OPA / Conftest    | `ci/policies/`           |
| Secrets management      | Vault / AWS SSM   | `scripts/`               |
| Monitoring              | Grafana / Datadog | Configured via Terraform |

## Environments

| Environment | Terraform Path                          | Purpose                      |
| ----------- | --------------------------------------- | ---------------------------- |
| `dev`       | `infra/terraform/environments/dev/`     | Development, feature testing |
| `staging`   | `infra/terraform/environments/staging/` | Pre-production validation    |
| `prod-us`   | `infra/terraform/environments/prod-us/` | Production (US region)       |
| `prod-eu`   | `infra/terraform/environments/prod-eu/` | Production (EU region, GDPR) |
| `prod-ap`   | `infra/terraform/environments/prod-ap/` | Production (AP region)       |

## Getting Started

```bash
# Initialize Terraform for dev environment
cd ops/infra/terraform/environments/dev && terraform init

# Plan changes
terraform plan

# Apply (with approval)
terraform apply

# Run policy checks
conftest test ops/infra/kubernetes/ --policy ops/ci/policies/
```

## Relationship to Source Code

```
ops/                          # HOW things deploy
src/teams/<team>/apps/        # WHAT gets deployed
.github/workflows/            # WHEN things deploy
```

Each app in `src/teams/<team>/apps/` has a corresponding:

- **Dockerfile** — co-located with the app
- **K8s manifest** — in `ops/infra/kubernetes/`
- **Terraform config** — in `ops/infra/terraform/` (for managed services the app needs)
- **CI pipeline** — in `.github/workflows/` (using templates from `ops/ci/templates/`)
