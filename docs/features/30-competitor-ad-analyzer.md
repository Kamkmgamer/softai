# Competitor Ad Analyzer

## Outcome

Users can learn from competitor ads and turn insights into differentiated campaign ideas.

## Users

Business owners, agencies, marketers, ecommerce sellers.

## MVP

- User uploads screenshots/videos or pastes public ad examples.
- Softai analyzes hooks, offer, visuals, CTA, audience, and style.
- Generate original campaign ideas inspired by patterns, not copies.

## Full Version

- Public ad library integrations where allowed.
- Competitive positioning map.
- Trend detection by industry.
- Saved swipe file.

## User Flow

User uploads three competitor ads. Softai summarizes what they are doing and suggests five original angles for the user's product.

## Data Model

- `competitor_examples`: workspace, source, assets, notes.
- `ad_analyses`: hooks, claims, style, audience, opportunities.
- `swipe_files`: saved examples and insights.

## API/Provider Needs

- Vision-capable LLM.
- Video transcription/frame extraction later.
- Optional web fetch/ad library integrations.

## UI Surfaces

- Competitor analyzer route.
- Swipe file/library.
- “Generate from insight” action.

## Dependencies

- Asset Library And Media Storage.
- Project-Aware Campaign Assistant.
- Script Writer And Offer Copy Studio.

## Acceptance Criteria

- User can upload competitor examples and receive structured analysis.
- Output encourages original differentiation.
- Insights can seed campaign generation.
- Uploaded examples are stored privately.

## Risks

- Copyright and copying concerns.
- Web scraping may violate platform terms.
- Analysis can become generic without industry context.
