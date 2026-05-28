# Carousel And Social Post Builder

## Outcome

Users can create multi-slide social posts and educational/product carousels from a brief or product.

## Users

Social media managers, small businesses, agencies.

## MVP

- Generate 3 to 8 slide carousel from product/offer/topic.
- Brand-aware slide templates.
- Export as images or PDF.

## Full Version

- Editable slide text and layout.
- Platform-specific safe zones.
- Reels/story adaptations.
- Batch variants by hook or angle.

## User Flow

User enters a topic like “5 reasons to try this skincare product,” chooses Instagram carousel, reviews slide copy, and exports.

## Data Model

- `carousels`: brand, product, platform, title, status.
- `carousel_slides`: order, copy, layout, assets, output.

## API/Provider Needs

- LLM for slide planning/copy.
- Image generation or template rendering.
- Export renderer.

## UI Surfaces

- Carousel builder route.
- Slide review/editor.
- Export screen.

## Dependencies

- Brand Kit And Brand Memory.
- Script Writer And Offer Copy Studio.
- Platform Export Packs.

## Acceptance Criteria

- User can generate a complete multi-slide carousel.
- Slides are individually editable before export.
- Export creates platform-ready assets.
- Carousel is saved to library/project.

## Risks

- Too much text reduces readability.
- Template quality determines perceived value.
- Arabic/RTL layout must be handled intentionally.
