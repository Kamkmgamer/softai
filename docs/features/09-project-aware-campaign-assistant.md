# Project-Aware Campaign Assistant

## Outcome

Users get a business-aware assistant that helps plan, refine, and troubleshoot campaigns inside the project context.

## Users

Small business owners, marketers, agencies.

## MVP

- Chat panel aware of the current project brief, brand, product, storyboard, assets, and outputs.
- Helps write hooks, scripts, CTAs, captions, offers, and prompts.
- Can suggest next actions inside Softai tools.

## Full Version

- Agentic actions that create drafts, run generations, compare outputs, and prepare exports.
- Campaign strategy mode.
- Memory across projects and brands.

## User Flow

User asks “make this ad more premium” or “give me five hooks for TikTok.” The assistant uses project context and returns actionable copy or tool suggestions.

## Data Model

- `conversations`: user, project, workspace, title.
- `messages`: role, content, context references, token/cost metadata.
- `assistant_actions`: proposed or executed actions.

## API/Provider Needs

- Streaming LLM responses.
- Context builder with size limits.
- Tool/action schema later.

## UI Surfaces

- Project assistant side panel.
- General campaign chat route later.

## Dependencies

- Brand Kit And Brand Memory.
- Product Catalog And Product Memory.
- AI Provider Router.

## Acceptance Criteria

- Assistant answers reflect project-specific details.
- Users can copy output into relevant fields.
- Context injection is bounded and reliable.
- Conversations persist across page reloads.

## Risks

- Overly broad chat can distract from creation workflows.
- Long context can become expensive.
- Assistant must not invent product claims as facts.
