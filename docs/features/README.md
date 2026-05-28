# Softai Feature Roadmap

This catalog turns Softai into a Runway-style AI media studio focused on small businesses: product photos, ad creatives, video ads, social content, landing pages, and campaign iteration.

The goal is not to copy Runway feature-for-feature for filmmakers. The goal is near parity in practical AI media tooling while specializing the workflows for founders, local businesses, ecommerce sellers, agencies, and social media teams.

## Product Positioning

Softai should become the place where a business owner can upload a product, describe an offer, choose a platform, and generate every asset needed for a campaign.

Core promise:

> From one product photo and one business brief, generate a complete ad campaign: images, videos, copy, voiceover, captions, exports, and performance variants.

## Planning Model

Each feature file uses the same structure:

- Outcome: the business result the feature should create.
- Users: who needs it.
- MVP: the smallest useful version.
- Full version: where it should end up.
- User flow: how it works in the product.
- Data model: tables or records likely needed.
- API/provider needs: external model or service requirements.
- UI surfaces: app routes and screens.
- Dependencies: features or infrastructure required first.
- Acceptance criteria: how we know it is complete.
- Risks: product, technical, cost, safety, and quality concerns.

## Current State Audit

Status legend:
- **BUILT** -- fully working, shipped
- **PARTIAL** -- exists but has gaps
- **MISSING** -- not implemented

| # | Feature | Status | Notes |
|---|---|---|---|
| 1 | AI Provider Router | **PARTIAL** | OpenRouter wired for text/image/video but no unified abstraction. Adding a second provider means touching multiple files. |
| 2 | Generation Jobs Queue | **PARTIAL** | Table + credit hold/settle/refund exists. Image rendering is synchronous (blocks request). Video has basic polling, no retry/background worker. |
| 3 | Asset Library And Media Storage | **PARTIAL** | Library page shows completed projects. UploadThing uploads work. No cross-project asset library, no search, no favorites, no reuse across generations. |
| 4 | Credits, Costing, And Refunds | **BUILT** | Hold/settle/refund pattern. Ledger, billing page, Clerk billing webhooks all functional. |
| 5 | Safety, Moderation, And Abuse Controls | **BUILT** | Abuse reports, admin ban/takedown, audit logging, settings trust & safety page. |
| 6 | Brand Kit And Brand Memory | **PARTIAL** | Logo/product image upload per project works. No cross-project brand kit, no color palette, no tone/voice memory, no brand consistency enforcement. |
| 7 | Product Catalog And Product Memory | **PARTIAL** | Product name/description/offer are project brief fields. No standalone product records, no product library, no reuse across projects. |
| 8 | Prompt And Creative Recipe Library | **MISSING** | `lib/prompt-presets.ts` defines presets but they are not surfaced in any UI. |
| 9 | Project-Aware Campaign Assistant | **BUILT** | Streaming chat with project context, credit metering, quick suggestions. |
| 10 | Text-To-Image Studio | **BUILT** | Gemini via OpenRouter generates 9:16 scene images. Demo fallback works. |
| 11 | Product Photography Studio | **MISSING** | Brand assets are uploaded but not injected into image generation prompts. |
| 12 | AI Image Editor | **MISSING** | No background remove, generative fill, object removal, or expand. |
| 13 | Static Ad Creative Generator | **PARTIAL** | Scene images generated but text overlays are hallucinated by image model (unreliable). No server-side compositing. |
| 14 | Carousel And Social Post Builder | **MISSING** | Not implemented. |
| 15 | Logo And Brand Asset Studio | **MISSING** | Not implemented. |
| 16 | Text-To-Video Studio | **BUILT** | Grok Imagine Video via OpenRouter with polling and webhook. |
| 17 | Image-To-Video Studio | **MISSING** | Scene images exist but are not fed as reference frames to video generation. |
| 18 | Multi-Scene Video Ad Creator | **BUILT** | Storyboard to scene images to video render pipeline works end-to-end. |
| 19 | UGC And Talking-Head Video Generator | **MISSING** | Not implemented. |
| 20 | AI Video Editor | **MISSING** | No trim, captions, overlays, timeline. |
| 21 | Video Enhancement And Upscaling | **MISSING** | Not implemented. |
| 22 | Script Writer And Offer Copy Studio | **BUILT** | Storyboard generation produces hooks, headlines, CTAs, scene scripts. Bilingual EN/AR. |
| 23 | Voiceover, TTS, And Voice Cloning | **MISSING** | Narration is text-only, no audio generation. |
| 24 | Music And Sound Effects Studio | **MISSING** | Not implemented. |
| 25 | Captions, Subtitles, And Localization | **MISSING** | Not implemented. |
| 26 | Platform Export Packs | **MISSING** | No aspect ratio presets, no batch export, no platform-specific formatting. |
| 27 | Landing Page And Website Generator | **MISSING** | Not implemented. |
| 28 | Campaign Variants And A/B Testing | **MISSING** | Not implemented. |
| 29 | Ad Compliance And Claims Checker | **MISSING** | Not implemented. |
| 30 | Competitor Ad Analyzer | **MISSING** | Not implemented. |
| 31 | Performance Feedback Loop | **MISSING** | Not implemented. |
| 32 | Team Workspaces And Client Review | **MISSING** | Single-user only. |
| 33 | Admin, Observability, And Support Operations | **PARTIAL** | Admin console with ban/takedown/credits works. No provider health dashboard, no cost analytics, no job lifecycle visibility. |

