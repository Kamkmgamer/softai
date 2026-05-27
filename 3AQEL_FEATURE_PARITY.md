# 3aqel Feature Parity Research

## Summary

3aqel positions itself as an Arabic-first AI tools suite for SMBs, not just an ad-video generator. Public pages market "29 tools," while the public app bundle exposes 21 active tool configs plus additional gated/admin/user-flow chunks.

Softai currently covers a narrower but deeper workflow: product brief -> storyboard -> scene images -> final short ad video, with credits, Clerk billing, uploads, admin safety, abuse reports, and library.

The main gap is that 3aqel offers many standalone creation tools around images, audio, web pages, education, business advice, and video editing. Softai is currently focused on ad-video campaign generation.

## What Softai Already Has

| Area | Softai Status |
|---|---|
| Auth and billing | Clerk auth, Clerk Billing, credit ledger |
| Project workflow | Product brief, target audience, brand voice, CTA, script seed |
| Storyboarding | AI storyboard generation, editable scenes, narration, visual prompts, overlays |
| Image generation | Scene image generation for storyboard scenes |
| Video generation | Final video render from scene prompts/images |
| Uploads/assets | UploadThing integration points, brand assets schema |
| Avatars | Avatar/reference photo schema and policy state |
| Library | Completed campaign list and export surface |
| Admin/safety | Admin actions, takedown, ban user, abuse reports |
| Demo mode | Deterministic local fallback outputs |

## 3aqel Feature Gaps

| Feature | 3aqel Offering | Do We Have It? | Complexity | Implementation Approach |
|---|---:|---:|---:|---|
| Arabic-first product UX | Full Arabic interface, Arabic copy, Arabic tool naming, RTL positioning | No | Medium | Add `next-intl` or equivalent i18n layer, RTL layout support, Arabic marketing/app copy, Arabic prompt presets. Start with Arabic locale for marketing, dashboard, project flow, errors, billing. |
| General AI chat | Arabic chat assistant for Q&A, summarization, writing, brainstorming | No | Medium | Add `/tools/chat`, `conversations`, `messages` tables, stream OpenRouter chat completions, persist history, attach credits per message or per response. |
| Standalone text-to-image | Prompt-to-image tool with styles, colors, formats | Partial | Medium | Extract current `generateSceneImage` into generic image-generation service. Add prompt form, style presets, aspect ratio selector, output gallery. |
| Image editor | Edit/enhance existing images with text instructions, background change, object removal, quality improvement | No | Large | Add upload input, mask/reference support if provider allows it, provider adapter for image-to-image editing, edit history, output versioning. |
| Virtual product photography studio | Upload product photo, choose studio/background/lighting/angle, generate product shots | No | Large | Build product-photo tool using image-to-image model. Add presets for backgrounds, lighting, camera angle, batch up to 4 images, before/after gallery. This is high-value for Softai's SMB ad target. |
| Logo studio | Generate multiple logo options from business identity and style | No | Medium | Add logo prompt builder with industry, brand values, colors, typography style. Generate 4 variants, optional transparent background/post-processing. |
| Ad creative generator | Static ad designs with generated image and Arabic ad copy in platform sizes | Partial | Large | Reuse project brief fields. Generate ad copy plus image/layout metadata. Render final static creatives with HTML/SVG/canvas/Remotion. Add sizes for Meta, Google Display, Instagram. |
| Carousel builder | Arabic social carousel slides for Instagram/LinkedIn/Twitter | No | Large | Generate slide outline/copy, then render slide images from templates. Store carousel projects and export ZIP/PDF/images. |
| Motion graphics | Arabic animated text/shapes, templates, high-quality export | No | XL | Add Remotion-based template system, scene schema, animation presets, render queue, storage, preview. Can reuse storyboard data. |
| Talking-head videos | AI avatar/persona speaking with lip sync, Arabic TTS, optional cloned voice | Partial avatar only | XL | Add avatar selection/upload, TTS generation, lip-sync provider, video composition, consent checks for likeness/voice. |
| Voice cloning and TTS | Clone user voice, generate Arabic voiceover, use in video tools | No | Large | Integrate ElevenLabs or similar. Add voice samples, consent flow, `voices` table, voice generation jobs, usage limits, deletion controls. |
| Music maker | Generate original background music by mood/style/tempo | No | Medium | Add audio generation provider adapter, prompt fields for mood/duration/style, output player/download, commercial-use metadata. |
| Script writer | Full video scripts scene-by-scene by topic, duration, tone | Partial | Small/Medium | Softai already generates storyboard scripts. Expose it as standalone `/tools/script-writer` with duration/tone/platform fields and export/copy actions. |
| Multi-scene video creator | Up to 7 scenes, up to 1 minute, reference image per scene, landscape/vertical, auto-stitch | Partial | Large/XL | Extend current storyboard/video model with per-scene reference images, aspect ratio, duration, provider job per scene, stitching/composition step. |
| Video editor | Trim, subtitles, TikTok-style captions, text/logo overlays, filler-word removal, AI denoise, music library, chat editing | No | XL | Use Remotion/FFmpeg pipeline. Add upload video, transcription/Whisper, caption style editor, timeline-lite UI, render jobs. Start with subtitles + trim before full editor. |
| UGC/video ads expert | AI video ad with script/persona/VEO-style generation | Partial | Large | Package Softai's current workflow into a guided "video ad expert" wizard. Add UGC angles, hooks, persona, platform objective, product proof points. |
| Landing page maker | Generate Arabic landing page with copy/design and one-click publish | No | XL | Generate structured page JSON, render via internal template components, allow editing, deploy to Vercel/Netlify or publish under user subpaths. |
| Website publishing | Deploy generated pages online | No | Large | Add publish targets, generated static bundle or hosted dynamic route, custom slug/domain later, publish/unpublish controls. |
| Business coach | Business planning, pricing, marketing, sales advice with persistent memory | No | Medium | Add specialized chat persona with project/business profile memory. Store `business_profiles` and conversation history. |
| Lead generation | Market/customer research, contact data, prioritization, outreach messages | No | XL | Requires external data providers, scraping/compliance controls, enrichment, dedupe, export. High legal/privacy risk. |
| Money expert | Budgeting, expense analysis, forecasts, tax/pricing advice | No | Large | Start as document/chat assistant with CSV upload and calculators. Avoid regulated financial advice claims. Add disclaimers and deterministic calculators. |
| Genius tutor | Arabic educational tutor with adaptive explanations/exercises | No | Medium | Specialized chat mode with lesson/exercise generation. Likely outside Softai's core SMB ad focus. |
| English tutor | English conversation, correction, grammar, exercises | No | Medium | Specialized chat mode with correction rubric and practice flows. Low strategic fit for Softai. |
| Gallery/public showcase | Public gallery of generated images/videos/designs | No | Medium | Add opt-in publishing flag on outputs, public `/gallery`, moderation queue, takedown flow. |
| Credit refunds | Up to 5 monthly refunds if result not downloaded | No | Medium | Add refund policy fields, output download tracking, refund count per billing period, ledger reversal, UI action beside outputs. |
| Courses/community/support | Recorded courses, weekly workshops, WhatsApp support | No | Medium | Add course content pages, gated plan entitlements, support CTA. More growth/ops than engineering-heavy. |
| Comparison SEO pages | Pages comparing against Canva, Midjourney, ChatGPT, Runway, ElevenLabs, etc. | No | Small | Add static comparison route templates and content model. Good marketing acquisition work. |

