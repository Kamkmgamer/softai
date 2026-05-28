# Admin, Observability, And Support Operations

## Outcome

Softai operators can support users, monitor provider health, manage abuse, and understand cost/reliability issues.

## Users

Admins, support, engineering, operations.

## MVP

- Admin view for users, jobs, credits, abuse reports, and takedowns.
- Provider error logs and job status history.
- Manual credit adjustment.

## Full Version

- Provider health dashboard.
- Cost and margin analytics.
- Queue latency monitoring.
- User/session support timeline.
- Incident mode for provider outages.

## User Flow

Support opens a failed job, sees provider error, confirms automatic refund, and tells user whether to retry or use another mode.

## Data Model

- `admin_audit_log`: actor, action, target, reason.
- `provider_events`: latency, failures, status changes.
- `support_notes`: user/project/job notes.

## API/Provider Needs

- Internal admin APIs.
- Provider status/usage data where available.
- Logging/monitoring integration later.

## UI Surfaces

- Existing admin page expanded.
- Job detail screen.
- Provider health screen.
- Abuse and moderation queue.

## Dependencies

- Generation Jobs Queue.
- Credits, Costing, And Refunds.
- Safety, Moderation, And Abuse Controls.

## Acceptance Criteria

- Admins can inspect job lifecycle and credit impact.
- Admin actions are audited.
- Abuse reports can be resolved.
- Provider failures are visible without reading server logs.

## Risks

- Admin tools can expose sensitive user data.
- Audit logging must be reliable.
- Too much operational work can distract from core product if built too early.
