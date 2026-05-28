# Prompt And Creative Recipe Library

## Outcome

Users can start from proven campaign recipes instead of blank prompts.

## Users

Non-expert business owners, marketers, agencies.

## MVP

- Curated templates for product photos, static ads, video ads, carousels, hooks, and CTAs.
- Recipe inputs map to brand, product, offer, audience, style, platform, and aspect ratio.
- Save successful prompts as reusable recipes.

## Full Version

- Public and private recipe marketplace.
- Performance-tagged recipes.
- Industry-specific recipe packs.
- Recipe versioning and remixing.

## User Flow

User chooses a goal like “launch offer video” or “premium product photo.” Softai asks for only the missing fields and generates the asset.

## Data Model

- `creative_recipes`: category, fields, prompt template, default settings, examples.
- `saved_recipes`: workspace, user edits, source output.
- `recipe_runs`: recipe, job, performance metadata.

## API/Provider Needs

- LLM prompt expansion.
- Provider parameter mapping.

## UI Surfaces

- Recipe gallery.
- Recipe detail/start screen.
- Save as recipe action on generation results.

## Dependencies

- Brand Kit And Brand Memory.
- Product Catalog And Product Memory.
- AI Provider Router.

## Acceptance Criteria

- Users can generate without writing freeform prompts.
- Recipes work across at least image and static ad tools.
- Saved recipes preserve inputs and settings.
- Recipe results are tracked for reuse.

## Risks

- Too many templates can overwhelm users.
- Recipes must stay compatible with provider changes.
- Generic recipes weaken differentiation.
