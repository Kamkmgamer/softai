# Text-To-Video Studio

## Outcome

Users can generate short business videos from a prompt, offer, product, or campaign recipe.

## Users

Small businesses, creators, marketers, agencies.

## MVP

- Prompt to short video.
- Aspect ratio, duration, style, and motion controls.
- Save video to library.
- Show long-running progress.

## Full Version

- Camera controls, negative prompts, seed, quality tiers.
- Multiple variants.
- Start/end frame controls.
- Prompt enhancer for business ads.

## User Flow

User describes a scene like “cinematic coffee cup on marble counter with steam,” chooses TikTok 9:16, and generates a clip.

## Data Model

- Uses `generation_jobs`, `generation_outputs`, `assets`.
- `video_settings`: duration, aspect ratio, camera motion, style, quality.

## API/Provider Needs

- Text-to-video provider.
- Polling/webhook completion.
- Video storage and thumbnails.

## UI Surfaces

- `/tools/videos/text-to-video`.
- Video preview/result gallery.

## Dependencies

- AI Provider Router.
- Generation Jobs Queue.
- Credits, Costing, And Refunds.
- Asset Library And Media Storage.

## Acceptance Criteria

- User can generate a video from text.
- Job survives refresh and completes asynchronously.
- Output has thumbnail, metadata, and download.
- Credit cost reflects duration/quality.

## Risks

- Video generation is costly and slow.
- Provider output quality is less predictable than image.
- Users need expectations around duration and revisions.
