# Campaign Variants And A/B Testing

## Outcome

Users can create structured creative variants for testing hooks, offers, visuals, CTAs, audiences, and formats.

## Users

Performance marketers, agencies, ecommerce sellers, growth teams.

## MVP

- Generate variants from one campaign brief.
- Vary one dimension at a time: hook, CTA, visual style, offer, audience.
- Label variants clearly.

## Full Version

- Test matrix builder.
- Performance import and winner tracking.
- Auto-suggest next variants based on results.
- Budget-aware creative recommendations.

## User Flow

User has one video ad and asks for “5 hook variants for TikTok.” Soft-Magic AI generates labeled variants and exports them as a campaign pack.

## Data Model

- `campaigns`: brand, product, objective.
- `campaign_variants`: dimension, hypothesis, linked assets, status.
- `performance_results`: platform metrics by variant.

## API/Provider Needs

- LLM variant planning.
- Batch generation jobs.
- Optional ad platform metric imports.

## UI Surfaces

- Variant generator in project.
- Campaign matrix view.
- Winner/notes fields.

## Dependencies

- Multi-Scene Video Ad Creator.
- Static Ad Creative Generator.
- Performance Feedback Loop.

## Acceptance Criteria

- User can generate multiple clearly labeled variants.
- Variants share source campaign context.
- Only selected test dimensions change.
- Exports include useful filenames/metadata.

## Risks

- Uncontrolled variation makes testing meaningless.
- Batch generation can be expensive.
- Users may need education on testing basics.
