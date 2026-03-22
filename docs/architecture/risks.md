# Risks & Mitigations

← Back to [ARCHITECTURE.md](../../ARCHITECTURE.md)

> Research-based risk analysis for the monorepo architecture, plus industry comparison.

---

## Extended Risk Analysis

### 1. Nx/Build Performance at Scale

| Risk                            | Severity  | Evidence                           | Mitigation                                 |
| ------------------------------- | --------- | ---------------------------------- | ------------------------------------------ |
| 100+ projects = slow `nx graph` | 🟠 Medium | Nx forums, GitHub issues           | Use Nx Cloud, limit project depth          |
| `nx affected` becomes slow      | 🟠 Medium | Performance degrades >500 projects | Split workspaces, use task filtering       |
| IDE lag with many projects      | 🟡 Low    | VS Code with large workspaces      | Workspace recommendations, sparse checkout |

**Research Finding**: Nx officially supports 100s of projects, but 1000+ requires careful architecture.

**Recommended: Nx Cloud**

```json
// nx.json - with Nx Cloud
{
  "targetDefaults": {
    "build": {
      "cache": true,
      "inputs": ["^build"]
    },
    "test": {
      "cache": true,
      "inputs": ["^build"]
    }
  },
  "useInferencePlugins": false,
  "nxCloudId": "YOUR-NX-CLOUD-ID" // Set via: pnpm nx connect
}
```

**Setup**:

1. Sign up at [nx.app](https://nx.app) (free for small teams)
2. Connect workspace: `pnpm nx connect`
3. Get access token and add to `nx.json`

**What Nx Cloud Stores** (Privacy-Safe):

| Data            | Stored | Notes                  |
| --------------- | ------ | ---------------------- |
| Source code     | ❌ No  | Never uploaded         |
| File hashes     | ✅ Yes | For cache invalidation |
| Build artifacts | ✅ Yes | Compiled outputs only  |
| Build metadata  | ✅ Yes | Times, success/failure |

**Privacy Note**: Only hashes and compiled outputs are stored - no source code. For strict requirements, Nx Cloud Enterprise (self-hosted) is available.

**Additional Optimizations**:

1. **Limit Project Depth**: Keep directory nesting to max 3 levels
2. **Use Task Filtering**:
   ```bash
   pnpm nx build app-name --skip-nx-cache  # For CI
   pnpm nx affected -t build               # Only build affected
   ```
3. **Split Large Workspaces** (if >500 projects): Consider multiple Nx workspaces
4. **IDE Optimization**: Use VS Code Workspace Trust, disable Nxls for non-project files, use sparse checkout

---

### 2. .NET + Node Integration Challenges

| Risk                             | Severity  | Evidence                                    | Mitigation                                        |
| -------------------------------- | --------- | ------------------------------------------- | ------------------------------------------------- |
| Different build systems          | 🟠 Medium | .NET uses MSBuild, Node uses rollup/esbuild | Standardize Nx targets, separate pipelines        |
| Testing fragmentation            | 🟡 Low    | xUnit vs Jest/Vitest                        | Consolidate to Vitest for JS, keep xUnit for .NET |
| NuGet + npm dependency conflicts | 🟠 Medium | Version conflicts between ecosystems        | Separate package registries, lock files           |

**Research Finding**: @nx/dotnet-core is less mature than @nx/react - expect some friction.

---

### 3. Dependency Hell

| Risk                            | Severity  | Evidence                      | Mitigation                              |
| ------------------------------- | --------- | ----------------------------- | --------------------------------------- |
| Diamond dependencies            | 🟠 Medium | A→B→C and A→D→C conflict      | Flatten dependencies, use pnpm strict   |
| Transitive dependency conflicts | 🟠 Medium | Common in large monorepos     | Dedup, lock versions at workspace level |
| Phantom dependencies            | 🟡 Low    | pnpm prevents this by default | Use pnpm (already selected)             |

**Research Finding**: pnpm's strictness helps, but requires team discipline.

---

### 4. Migration from Polyrepo

| Risk                        | Severity  | Evidence                           | Mitigation                             |
| --------------------------- | --------- | ---------------------------------- | -------------------------------------- |
| History loss                | 🟡 Low    | Git history doesn't transfer       | Use git subtree for partial migration  |
| Initial chaos               | 🟠 Medium | Every team moves at different pace | Phased migration, pilot teams first    |
| Breaking existing workflows | 🟠 Medium | Teams resist change                | Extensive onboarding, champion program |

**Research Finding**: Most failures happen in first 6 months - plan for it.

---

### 5. Module Boundary Enforcement Pain

| Risk                              | Severity  | Evidence                      | Mitigation                           |
| --------------------------------- | --------- | ----------------------------- | ------------------------------------ |
| Strict boundaries frustrate teams | 🟠 Medium | Common complaint in Nx issues | Balance strictness with practicality |
| False positives in linting        | 🟡 Low    | Sometimes blocks valid code   | Regular rule review, escape hatches  |
| Circular dependencies sneak in    | 🟠 Medium | Easy to create accidentally   | Automated graph checks in CI         |

**Research Finding**: Teams often relax boundaries after initial period - plan for this.

---

### 6. When to Choose Monorepo vs Polyrepo

| Factor    | Monorepo Better                  | Polyrepo Better            |
| --------- | -------------------------------- | -------------------------- |
| Team size | < 500 developers                 | > 1000 developers          |
| Coupling  | High (frequent shared changes)   | Low (independent releases) |
| Culture   | Trust-based, shared ownership    | Strict team boundaries     |
| Velocity  | Need atomic changes across teams | Teams work independently   |
| Tooling   | Can invest in monorepo tooling   | Standard CI/CD acceptable  |

**Research Finding**: Airbnb, Google moved to monorepo; many others use polyrepo successfully.

---

## Known Risks (Summary)

| Risk                            | Severity  | Mitigation                          |
| ------------------------------- | --------- | ----------------------------------- |
| Monorepo at extreme scale       | 🟠 Medium | Git shallow clones, sparse checkout |
| Cross-team dependency conflicts | 🟠 Medium | ARB, contract testing, adapters     |
| Governance bottleneck           | 🟠 Medium | SLAs, self-service for low-risk     |
| Nx learning curve               | 🟡 Low    | Comprehensive onboarding            |

---

## Comparison with Big Tech

| Aspect             | Google              | Meta                | Stripe         | Our Architecture |
| ------------------ | ------------------- | ------------------- | -------------- | ---------------- |
| Repo Type          | Single giant        | Single giant        | Monorepo       | Monorepo         |
| VCS                | Piper (custom)      | Sapling (custom)    | Git            | Git              |
| Build System       | Blaze/Bazel         | Buck                | Custom + Bazel | Nx               |
| Team Model         | Directory ownership | Directory ownership | Team ownership | Team ownership   |
| Package Management | Direct imports      | Direct imports      | Internal gems  | pnpm             |
| Code Review        | Minimal             | Minimal             | PR-based       | PR-based         |

**Our architecture matches the spirit of Big Tech while using practical, standard tools.**

### What Big Tech Does Differently

| Company | Approach               | Why We Don't                |
| ------- | ---------------------- | --------------------------- |
| Google  | Custom VCS (Piper)     | Can't build custom VCS      |
| Meta    | Custom VCS (Sapling)   | Git is sufficient           |
| Google  | Bazel build            | Nx is closest open-source   |
| Meta    | Direct commits to main | PR workflow provides review |

### When to Consider Changes

- **500+ developers**: Consider splitting into multiple monorepos
- **1000+ developers**: Consider custom tooling investment
- **Extreme scale**: Look at Google/Meta patterns
