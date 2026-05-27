# Script Writer

**Decision:** Undecided  
**Complexity:** Small/Medium  
**Suggested priority:** High

#### Description

A standalone script-writing tool that generates full video scripts scene-by-scene from topic, duration, tone, audience, and platform. 3aqel markets this for YouTube, Reels, TikTok, education, and ads.

#### Target Users

Marketers, creators, agencies, founders, and educators.

#### Why It Matters

Softai already generates storyboard scripts internally. Exposing script writing as a standalone tool is a low-cost way to increase perceived tool count and utility.

#### Softai Workflow

Users enter topic/product, target audience, duration, platform, tone, and CTA. Softai generates a structured script with scenes, narration, visual directions, hooks, overlays, and CTA.

The script can be exported or converted into a Softai ad-video project.

#### Implementation Requirements

- Script writer route and form.
- Reuse storyboard generation logic with different prompt templates.
- Output editor.
- Export/copy actions.
- Convert-to-project action.

#### Risks And Questions

- Needs differentiation from existing project creation.
- Users may expect long-form scripts beyond ad videos.

#### MVP Scope

Generate short-form ad/video scripts and allow one-click conversion into a project.

---