### Summary

- **BUILT**: 9 features
- **PARTIAL**: 8 features
- **MISSING**: 16 features

---

## Implementation Phases

Each phase is a self-contained sprint. Phases are ordered by dependency and user impact. Within each phase, features are ordered by implementation priority.

### Phase 0: Harden The Foundation

Goal: Make the existing primitives production-ready before adding new features.

| # | Feature | Status | What To Do |
|---|---|---|---|
| 1 | [AI Provider Router](./01-ai-provider-router.md) | PARTIAL | Extract a unified provider abstraction from `lib/openrouter.ts`. One interface for text, image, video, audio. Provider config table. Fallback chain. Admin provider health. |
| 2 | [Generation Jobs Queue](./02-generation-jobs-queue.md) | PARTIAL | Make image rendering async (move to background job). Add retry logic. Add generation tray UI for progress. Survive page refresh. |
| 3 | [Asset Library And Media Storage](./03-asset-library-and-media-storage.md) | PARTIAL | Unified asset library across projects. Add search, filter by type, favorites, reuse action. Decouple from project-only view. |
| 4 | [Credits, Costing, And Refunds](./04-credits-costing-and-refunds.md) | BUILT | No changes needed. Verify edge cases (double-charge prevention, reservation expiry). |
| 5 | [Safety, Moderation, And Abuse Controls](./05-safety-moderation-and-abuse-controls.md) | BUILT | Add pre-generation prompt moderation before expensive provider calls. Output moderation for images/video later. |

Exit criteria: Provider abstraction is swappable. Jobs are async. Assets are reusable. Credit edge cases covered.

### Phase 1: Business Memory

Goal: Every generation is brand-aware and product-aware by default.

| # | Feature | Status | What To Do |
|---|---|---|---|
| 6 | [Brand Kit And Brand Memory](./06-brand-kit-and-brand-memory.md) | PARTIAL | Cross-project brand records. Logo, colors, tone, audience, banned phrases. Inject brand context into all generation prompts. Brand selector in project creation. |
| 7 | [Product Catalog And Product Memory](./07-product-catalog-and-product-memory.md) | PARTIAL | Standalone product records with photos, description, price, benefits. Product library page. Product picker in project creation. Reuse product across projects. |
| 8 | [Prompt And Creative Recipe Library](./08-prompt-and-creative-recipe-library.md) | MISSING | Surface existing presets in UI. Recipe gallery by category (product photo, ad, video, carousel). Save successful generations as recipes. |
| 9 | [Project-Aware Campaign Assistant](./09-project-aware-campaign-assistant.md) | BUILT | No changes needed for MVP. Consider adding agentic actions (create draft, run generation) in later phases. |

