# General AI Chat

**Decision:** Undecided  
**Complexity:** Medium  
**Suggested priority:** Medium

#### Description

A conversational AI assistant for writing, summarization, brainstorming, Q&A, and business support. 3aqel positions this as an Arabic chat assistant that understands context and supports multi-turn conversations.

#### Target Users

Users who want a simple ChatGPT-like assistant inside Softai instead of switching tools.

#### Why It Matters

General chat can increase session time and reduce context switching. It can also support campaign planning, script brainstorming, and prompt improvement.

However, generic chat is crowded and does not directly differentiate Softai unless tied to campaign workflows.

#### Softai Workflow

Add `/tools/chat` or an assistant panel inside projects. Users can ask for campaign ideas, rewrite offers, summarize product notes, improve scripts, generate angles, or ask operational questions.

Project-aware mode should allow the assistant to understand the current project brief, storyboard, assets, and outputs.

#### Implementation Requirements

- Conversations and messages tables.
- Streaming chat API route.
- Credit metering per response or token band.
- Project context injection.
- Prompt templates for campaign planning.
- Chat history UI.

#### Risks And Questions

- Generic chat may dilute the product if promoted too heavily.
- Long context can increase provider cost.
- Need clear boundaries around advice quality.

#### MVP Scope

Project-aware campaign assistant that helps write and refine briefs, hooks, offers, CTAs, scripts, and captions.

---
