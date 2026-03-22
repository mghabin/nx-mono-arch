# Web Team

> Owns all customer-facing and internal web applications, including micro-frontends and design system.

> 📋 **Note**: This README documents the **target architecture**. Apps and libraries listed below are created incrementally using Nx generators as your team grows.

## Service Inventory

| Path                    | Type           | Suffix        | Description                               |
| ----------------------- | -------------- | ------------- | ----------------------------------------- |
| `apps/customer-portal/` | SPA            | `*-portal`    | Main customer-facing web application      |
| `apps/admin-dashboard/` | SPA            | `*-dashboard` | Internal admin tool for operations        |
| `apps/storefront-web/`  | SSR            | `*-web`       | SEO-optimized storefront (Next.js / Nuxt) |
| `apps/checkout-mfe/`    | Micro-frontend | `*-mfe`       | Checkout flow (module federation)         |
| `apps/marketing-site/`  | Static site    | `*-site`      | Marketing pages (Astro / Docusaurus)      |
| `apps/design-system/`   | Storybook      | —             | Component library documentation           |
| `apps/chat-widget/`     | Widget         | `*-widget`    | Embeddable customer support chat          |

## Library Inventory

| Path                     | Import Path             | Purpose                                        |
| ------------------------ | ----------------------- | ---------------------------------------------- |
| `libs/ui/`               | `@web/ui`               | Shared UI components (buttons, forms, layouts) |
| `libs/state/`            | `@web/state`            | Global state management (Zustand, Redux)       |
| `libs/data-access/`      | `@web/data-access`      | API clients, React Query hooks, data fetching  |
| `libs/feature-checkout/` | `@web/feature-checkout` | Checkout feature module                        |
| `libs/feature-catalog/`  | `@web/feature-catalog`  | Product browsing feature module                |
| `libs/feature-auth/`     | `@web/feature-auth`     | Login, registration, password reset            |
| `libs/i18n/`             | `@web/i18n`             | Internationalization utilities                 |
| `libs/analytics/`        | `@web/analytics`        | Client-side analytics, event tracking          |
| `libs/testing/`          | `@web/testing`          | Test utilities, component mocks, MSW handlers  |

## Who Works Here

- **Frontend developers** — UI components, pages, state management
- **UX/UI designers** — Design system, Storybook stories
- **QA engineers** — E2E tests, visual regression tests

## Dependencies

- `@shared/types` — Primitives (UUID, ISO8601, Currency)
- `@orders/sdk` — Client SDK (calls Order API)
- `@products/sdk` — Client SDK (calls Product API)
- `@platform/auth` — Authentication utilities

## Tests

| Path            | Type              | Purpose                              |
| --------------- | ----------------- | ------------------------------------ |
| `tests/e2e/`    | E2E               | Cypress / Playwright full user flows |
| `tests/visual/` | Visual regression | Chromatic / Percy screenshot diffs   |
| `tests/load/`   | Load              | Lighthouse CI, Web Vitals thresholds |

## Getting Started

```bash
# Start the customer portal
pnpm nx serve customer-portal

# Run Storybook
pnpm nx storybook design-system

# Run E2E tests
pnpm nx e2e customer-portal-e2e
```
