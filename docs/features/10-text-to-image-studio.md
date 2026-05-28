# Text-To-Image Studio

## Outcome

Users can generate high-quality business visuals from prompts, recipes, brands, and product context.

## Users

Business owners, marketers, social media managers, agencies.

## MVP

- Prompt, style, aspect ratio, brand, product, output count.
- Generate images and save to library.
- Download and reuse in ads/videos.

## Full Version

- Negative prompts, seeds, reference images, style locking.
- Batch variants.
- In-app comparison and favorite selection.
- Provider/model quality tiers.

## User Flow

User selects a recipe or writes a prompt, chooses aspect ratio and style, then receives image variants saved to the library.

## Data Model

- Uses `generation_jobs`, `generation_outputs`, `assets`.
- Optional `image_settings`: aspect ratio, style, seed, quality.

## API/Provider Needs

- Image generation provider.
- Prompt moderation.
- Image storage.

## UI Surfaces

- `/tools/images`.
- Result gallery.
- Asset reuse actions.

## Dependencies

- AI Provider Router.
- Generation Jobs Queue.
- Asset Library And Media Storage.
- Credits, Costing, And Refunds.

## Acceptance Criteria

- User can generate at least one image from a prompt.
- Image appears in library with settings metadata.
- Credit cost is visible and charged correctly.
- Failed jobs are retryable/refunded.

## Risks

- Text inside images may be unreliable.
- Provider quality varies by product type.
- Prompt UX must guide non-experts.
