# Motion Graphics

**Decision:** Undecided  
**Complexity:** XL  
**Suggested priority:** Medium

#### Description

An animated video tool for Arabic motion graphics, including animated text, shapes, icons, transitions, and explainer-style visuals. 3aqel markets it for product explainers, Reels, YouTube intros/outros, and social content.

#### Target Users

Marketers, content creators, educators, SaaS founders, and agencies.

#### Why It Matters

Motion graphics are useful when users do not have product footage or do not want realistic AI video. They can also be more controllable than generative video.

#### Softai Workflow

Users provide a script or choose an existing storyboard. Softai converts it into animated scenes, applies a motion template, adds narration/music, and renders a video.

#### Implementation Requirements

- Remotion or equivalent video rendering pipeline.
- Motion template library.
- Scene schema for text, shapes, timing, colors, transitions.
- Preview player.
- Background music and voiceover support.
- Render queue and storage.

#### Risks And Questions

- Building a flexible video renderer is a significant engineering effort.
- Template design quality matters heavily.
- Users may request timeline-level control.

#### MVP Scope

Offer 3-5 fixed motion templates that convert a storyboard into a 15-30 second animated explainer with text overlays and simple transitions.

---
