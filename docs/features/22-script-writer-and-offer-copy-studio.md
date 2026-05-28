# Script Writer And Offer Copy Studio

## Outcome

Users can generate persuasive, brand-aware scripts, hooks, headlines, CTAs, captions, and offer copy for ads.

## Users

Business owners, marketers, agencies, creators.

## MVP

- Generate hooks, headlines, CTAs, captions, and short video scripts from product/offer.
- Tone and platform controls.
- Save copy into project/storyboard.

## Full Version

- Copy frameworks: AIDA, PAS, before-after-bridge, testimonial, objection handling.
- Batch variants.
- Compliance-aware claims suggestions.
- Performance-based recommendations.

## User Flow

User selects a product and platform, asks for 10 hooks, chooses one, and turns it into a video script or static ad headline.

## Data Model

- `copy_generations`: brand, product, platform, type, outputs.
- `copy_assets`: selected copy saved for reuse.

## API/Provider Needs

- LLM provider.
- Prompt templates by platform and industry.

## UI Surfaces

- Copy studio route.
- Inline copy generation in ad/video tools.

## Dependencies

- Brand Kit And Brand Memory.
- Product Catalog And Product Memory.
- Project-Aware Campaign Assistant.

## Acceptance Criteria

- User can generate copy variants for a selected goal.
- Selected copy can be reused in media tools.
- Copy reflects product and brand context.
- Claims are flagged when risky.

## Risks

- LLMs can invent product claims.
- Generic copy reduces value.
- Regulated categories need stronger guardrails.
