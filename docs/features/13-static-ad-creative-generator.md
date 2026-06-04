# Static Ad Creative Generator

## Outcome

Users can generate finished ad images with product, headline, offer, CTA, logo, and platform-safe layout.

## Users

Small businesses, ecommerce sellers, paid media teams, agencies.

## MVP

- Select product, offer, platform, style, and brand.
- Generate one finished static ad image.
- Use Soft-Magic AI-rendered text overlays for reliable copy.

## Full Version

- Multiple layout variants.
- Editable text and layers.
- Dynamic template recommendations.
- Meta/Google/TikTok safe-zone checks.

## User Flow

User chooses “Instagram sale ad,” selects product and offer, picks style, and receives an ad creative ready to download.

## Data Model

- `ad_creatives`: product, brand, format, headline, CTA, source assets, output.
- `creative_layers`: text, image, logo, background positions.

## API/Provider Needs

- Image generation for background/product scene.
- Server-side image composition for text/logo reliability.
- Export resizing.

## UI Surfaces

- Static ad tool.
- Creative editor/preview.
- Export panel.

## Dependencies

- Brand Kit And Brand Memory.
- Product Catalog And Product Memory.
- Text-To-Image Studio.
- Platform Export Packs.

## Acceptance Criteria

- Generated ad includes user-provided offer and CTA accurately.
- Text is readable and not hallucinated by the image model.
- Output is saved and downloadable.
- Brand logo/color can be applied.

## Risks

- Layout generation must be deterministic enough for ads.
- Font licensing and Arabic/RTL support matter.
- Claims in ad copy require compliance checks.
