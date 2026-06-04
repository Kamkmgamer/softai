<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Package Manager 

pnpm is the Package Manager of choice on this  repo.

## Task Completion Requirements

- All of `pnpm lint`, must pass before considering tasks completed.

## Code Freshness

- Before starting any work, run `git pull` to ensure you are on the latest version of the codebase.
- Do not proceed with tasks on a stale branch.

## Project Snapshot

Softai is an AI media generation web application used to generate images and videos. The primary target audience for this application are small business owners that are looking for a cheap way to generate advertisements for their product. 

## Core Priorities

1. Performance first.
2. Reliability first.
3. Keep behavior predictable under load and during failures (session restarts, reconnects, partial streams).

If a tradeoff is required, choose correctness and robustness over short-term convenience.

## Maintainability

Long term maintainability is a core priority. If you add new functionality, first check if there is shared logic that can be extracted to a separate module. Duplicate logic across multiple files is a code smell and should be avoided. Don't be afraid to change existing code. Don't take shortcuts by just adding local logic to solve a problem.

Use these as implementation references when designing agent workflows, UX flows, and operational safeguards.

## Clerk

For all related auth and payment functionality, consult Clerk skills and/or [Clerk docs](https://clerk.com/docs/).

## UI and Style

For UI, styling, Tailwind CSS, and design guidelines, see [STYLES.AGENTS.md](./STYLES.AGENTS.md).