## Highest-Value Parity Work For Softai

| Priority | Feature | Why |
|---:|---|---|
| 1 | Virtual product photography | Directly matches Softai's SMB ad/product-image audience and reuses uploads/image generation. |
| 2 | Static ad creative generator | Complements video ads and creates fast customer value before video render. |
| 3 | Multi-scene video creator | Natural extension of current storyboard/render pipeline. |
| 4 | Voiceover/TTS and voice cloning | Makes generated ads feel complete and differentiates from simple image/video generation. |
| 5 | Arabic-first UX | 3aqel's strongest positioning is Arabic-first. If targeting the same market, this is foundational. |
| 6 | Carousel builder | Common SMB/social need, lower cost than video, reusable templates. |
| 7 | Video editor captions/trim | High perceived value, but should start narrow due to complexity. |
| 8 | Landing page maker | Useful for SMB campaigns, but larger product surface and publishing concerns. |

## Recommended Implementation Phases

| Phase | Scope | Estimated Complexity |
|---|---|---|
| Phase 1 | Arabic UI baseline, standalone script writer, generic image tool, product photography MVP | Medium/Large |
| Phase 2 | Static ad generator, carousel builder, public gallery, refund policy | Large |
| Phase 3 | TTS/voiceover, multi-scene video creator with per-scene references, better library/downloads | Large/XL |
| Phase 4 | Motion graphics, talking head, video editor captions/trim | XL |
| Phase 5 | Landing page maker and website publishing | XL |
| Phase 6 | Business coach, lead gen, finance/tutor tools only if strategy expands beyond ad creation | Medium/XL |

## Implementation Architecture

Softai should avoid copying 3aqel as unrelated standalone pages bolted onto the app. The maintainable path is a shared tools framework.

| Layer | What To Add |
|---|---|
| Tool registry | `lib/tools/registry.ts` with id, category, credit cost, input schema, output type, provider adapter |
| Job model | Generalize `generationJobs` beyond `storyboard/image/video` to support `toolId`, `status`, `providerJobId`, `requestPayload`, `responsePayload` |
| Output model | Generalize `outputs.type` to image, video, audio, document, website, carousel, logo, ad |
| Provider adapters | `lib/providers/openrouter.ts`, `lib/providers/elevenlabs.ts`, `lib/providers/remotion.ts`, etc. |
| Credits | Centralize credit reservation, commit, refund, download lockout |
| UI | Shared tool shell with prompt form, upload area, generation status, output gallery |
| Safety | Consent flows for voice/avatar, abuse reporting for public gallery, admin takedown already exists |

## Strategic Note

Do not pursue all 3aqel tools equally. Their suite includes education, finance, lead-gen, and general chat tools that dilute Softai's current positioning. For feature parity that matters to the same customer, focus on campaign production:

1. Product photos.
2. Static ads.
3. Carousels.
4. Better multi-scene videos.
5. Voiceover/TTS.
6. Captions/video editing.
7. Landing pages.

That gives Softai parity where it matters for SMB advertising without turning the product into a generic AI toolbox.