Exit criteria: User creates one brand and one product, then every tool remembers them.

### Phase 2: Image Tools

Goal: Users can create and edit professional product images without leaving Softai.

| # | Feature | Status | What To Do |
|---|---|---|---|
| 10 | [Text-To-Image Studio](./10-text-to-image-studio.md) | BUILT | Already works. Add style presets, negative prompts, seed control, batch variants. |
| 11 | [Product Photography Studio](./11-product-photography-studio.md) | MISSING | Inject uploaded product photos into image generation prompts. Scene presets (studio, lifestyle, outdoor). Product cutout + background replace. |
| 12 | [AI Image Editor](./12-ai-image-editor.md) | MISSING | Background remove/replace. Generative fill. Object removal. Image expand. Mask brush. Version history. |
| 13 | [Static Ad Creative Generator](./13-static-ad-creative-generator.md) | PARTIAL | Server-side text/logo compositing (do not rely on image model for text). Ad templates by platform. Brand logo injection. |
| 14 | [Carousel And Social Post Builder](./14-carousel-and-social-post-builder.md) | MISSING | Multi-slide generator from product/offer. Slide templates. Export as images or PDF. |
| 15 | [Logo And Brand Asset Studio](./15-logo-and-brand-asset-studio.md) | MISSING | Logo concept generation from business name/style. Save to brand kit. Disclaimer about uniqueness. |

Exit criteria: User can generate product photos, edit images, create static ads, and build carousels.

### Phase 3: Video Tools

Goal: Users can create complete video ads with motion, voice, and captions.

| # | Feature | Status | What To Do |
|---|---|---|---|
| 16 | [Text-To-Video Studio](./16-text-to-video-studio.md) | BUILT | Already works. Add duration/quality presets, camera controls, seed, multiple variants. |
| 17 | [Image-To-Video Studio](./17-image-to-video-studio.md) | MISSING | Feed product/generated images as start frames to video provider. Motion presets (push, pan, zoom, static). |
| 18 | [Multi-Scene Video Ad Creator](./18-multi-scene-video-ad-creator.md) | BUILT | Already works. Add scene regeneration, hook variants, timeline editor, voiceover integration. |
| 19 | [UGC And Talking-Head Video Generator](./19-ugc-and-talking-head-video-generator.md) | MISSING | Integrate avatar/talking-head provider. Script-to-video with spokesperson. Consent workflow. |
| 20 | [AI Video Editor](./20-ai-video-editor.md) | MISSING | Trim, split, text overlays, logo watermark, caption burn-in, music track, export presets. |
| 21 | [Video Enhancement And Upscaling](./21-video-enhancement-and-upscaling.md) | MISSING | Upscale, sharpen, noise reduction, thumbnail generation, batch enhancement. |

Exit criteria: User can go from product photo to finished video ad with voiceover and captions.

### Phase 4: Audio And Copy

Goal: Every campaign asset has supporting audio and persuasive copy.

| # | Feature | Status | What To Do |
|---|---|---|---|
| 22 | [Script Writer And Offer Copy Studio](./22-script-writer-and-offer-copy-studio.md) | BUILT | Already works. Add copy frameworks (AIDA, PAS), batch variants, compliance-aware suggestions. |
| 23 | [Voiceover, TTS, And Voice Cloning](./23-voiceover-tts-and-voice-cloning.md) | MISSING | Integrate TTS provider. Voice selection by language/tone. Attach to video projects. Consent for voice cloning. |
| 24 | [Music And Sound Effects Studio](./24-music-and-sound-effects-studio.md) | MISSING | Stock music categories or music generation provider. Sound effects by prompt. Auto-duck under voiceover. |
| 25 | [Captions, Subtitles, And Localization](./25-captions-subtitles-and-localization.md) | MISSING | Speech-to-text for caption generation. Burn captions into video. Translate captions. RTL support. |

