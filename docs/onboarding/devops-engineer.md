# DevOps / SRE Onboarding

> Everything you need to manage infrastructure, CI/CD, and operations.

## Your Home Base

Infrastructure and operations live in `ops/`. See the [Ops README](../../ops/README.md) for the full directory map.

## What You'll Manage

| Area                        | Path                             | Tools                       |
| --------------------------- | -------------------------------- | --------------------------- |
| **Cloud Infrastructure**    | `ops/infra/terraform/`           | Terraform (AWS, GCP, Azure) |
| **Container Orchestration** | `ops/infra/kubernetes/`          | Kubernetes, Kustomize, Helm |
| **CI/CD Pipelines**         | `.github/workflows/` + `ops/ci/` | GitHub Actions, Nx Cloud    |
| **Policy Enforcement**      | `ops/ci/policies/`               | OPA, Conftest               |
| **Compliance**              | `ops/compliance/`                | SOC2, GDPR evidence         |
| **Automation**              | `ops/scripts/`                   | Shell scripts, tools        |

## Environments

| Environment | Path                                        | Purpose              |
| ----------- | ------------------------------------------- | -------------------- |
| `dev`       | `ops/infra/terraform/environments/dev/`     | Development          |
| `staging`   | `ops/infra/terraform/environments/staging/` | Pre-production       |
| `prod-us`   | `ops/infra/terraform/environments/prod-us/` | Production US        |
| `prod-eu`   | `ops/infra/terraform/environments/prod-eu/` | Production EU (GDPR) |
| `prod-ap`   | `ops/infra/terraform/environments/prod-ap/` | Production AP        |

## How Source Code Maps to Infrastructure

```
ops/                          # HOW things deploy
src/teams/<team>/apps/        # WHAT gets deployed
.github/workflows/            # WHEN things deploy
```

Each app in `src/teams/<team>/apps/` needs:

- **Dockerfile** — Co-located with the app source
- **K8s manifest** — In `ops/infra/kubernetes/`
- **Terraform config** — For managed services (DB, cache, queue)
- **CI pipeline** — In `.github/workflows/` using `ops/ci/templates/`

## Service Types and Infrastructure Needs

| App Suffix    | Infra Needed                                           |
| ------------- | ------------------------------------------------------ |
| `*-api`       | Load balancer, ingress, TLS, auto-scaling              |
| `*-worker`    | Queue (SQS/Bull), auto-scaling on queue depth          |
| `*-consumer`  | Pub/sub subscription (Kafka/RabbitMQ), consumer groups |
| `*-scheduler` | Cron trigger (CloudWatch Events, K8s CronJob)          |
| `*-gateway`   | Edge proxy, WAF, rate limiting                         |
| `*-migration` | One-off K8s Job, pre-deploy hook                       |

## Common Tasks

```bash
# Initialize Terraform
cd ops/infra/terraform/environments/dev && terraform init

# Plan infrastructure changes
terraform plan

# Run policy checks
conftest test ops/infra/kubernetes/ --policy ops/ci/policies/

# Build and test affected projects
pnpm nx affected -t build
pnpm nx affected -t test
```

## Key Platform Services You'll Deploy

All owned by the Platform team in `src/teams/platform/apps/`:

| Service                | Purpose                            |
| ---------------------- | ---------------------------------- |
| `api-gateway`          | Central API routing, rate limiting |
| `identity-provider`    | Auth (OAuth2, OIDC, SSO)           |
| `notification-service` | Email, SMS, push notifications     |
| `audit-logger`         | Compliance audit trail             |
| `config-service`       | Feature flags, dynamic config      |

## Next Steps

1. Read `ops/README.md`
2. Review `ops/infra/terraform/modules/` for reusable modules
3. Check `.github/workflows/ci.yml` for the CI pipeline
4. Review `ARCHITECTURE.md` for deployment strategies
