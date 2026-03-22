# Mobile Developer Onboarding

> Everything you need to start building mobile apps and the mobile infrastructure layer.

## Your Home Base

Mobile code lives in `src/teams/mobile/`. See the [Mobile Team README](../../src/teams/mobile/README.md) for the full inventory.

## What You'll Build

| Type             | Suffix         | What it does                                       |
| ---------------- | -------------- | -------------------------------------------------- |
| **Mobile App**   | `*-app`        | React Native, Flutter, or native (Swift/Kotlin)    |
| **Mobile BFF**   | `*-mobile-bff` | Backend-for-frontend optimized for mobile payloads |
| **Push Service** | `*-push`       | Push notification handler (FCM, APNs)              |

## Project Structure

```
src/teams/mobile/
├── apps/
│   ├── consumer-app/        # Customer-facing app
│   ├── driver-app/          # Driver / partner app
│   ├── mobile-bff/          # Mobile BFF server
│   └── notification-push/   # Push notification service
├── libs/
│   ├── ui/                  # Shared mobile components
│   ├── navigation/          # React Navigation / go_router
│   ├── data-access/         # API clients, offline sync
│   ├── feature-auth/        # Biometric, OAuth, tokens
│   ├── analytics/           # Firebase, Mixpanel
│   └── native-modules/      # Camera, GPS, payments bridge
└── tests/
    ├── e2e/                 # Detox / Appium
    ├── integration/         # BFF + API integration
    └── visual/              # Screenshot diffs
```

## Common Tasks

```bash
# Run iOS
pnpm nx run consumer-app:run-ios

# Run Android
pnpm nx run consumer-app:run-android

# Start mobile BFF
pnpm nx serve mobile-bff

# Run E2E tests
pnpm nx e2e consumer-app-e2e
```

## Rules

1. **Use the BFF** — Mobile apps call `mobile-bff`, which aggregates backend APIs. Never call domain APIs directly from mobile.
2. **Offline-first** — Use `libs/data-access/` with offline sync for critical flows.
3. **Feature flags** — Use `@platform/config` for runtime feature toggles.
4. **Shared UI** — Reuse `libs/ui/` across all mobile apps.

## Next Steps

1. Read `src/teams/mobile/README.md`
2. Set up your device/emulator
3. Review `ARCHITECTURE.md` for BFF and mobile patterns
