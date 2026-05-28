# Logo And Lightweight Brand Asset Studio

## Outcome

New businesses can create lightweight brand assets quickly when they do not already have a mature identity.

## Users

Startups, local businesses, creators, early ecommerce sellers.

## MVP

- Generate logo concepts from business name, industry, and style.
- Generate simple color palettes and social avatar/banner assets.
- Save selected assets to brand kit.

## Full Version

- Editable vector-like logo workflow.
- Brand guidelines PDF.
- Icon, pattern, and packaging mockups.
- Trademark warning/disclaimer flow.

## User Flow

User enters business name and style. Softai generates logo concepts, the user selects one, and it becomes part of the brand kit.

## Data Model

- `brand_asset_generations`: brand, style, selected output.
- Uses `assets` and `brand_assets`.

## API/Provider Needs

- Image/logo generation.
- Optional vectorization.
- Image composition/export.

## UI Surfaces

- Brand kit “create logo” flow.
- Logo result gallery.

## Dependencies

- Brand Kit And Brand Memory.
- Text-To-Image Studio.

## Acceptance Criteria

- User can generate and save a logo concept.
- Saved logo is available in ad templates.
- Clear disclaimer explains generated logo uniqueness limits.

## Risks

- AI logos may not be trademark-safe.
- Text rendering can be poor; use compositing where possible.
- This should not distract from ad/media core.
