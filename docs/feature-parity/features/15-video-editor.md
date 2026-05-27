# Video Editor

**Decision:** Undecided  
**Complexity:** XL  
**Suggested priority:** High but phased

#### Description

A browser-based video editor for trimming, subtitles, text overlays, logo overlays, filler-word removal, denoising, background music, and AI chat editing. 3aqel markets a broad editor with viral TikTok-style captions and automated cleanup.

#### Target Users

Creators, SMB marketers, agencies, founders, and social media managers.

#### Why It Matters

Editing is where generated content becomes usable. A narrow editor focused on captions, trimming, and branding would make Softai outputs more publish-ready.

#### Softai Workflow

Users upload or select a video, generate subtitles, choose a caption style, trim start/end, add logo/text overlays, optionally add music, then export.

#### Implementation Requirements

- Video upload and storage.
- Transcription provider.
- Caption generation and styling.
- Trim controls.
- Overlay renderer.
- Remotion/FFmpeg export pipeline.
- Render jobs and progress UI.

#### Risks And Questions

- Full timeline editing is a large product by itself.
- Browser video editing UX can become complex quickly.
- Rendering infrastructure must be reliable.

#### MVP Scope

Start with auto-captions, caption style presets, basic trim, logo overlay, and export. Defer timeline editing, denoise, filler removal, and chat editing.

---
