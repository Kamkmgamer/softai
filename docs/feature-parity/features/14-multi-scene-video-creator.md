# Multi-Scene Video Creator

**Decision:** Undecided  
**Complexity:** Large/XL  
**Suggested priority:** Very high

#### Description

A more advanced video tool that creates up to 1-minute videos from multiple scenes, each with its own prompt and optional reference image. 3aqel markets support for up to 7 scenes, vertical or horizontal format, and automatic scene stitching.

#### Target Users

SMB marketers, agencies, creators, ecommerce sellers, and founders creating richer product or brand videos.

#### Why It Matters

This is a direct extension of Softai's current storyboard/video workflow and would improve parity in the core category.

#### Softai Workflow

Users create or generate a scene list. Each scene has prompt, duration, reference image, overlay/caption, and format. Softai generates each scene video or scene image, stitches the scenes, adds audio/captions, and outputs a final video.

#### Implementation Requirements

- Scene-level reference images.
- Scene duration and aspect ratio controls.
- Provider job per scene.
- Stitching/composition service.
- Progress tracking per scene.
- Retry failed scenes.
- Final render job.

#### Risks And Questions

- Multi-scene provider costs can be high.
- Partial failures require robust recovery.
- Visual consistency across scenes is hard.

#### MVP Scope

Support 3-5 scenes, vertical format, optional product/reference image per scene, and automatic final stitching.

---
