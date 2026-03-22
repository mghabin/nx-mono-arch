# Mobile Team

> Owns all mobile applications and the mobile-specific infrastructure layer.

> 📋 **Note**: This README documents the **target architecture**. Apps and libraries listed below are created incrementally using Nx generators as your team grows.

## Service Inventory

| Path                      | Type         | Suffix   | Description                                         |
| ------------------------- | ------------ | -------- | --------------------------------------------------- |
| `apps/consumer-app/`      | Mobile App   | `*-app`  | Customer-facing mobile app (React Native / Flutter) |
| `apps/driver-app/`        | Mobile App   | `*-app`  | Driver / partner app                                |
| `apps/mobile-bff/`        | BFF          | `*-bff`  | Backend-for-frontend optimized for mobile payloads  |
| `apps/notification-push/` | Push Service | `*-push` | Push notification handler (FCM, APNs)               |

## Library Inventory

| Path                     | Import Path                | Purpose                                               |
| ------------------------ | -------------------------- | ----------------------------------------------------- |
| `libs/ui/`               | `@mobile/ui`               | Shared mobile components (buttons, cards, navigation) |
| `libs/navigation/`       | `@mobile/navigation`       | Navigation setup (React Navigation / go_router)       |
| `libs/data-access/`      | `@mobile/data-access`      | API clients, offline sync, cache                      |
| `libs/feature-checkout/` | `@mobile/feature-checkout` | Checkout flow for mobile                              |
| `libs/feature-auth/`     | `@mobile/feature-auth`     | Biometric login, OAuth, token management              |
| `libs/analytics/`        | `@mobile/analytics`        | Mobile analytics (Firebase, Mixpanel)                 |
| `libs/testing/`          | `@mobile/testing`          | Test utilities, mocks, device simulators              |
| `libs/native-modules/`   | `@mobile/native-modules`   | Native bridge code (camera, GPS, payments)            |

## Who Works Here

- **Mobile developers** — App screens, native bridges, offline support
- **Backend developers** — Mobile BFF, push notification service
- **QA engineers** — Device testing, E2E on simulators

## Dependencies

- `@shared/types` — Primitives (UUID, ISO8601, Currency)
- `@orders/sdk` — Client SDK (calls Order API via BFF)
- `@products/sdk` — Client SDK (calls Product API via BFF)
- `@platform/auth` — Authentication, token refresh

## Tests

| Path                 | Type              | Purpose                         |
| -------------------- | ----------------- | ------------------------------- |
| `tests/e2e/`         | E2E               | Detox / Appium device tests     |
| `tests/integration/` | Integration       | BFF + API integration           |
| `tests/visual/`      | Visual regression | Screenshot diffs across devices |

## Getting Started

```bash
# Start the consumer app (iOS)
pnpm nx run consumer-app:run-ios

# Start the consumer app (Android)
pnpm nx run consumer-app:run-android

# Start the mobile BFF
pnpm nx serve mobile-bff

# Run E2E tests
pnpm nx e2e consumer-app-e2e
```
