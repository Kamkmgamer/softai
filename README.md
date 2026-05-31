# SoftAI

SoftAI is a Next 16 App Router SaaS skeleton for SMB ad-video generation. It includes:

- Marketing site and authenticated app shell
- Project brief flow for ad creation
- Storyboard review UI
- Credit ledger and billing summary
- OpenRouter-backed storyboard, image, and video generation hooks
- Clerk Billing, UploadThing, and Neon integration points
- Admin safety surfaces and abuse reporting

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

The app runs in `demo mode` if external environment variables are missing. Demo mode gives you:

- A seeded demo user
- Starter credits
- A seeded sample project
- Fallback outputs for storyboard, image, and video generation

## Environment

Copy `.env.example` and fill in providers when you want live integrations:

- `OPENROUTER_API_KEY`
- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SIGNING_SECRET`
- `UPLOADTHING_TOKEN`
- `ADMIN_EMAILS`

## Current architecture

- `app/(marketing)`: landing and pricing pages
- `app/(auth)`: Clerk sign-in and sign-up routes
- `app/(app)`: dashboard, project, review, library, billing, settings
- `app/(admin)`: admin and audit view
- `app/api`: Route Handlers matching the SaaS plan contract
- `db/schema.ts`: Postgres/Drizzle schema definitions
- `lib/store.ts`: in-memory demo repository mirroring the Neon data model

## Notes

- Route handlers currently persist to the in-memory store for local usability.
- `db/schema.ts` is ready for the next step of replacing the demo store with a real Neon-backed repository.
- OpenRouter calls fall back to deterministic demo responses when no API key is present.
- Non-essential stock images and videos should stay outside `public/`. Upload production-ready media to cloud storage or a CDN to reduce Vercel bandwidth and asset costs.
