# Standalone Text-To-Image Tool

**Decision:** Undecided  
**Complexity:** Medium  
**Suggested priority:** High

#### Description

A standalone prompt-to-image tool that generates images from Arabic or English descriptions. 3aqel offers style choices, high-quality results, and use cases for ads, social posts, articles, and banners.

#### Target Users

Marketers, founders, ecommerce sellers, social media managers, and creators who need fast visuals without building a full video project.

#### Why It Matters

Softai already has scene image generation internally. Exposing it as a standalone tool creates more immediate value and uses existing infrastructure.

#### Softai Workflow

Users choose an image type, aspect ratio, style, and prompt. Softai generates one or more image variants and stores them in the library. Images can be reused in ad projects, product photography, carousels, or landing pages.

#### Implementation Requirements

- Generalize `generateSceneImage` into an image provider service.
- Add tool registry entry and route.
- Add prompt form with style, aspect ratio, and output count.
- Add output gallery and download controls.
- Add credit cost per image or batch.

#### Risks And Questions

- Need provider-specific handling for aspect ratio and image count.
- Need moderation and abuse reporting for public/shareable outputs.
- Generated text inside images may be unreliable.

#### MVP Scope

Prompt, style preset, aspect ratio, one image output, save to library, download.

---
