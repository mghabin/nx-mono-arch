# Frontend Developer Onboarding

> Everything you need to start building web applications, micro-frontends, and design systems.

## Your Home Base

Frontend code lives in `src/teams/web/`. See the [Web Team README](../../src/teams/web/README.md) for the full inventory.

## What You'll Build

| Type                | Suffix                    | What it does                             |
| ------------------- | ------------------------- | ---------------------------------------- |
| **SPA**             | `*-portal`, `*-dashboard` | Single-page app (React, Angular, Vue)    |
| **SSR App**         | `*-web`                   | Server-side rendered (Next.js, Nuxt)     |
| **Micro-frontend**  | `*-mfe`                   | Module federation / single-spa fragment  |
| **Static Site**     | `*-site`                  | Marketing, docs (Astro, Docusaurus)      |
| **Widget**          | `*-widget`                | Embeddable component (chat, feedback)    |
| **Email Templates** | `*-emails`                | Transactional emails (MJML, React Email) |
| **Design System**   | `design-system`           | Storybook, component library             |

## Project Structure

```
src/teams/web/
├── apps/
│   ├── customer-portal/     # Main customer SPA
│   ├── admin-dashboard/     # Internal admin tool
│   ├── storefront-web/      # SSR storefront
│   └── design-system/       # Storybook
├── libs/
│   ├── ui/                  # Shared components (buttons, forms)
│   ├── state/               # Global state management
│   ├── data-access/         # API clients, React Query hooks
│   ├── feature-checkout/    # Feature module
│   ├── feature-auth/        # Auth flows
│   ├── i18n/                # Internationalization
│   └── analytics/           # Event tracking
└── tests/
    ├── e2e/                 # Cypress / Playwright
    ├── visual/              # Chromatic / Percy
    └── load/                # Lighthouse CI
```

## Key Libraries You'll Use

| Import             | Purpose                 | Owner         |
| ------------------ | ----------------------- | ------------- |
| `@shared/types`    | UUID, ISO8601, Currency | ARB           |
| `@web/ui`          | Shared UI components    | Web Team      |
| `@web/state`       | State management        | Web Team      |
| `@web/data-access` | API clients, hooks      | Web Team      |
| `@orders/sdk`      | Order API client        | Orders Team   |
| `@products/sdk`    | Product API client      | Products Team |
| `@platform/auth`   | Auth utilities          | Platform Team |

## Common Tasks

```bash
# Start the customer portal
pnpm nx serve customer-portal

# Run Storybook
pnpm nx storybook design-system

# Run E2E tests
pnpm nx e2e customer-portal-e2e

# Generate a feature library
pnpm nx g @nx/react:lib src/teams/web/libs/feature-payments --importPath=@web/feature-payments
```

## Rules

1. **Feature modules are self-contained** — Each `feature-*` has its own routes, state, and API calls.
2. **UI components are dumb** — `libs/ui/` has only presentational components. No business logic, no API calls.
3. **Use team SDKs** — Call backend APIs via `@orders/sdk`, not raw fetch to endpoints.
4. **Co-locate styles** — CSS/SCSS lives next to the component, not in a global folder.

## Next Steps

1. Read `src/teams/web/README.md`
2. Run `pnpm nx storybook design-system` to explore components
3. Review `ARCHITECTURE.md` for cross-team patterns