Exit criteria: Video ads have voiceover, music, and captions. Copy studio produces campaign-ready text.

### Phase 5: Campaign Packaging

Goal: Generated assets become deployable campaigns with export, variants, and compliance.

| # | Feature | Status | What To Do |
|---|---|---|---|
| 26 | [Platform Export Packs](./26-platform-export-packs.md) | MISSING | Export presets for TikTok, Instagram, YouTube Shorts, Meta, Google. Safe-zone overlays. Batch export. |
| 27 | [Landing Page And Website Generator](./27-landing-page-and-website-generator.md) | MISSING | Generate landing page from campaign brief. Match ad visuals. Lead capture. Publish to Softai URL. |
| 28 | [Campaign Variants And A/B Testing](./28-campaign-variants-and-ab-testing.md) | MISSING | Generate labeled variants (hook, CTA, visual, offer). Campaign matrix view. Export as variant pack. |
| 29 | [Ad Compliance And Claims Checker](./29-ad-compliance-and-claims-checker.md) | MISSING | Scan copy for risky claims. Flag unsupported absolutes, medical/financial claims. Suggest safer rewrites. |
| 30 | [Competitor Ad Analyzer](./30-competitor-ad-analyzer.md) | MISSING | Upload competitor ads. Analyze hooks, offer, visuals, CTA. Generate original ideas from patterns. |
| 31 | [Performance Feedback Loop](./31-performance-feedback-loop.md) | MISSING | Record metrics per variant. Compare performance. Suggest next tests from results. |

Exit criteria: User exports platform-ready ad packs, generates landing pages, runs A/B tests, and learns from performance.

### Phase 6: Collaboration And Operations

Goal: The product works for teams, agencies, and at scale.

| # | Feature | Status | What To Do |
|---|---|---|---|
| 32 | [Team Workspaces And Client Review](./32-team-workspaces-and-client-review.md) | MISSING | Workspace members, roles, permissions. Project sharing. Comment-only review links. Approval status. |
| 33 | [Admin, Observability, And Support Operations](./33-admin-observability-and-support-operations.md) | PARTIAL | Provider health dashboard. Cost/margin analytics. Queue latency monitoring. User support timeline. Incident mode. |

Exit criteria: Teams can collaborate. Admins have full visibility into system health and cost.

---

## Implementation Order (Sprint Map)

This is the order to work through the phases. Each phase can be broken into 1-3 sprints.

```
Phase 0 (Foundation)        ──── Start here. Unblocks everything.
  Sprint 0.1: Provider abstraction + async jobs
  Sprint 0.2: Unified asset library + search
  Sprint 0.3: Prompt moderation + edge case hardening

Phase 1 (Business Memory)   ──── Makes all future features brand-aware.
  Sprint 1.1: Cross-project brand kit
  Sprint 1.2: Product catalog + product picker
  Sprint 1.3: Recipe library + prompt presets in UI

Phase 2 (Image Tools)       ──── Fast user-facing wins.
  Sprint 2.1: Product photography studio
  Sprint 2.2: AI image editor (bg remove, fill, expand)
  Sprint 2.3: Static ad generator (server-side compositing) + carousels

Phase 3 (Video Tools)       ──── Core Runway parity.
  Sprint 3.1: Image-to-video
  Sprint 3.2: Video editor (trim, captions, overlays)
  Sprint 3.3: UGC/talking-head + video enhancement

Phase 4 (Audio + Copy)      ──── Complete the media stack.
  Sprint 4.1: TTS/voiceover
  Sprint 4.2: Music/SFX
  Sprint 4.3: Captions + localization

Phase 5 (Campaign Pack)     ──── Turn assets into campaigns.
  Sprint 5.1: Platform export packs
  Sprint 5.2: Landing page generator
  Sprint 5.3: A/B variants + compliance + competitor analysis

Phase 6 (Team + Ops)        ──── Scale to teams and reliability.
  Sprint 6.1: Team workspaces + review links
  Sprint 6.2: Admin observability dashboard
```
