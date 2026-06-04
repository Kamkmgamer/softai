# Review Findings

## Scope
Review of the `Soft-Magic AI` SaaS scaffold implementation committed in `ce87fc6`.

## Findings

### 1. Admin mutation endpoints were not admin-only
Severity: High

Affected files:
- [lib/api.ts](/d:/projects/softai/lib/api.ts)
- [app/api/admin/ban-user/route.ts](/d:/projects/softai/app/api/admin/ban-user/route.ts)
- [app/api/admin/credit-adjustment/route.ts](/d:/projects/softai/app/api/admin/credit-adjustment/route.ts)
- [app/api/admin/takedown-output/route.ts](/d:/projects/softai/app/api/admin/takedown-output/route.ts)

Issue:
- Any authenticated user could call admin mutation endpoints and ban users, adjust credits, or record takedowns.

Resolution:
- Added `requireAdminUser()` in `lib/api.ts`.
- Switched all admin mutation handlers to enforce admin access.
- Guarded the admin page and redirect non-admin users to `/dashboard`.

### 2. Output takedown did not actually disable the output
Severity: High

Affected files:
- [lib/types.ts](/d:/projects/softai/lib/types.ts)
- [lib/store.ts](/d:/projects/softai/lib/store.ts)
- [app/api/admin/takedown-output/route.ts](/d:/projects/softai/app/api/admin/takedown-output/route.ts)
- [app/(admin)/admin/page.tsx](/d:/projects/softai/app/(admin)/admin/page.tsx)

Issue:
- The takedown endpoint only logged an admin action. The output itself remained available through normal project reads.

Resolution:
- Added `removedAt` to output records.
- Implemented `takedownOutput()` in the store.
- Filtered removed outputs out of normal project bundles.
- Surfaced removed state in the admin UI.

## Verification
- `pnpm lint`
- `pnpm build`

Both passed after the fixes above.

## Remaining Risk
- The app still uses the in-memory demo store instead of a real Neon-backed repository.
- Polar and OpenRouter webhook handlers are still scaffold endpoints rather than full reconciliation logic.
- `.env.example` exists locally but is ignored by git in the current repo configuration.
