# Quick Features — Implementation Guides

Step-by-step guides for adding new tools that reuse the existing `CreativeAppForm` + `creative-projects` API pipeline.

All 4 features share the same backend pipeline (`generateReferencedImage`) and differ only in prompt engineering and UI presets.

## Features

| # | Feature | Complexity | Status |
|---|---------|-----------|--------|
| 1 | [Expand Image](01-expand-image.md) | Trivial | To Do |
| 2 | [Stylize Image](02-stylize-image.md) | Trivial | To Do |
| 3 | [Product Reshoot](03-product-reshoot.md) | Trivial | To Do |
| 4 | [Vary Image](04-vary-image.md) | Trivial | To Do |

## Shared Architecture

Each feature touches the same 4 files:
1. `lib/features.ts` — Register the feature tile
2. `lib/validators.ts` — Add Zod schema variant
3. `app/(app)/apps/{slug}/page.tsx` — Create the page (~15 lines)
4. `app/api/apps/creative-projects/route.ts` — Add to API route switch logic

## Common Pattern

All these tools follow the **image-editor pattern**:
- User uploads an image → types a prompt → gets a transformed result
- Backend calls `generateReferencedImage()` via OpenRouter
- Only the prompt template and UI presets differ between tools
