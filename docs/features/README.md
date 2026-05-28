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

## Implementation Phases

### Phase 0: Platform Foundation

Build the primitives that every media tool needs.

1. [AI Provider Router](./01-ai-provider-router.md)
2. [Generation Jobs Queue](./02-generation-jobs-queue.md)
3. [Asset Library And Media Storage](./03-asset-library-and-media-storage.md)
4. [Credits, Costing, And Refunds](./04-credits-costing-and-refunds.md)
5. [Safety, Moderation, And Abuse Controls](./05-safety-moderation-and-abuse-controls.md)

### Phase 1: Business Context

Make every generation business-aware instead of generic.

6. [Brand Kit And Brand Memory](./06-brand-kit-and-brand-memory.md)
7. [Product Catalog And Product Memory](./07-product-catalog-and-product-memory.md)
8. [Prompt And Creative Recipe Library](./08-prompt-and-creative-recipe-library.md)
9. [Project-Aware Campaign Assistant](./09-project-aware-campaign-assistant.md)

### Phase 2: Image And Ad Creation

Give users fast wins with static media.

10. [Text-To-Image Studio](./10-text-to-image-studio.md)
11. [Product Photography Studio](./11-product-photography-studio.md)
12. [AI Image Editor](./12-ai-image-editor.md)
13. [Static Ad Creative Generator](./13-static-ad-creative-generator.md)
14. [Carousel And Social Post Builder](./14-carousel-and-social-post-builder.md)
15. [Logo And Lightweight Brand Asset Studio](./15-logo-and-brand-asset-studio.md)

### Phase 3: Video Creation

Reach Runway-like value for business video ads.

16. [Text-To-Video Studio](./16-text-to-video-studio.md)
17. [Image-To-Video Studio](./17-image-to-video-studio.md)
18. [Multi-Scene Video Ad Creator](./18-multi-scene-video-ad-creator.md)
19. [UGC And Talking-Head Video Generator](./19-ugc-and-talking-head-video-generator.md)
20. [AI Video Editor](./20-ai-video-editor.md)
21. [Video Enhancement And Upscaling](./21-video-enhancement-and-upscaling.md)

### Phase 4: Audio, Copy, And Localization

Generate the supporting campaign media around the visuals.

22. [Script Writer And Offer Copy Studio](./22-script-writer-and-offer-copy-studio.md)
23. [Voiceover, TTS, And Voice Cloning](./23-voiceover-tts-and-voice-cloning.md)
24. [Music And Sound Effects Studio](./24-music-and-sound-effects-studio.md)
25. [Captions, Subtitles, And Localization](./25-captions-subtitles-and-localization.md)

### Phase 5: Campaign Packaging

Turn generated assets into deployable campaigns.

26. [Platform Export Packs](./26-platform-export-packs.md)
27. [Landing Page And Website Generator](./27-landing-page-and-website-generator.md)
28. [Campaign Variants And A/B Testing](./28-campaign-variants-and-ab-testing.md)
29. [Ad Compliance And Claims Checker](./29-ad-compliance-and-claims-checker.md)
30. [Competitor Ad Analyzer](./30-competitor-ad-analyzer.md)
31. [Performance Feedback Loop](./31-performance-feedback-loop.md)

### Phase 6: Collaboration And Operations

Make the product reliable for agencies and businesses.

32. [Team Workspaces And Client Review](./32-team-workspaces-and-client-review.md)
33. [Admin, Observability, And Support Operations](./33-admin-observability-and-support-operations.md)

## Suggested Build Order

1. AI Provider Router.
2. Generation Jobs Queue.
3. Asset Library And Media Storage.
4. Brand Kit And Brand Memory.
5. Product Catalog And Product Memory.
6. Text-To-Image Studio.
7. Product Photography Studio.
8. Static Ad Creative Generator.
9. Image-To-Video Studio.
10. Multi-Scene Video Ad Creator.
11. Voiceover, TTS, And Voice Cloning.
12. Platform Export Packs.
13. AI Image Editor.
14. AI Video Editor.
15. Campaign Variants And A/B Testing.

## Current App Fit

The current app already has a project brief flow, storyboard review, credit ledger, library surface, OpenRouter integration points, UploadThing, Clerk, and demo-mode generation. The roadmap should deepen those into durable production primitives instead of creating isolated one-off tools.
