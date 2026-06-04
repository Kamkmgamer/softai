# Credits, Costing, And Refunds

## Outcome

Soft-Magic AI can monetize expensive AI jobs predictably while protecting users from failed paid generations.

## Users

All paid users, admins, support.

## MVP

- Credit price per feature and quality tier.
- Reserve credits before generation.
- Finalize charge on success.
- Refund failed jobs automatically.
- Show estimated cost before user submits.

## Full Version

- Plan-based pricing, included monthly credits, top-ups, priority generation.
- Cost analytics by provider/model/feature.
- Manual admin adjustments.
- Partial refunds for partial batch failures.

## User Flow

User selects options and sees credit cost. Credits are reserved. If generation succeeds, the reservation becomes a charge. If it fails, credits return.

## Data Model

- `credit_ledger`: user, workspace, type, amount, reason, related job.
- `credit_reservations`: job, amount, status, expiry.
- `feature_prices`: feature, tier, cost, provider estimate.

## API/Provider Needs

- Clerk Billing for subscriptions/payments.
- Provider cost estimates for admin margin control.

## UI Surfaces

- Billing page.
- Generation cost preview.
- Credit history.
- Admin credit adjustment screen.

## Dependencies

- Generation Jobs Queue.
- AI Provider Router.

## Acceptance Criteria

- Users cannot start jobs they cannot afford.
- Failed jobs are not charged.
- Credit ledger is append-only and auditable.
- Cost preview matches actual charge unless documented as an estimate.

## Risks

- Provider costs can change.
- Long-running jobs can hold reservations too long.
- Race conditions can overspend credits without transactional logic.
