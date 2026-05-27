# Static Ad Creative Generator

**Decision:** Undecided  
**Complexity:** Large  
**Suggested priority:** Very high

#### Description

A tool that creates ready-to-publish static ad creatives using product details, offer, audience, generated or uploaded visuals, and ad copy.

3aqel markets this as ad designs with Arabic copy, AI-generated visuals, and platform-ready sizes.

#### Target Users

SMB marketers, founders, ecommerce sellers, agencies, and social media managers.

#### Why It Matters

This is highly aligned with Softai. Users who need video ads usually also need static creatives for Meta, Google Display, Instagram, TikTok thumbnails, and retargeting.

#### Softai Workflow

Users provide product name, offer, CTA, audience, platform, and optional product image. Softai generates ad copy and a layout. The system renders a finished image in selected sizes.

Supported sizes could include:

- Instagram square.
- Instagram story/Reels cover.
- Facebook feed.
- Google display banner.
- LinkedIn post.

#### Implementation Requirements

- Ad brief form or reuse project brief.
- Copy generation service.
- Template/layout renderer using HTML/SVG/canvas/Remotion.
- Generated background or product image placement.
- Export images in multiple sizes.
- Brand kit support for fonts/colors/logo.

#### Risks And Questions

- Fully AI-generated design layouts can be inconsistent.
- Template-driven rendering is more predictable than asking an image model to place Arabic text.
- Need text overflow handling for Arabic and English.

#### MVP Scope

Generate copy plus render template-based static ads in 3 sizes using uploaded product image, generated background, brand colors, and CTA.

---
