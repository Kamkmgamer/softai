# Generation Jobs Queue

## Outcome

Soft-Magic AI reliably handles long-running image, video, audio, and edit tasks without losing state when sessions refresh, providers delay, or requests fail.

## Users

All creators, especially users generating videos or batches.

## MVP

- Persist every generation as a job with `queued`, `running`, `succeeded`, `failed`, and `refunded` states.
- Polling endpoint for job progress.
- Retry failed provider calls when safe.
- User can leave and return while jobs continue.

## Full Version

- Background workers.
- Webhook-first provider completion.
- Priority queues by plan.
- Batch jobs for campaign variants.
- Cancellation and partial result handling.

## User Flow

User starts a generation, sees progress, can navigate away, and later sees the completed result in the project or library.

## Data Model

- `generation_jobs`: user, workspace, project, feature type, status, input hash, progress, error, attempts.
- `generation_outputs`: job, asset, output type, provider result, moderation status.
- `job_events`: status transitions and provider callbacks.

## API/Provider Needs

- `POST /api/generation-jobs` creates jobs.
- `GET /api/generation-jobs/:id` returns state.
- Provider-specific polling/webhook handlers.

## UI Surfaces

- Global generation tray.
- Project generation status cards.
- Library pending/completed filters.
- Retry and report buttons.

## Dependencies

- AI Provider Router.
- Asset Library And Media Storage.
- Credits, Costing, And Refunds.

## Acceptance Criteria

- Refreshing the page does not lose a running job.
- Failed jobs have a visible reason and retry path.
- Duplicate form submissions do not create duplicate charged jobs.
- A completed output appears in the library.

## Risks

- Serverless timeouts require asynchronous design.
- Provider callbacks can arrive late or duplicate.
- Credit charging must be idempotent.
