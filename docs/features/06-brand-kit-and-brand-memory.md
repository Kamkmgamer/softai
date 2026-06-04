# Brand Kit And Brand Memory

## Outcome

Every generated asset can stay consistent with the user's logo, colors, typography, tone, audience, and offer style.

## Users

Small businesses, agencies, ecommerce sellers, franchises.

## MVP

- Store logo, colors, business name, industry, tone, target audience, and preferred CTA style.
- Inject brand context into copy, image, and video prompts.
- Use brand kit in static ad templates.

## Full Version

- Multiple brands per workspace.
- Brand voice examples.
- Visual consistency scoring.
- Brand-safe template recommendations.
- Competitor differentiation notes.

## User Flow

User creates a brand once. Future tools default to that brand and generate outputs that match the brand identity.

## Data Model

- `brands`: workspace, name, industry, description, audience, tone.
- `brand_assets`: logo, fonts, color palette, sample images.
- `brand_memory`: approved phrases, banned phrases, positioning, claims.

## API/Provider Needs

- LLM prompt conditioning.
- Optional color/logo extraction from uploaded assets.
- Optional embedding search over brand notes.

## UI Surfaces

- Settings brand kit page.
- Brand selector in every tool.
- Brand preview card.

## Dependencies

- Asset Library And Media Storage.
- Project-Aware Campaign Assistant.

## Acceptance Criteria

- New generations can select a brand.
- Brand colors and voice are reflected in generated copy/templates.
- Users can edit brand context without breaking old outputs.
- Tool prompts do not require users to repeat brand details.

## Risks

- Generated images may not reproduce logos accurately unless composited by Soft-Magic AI templates.
- Too much brand context can increase token cost.
- Brand memory must distinguish facts from suggestions.
