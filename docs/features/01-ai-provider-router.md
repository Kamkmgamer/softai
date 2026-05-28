# AI Provider Router

## Outcome

Softai can call the best available AI model for each job type while controlling cost, latency, quality, retries, and provider failures.

## Users

Internal platform, all end users indirectly, admins monitoring costs and failures.

## MVP

- One shared provider interface for image, video, text, audio, and edit jobs.
- Provider selection by capability and configured default.
- Store provider, model, request payload summary, result metadata, and cost estimate on every generation.
- Deterministic demo provider remains available for local development.

## Full Version

- Multi-provider routing by quality, price, user plan, region, queue time, and failure rate.
- Automatic fallback when a provider fails or times out.
- Admin-configurable provider weights.
- Per-provider health dashboard.
- Model comparison experiments for output quality.

## User Flow

Users do not choose providers by default. They choose intent, such as product photo, video ad, or voiceover. Softai selects the provider that best matches the job.

## Data Model

- `ai_providers`: provider key, status, supported capabilities, configuration flags.
- `ai_models`: provider key, model key, capability, cost unit, max duration, max resolution.
- `generation_jobs`: provider key, model key, status, cost estimate, request metadata.
- `provider_events`: latency, error code, retry count, quality markers.

## API/Provider Needs

- OpenRouter for LLM/storyboard/copy tasks.
- Image providers for generation and editing.
- Video providers for text-to-video, image-to-video, and editing.
- Audio providers for TTS, music, and transcription.

## UI Surfaces

- No user-facing UI in MVP.
- Admin provider health table later.
- Generation detail drawer can show provider/model for support/debugging.

## Dependencies

- Environment validation.
- Generation Jobs Queue.
- Credits, Costing, And Refunds.

## Acceptance Criteria

- All new generation features call providers through the router.
- Provider errors are normalized into user-safe messages.
- Jobs can fall back to demo mode locally.
- Adding a new provider does not require changing feature UI code.

## Risks

- Provider APIs differ significantly in aspect ratios, polling, webhooks, safety rules, and output formats.
- Poor routing can burn credits or degrade quality.
- Fallbacks must not charge twice unless explicitly configured.
