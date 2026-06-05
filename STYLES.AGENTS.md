# STYLES.AGENTS.md

## UI and Style

- This version of Tailwind CSS has breaking changes — Old v3 styles are not working, consult [Tailwind docs](https://tailwindcss.com/docs).
- Use impeccable skill to know how to do elegant designs when asked to make new designs or pages.
- Avoid AI-slop decorative eyebrow labels and pill badges. Do not add tiny uppercase letter-spaced section labels like "Workflow" or "Tools", hero eyebrow pills like "Soft-Magic AI Studio v2.0", or rounded pill chips used only as decoration. Prefer direct headings, clear body copy, and squared product controls for functional metadata.
- Avoid AI-slop icons. Never use Sparkles, Sparkle, Stars, Magic, Wand, WandMagicSparkles, Brain, Bot, Robot, Zap, Cpu, Circuit, Neural, Atom, or Dice icons. These are the universally recognized markers of AI-generated interfaces (per ShapeofAI and Sailop research). Instead, use icons that describe what the feature actually does — e.g. Clapperboard for video, LayoutGrid for browsing, MessageSquare for chat, Aperture for images. Function over magic.
- Avoid AI-slop design patterns. Do not use: `backdrop-blur-md` on navbars (solid backgrounds instead); `transition-all` as default (use specific properties like `transition-colors`, `transition-shadow`); uniform `py-20`/`py-16` on every section (use `clamp()` for responsive spacing); `stagger-children` with identical slideUp on all items (use varied entrances — odd from left, even from up); `rounded-2xl` on everything (vary radii: `rounded-xl` for cards, `rounded-lg` for small images, `rounded-md` for buttons); `ease-in-out` as only easing (use `cubic-bezier(0.16, 1, 0.3, 1)` for fast-start gentle-settle); `grid-cols-3` repeated everywhere (break with 2-col or asymmetric layouts); `animate-shimmer` loading skeletons (use subtle pulse or custom skeleton). Reference: Sailop AI Slop Encyclopedia (87 patterns across 7 dimensions).

## Code Formatting and Style

- **Maintain existing formatting**: Do not revert manually applied code formatting improvements. The codebase uses intentional line breaks, indentation, and formatting for readability.
- **Tailwind CSS v4 syntax**: Use the new Tailwind CSS v4 syntax as shown in the codebase:
  - Use `shadow-(--variable)` instead of `shadow-[var(--variable)]`
  - Use `bg-linear-to-t` instead of `bg-gradient-to-t`
  - Use `min-h-X/4` instead of `min-h-[Xpx]` (e.g., `min-h-155` for `min-h-[620px]`, `min-h-75` for `min-h-[300px]`, `min-h-65` for `min-h-[260px]`)
  - Use `max-w-X/4` instead of `max-w-[Xpx]` (e.g., `max-w-245` for `max-w-[980px]`, `max-w-190` for `max-w-[760px]`)
  - Use `w-X/4` instead of `w-[Xpx]` (e.g., `lg:w-116` for `lg:w-[464px]`)
  - Use `aspect-video` instead of `aspect-[16/9]`
  - Use `tracking-tighter` instead of `tracking-[-0.05em]`
- **Code readability**: Break long lines into multiple lines for readability:
  - Break type annotations with long signatures into multiple lines
  - Break object literals with multiple properties into multiple lines
  - Break long function calls/callbacks into multiple lines
  - Break JSX elements with many props into multiple lines
  - Break ternary expressions into multiple lines
- **Component formatting**: Maintain the existing component formatting style with proper indentation and line breaks.
