# Music Maker

**Decision:** Undecided  
**Complexity:** Medium  
**Suggested priority:** Medium

#### Description

An AI music generation tool that creates original background music by mood, genre, tempo, and duration. 3aqel markets this for videos, podcasts, ads, and social content.

#### Target Users

Video creators, marketers, podcasters, and SMBs that need royalty-safe background tracks.

#### Why It Matters

Music improves video quality and can become part of the video generation workflow. As a standalone tool, it is less core than product photos or ad creatives.

#### Soft-Magic AI Workflow

Users select mood, style, duration, and optional prompt. Soft-Magic AI generates a music track, lets users preview it, and attach it to a video project.

#### Implementation Requirements

- Music generation provider adapter.
- Audio player and output storage.
- Prompt/style/duration form.
- License/commercial-use metadata.
- Integration with video render pipeline.

#### Risks And Questions

- Commercial rights vary by provider.
- Music generation can be expensive.
- Need content moderation for lyrics if supported.

#### MVP Scope

Instrumental background music generation with mood/style/duration, no vocals.

---
