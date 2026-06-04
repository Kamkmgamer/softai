# Performance Feedback Loop

## Outcome

Soft-Magic AI learns which creatives perform and helps users generate better next variants.

## Users

Performance marketers, agencies, ecommerce sellers, business owners running ads.

## MVP

- Manually enter performance metrics for exported assets.
- Track winner/loser notes by campaign variant.
- Assistant suggests next tests from results.

## Full Version

- Import platform metrics from Meta, TikTok, Google, YouTube.
- Creative scorecards.
- Automated next-variant generation.
- Brand/product benchmark history.

## User Flow

User records that Variant B had better CTR but lower conversions. Soft-Magic AI suggests a new variant preserving hook B while changing the offer and landing page CTA.

## Data Model

- `performance_results`: asset/variant, platform, spend, impressions, clicks, conversions, revenue.
- `creative_insights`: generated observations and next actions.

## API/Provider Needs

- Optional ad platform APIs later.
- LLM analysis of metrics and creative metadata.

## UI Surfaces

- Campaign performance tab.
- Variant comparison table.
- Next test suggestions.

## Dependencies

- Campaign Variants And A/B Testing.
- Platform Export Packs.

## Acceptance Criteria

- User can record metrics for a campaign asset.
- Soft-Magic AI can compare variants.
- Suggestions reference actual performance data.
- Historical data remains tied to brand/product/campaign.

## Risks

- Manual entry can be tedious.
- Small data sets can produce bad recommendations.
- Platform API integrations require permissions and maintenance.
