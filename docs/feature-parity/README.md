# Feature Parity Decision Catalog

This catalog expands the 3aqel feature-parity research into decision-ready feature descriptions. Use it as a working document to decide which features Softai should implement, defer, or reject.

Each feature includes:

- What the feature is.
- Who it is for.
- Why it matters.
- How it would work in Softai.
- Main implementation requirements.
- Risks and open questions.
- Suggested priority and complexity.

## Decision States

Use these statuses while reviewing the catalog:

| Status | Meaning |
|---|---|
| Undecided | Needs product/technical review. |
| Implement | Approved for planning and issue breakdown. |
| Defer | Valuable, but not now. |
| Reject | Not aligned with Softai strategy. |
| Needs Research | Requires more product or technical investigation before a decision. |

## Recommended First Pass

Softai should not copy 3aqel as a generic AI toolbox. The strongest path is to stay focused on SMB campaign production and add adjacent tools that make product marketing easier.

Recommended first-pass implementation candidates:

1. Arabic-first product UX.
2. Virtual product photography studio.
3. Static ad creative generator.
4. Carousel builder.
5. Multi-scene video creator.
6. Voiceover/TTS.
7. Video captions/trim editor.
8. Landing page maker.

Features that are likely lower strategic fit unless Softai intentionally broadens beyond ad creation:

1. Genius tutor.
2. English tutor.
3. Money expert.
4. General education tools.
5. Broad personal finance advice.

## 3aqel Parity Features

### 1. Arabic-First Product UX

**Decision:** Undecided  
**Complexity:** Medium  
**Suggested priority:** Very high

#### Description

Arabic-first UX means the product is not merely translated. The interface, content hierarchy, prompt examples, defaults, tool names, support flows, and generated outputs are designed for Arabic-speaking SMB users from the beginning.

3aqel's strongest positioning is that users can describe what they want in Arabic and receive Arabic-aware outputs across designs, scripts, video, voice, and websites.

#### Target Users

Arabic-speaking founders, marketers, small business owners, agencies, content creators, and operators who are uncomfortable managing English-first AI tools.

#### Why It Matters

Softai currently has an English-first UI. If we compete with 3aqel in the same region, Arabic UX is a foundational parity feature rather than a nice-to-have.

Arabic-first UX also improves prompt quality because users can explain their products, offers, and audiences in their natural language.

#### Softai Workflow

Users choose Arabic or English. If Arabic is selected, the entire app switches to RTL layout, Arabic labels, Arabic examples, Arabic error messages, Arabic onboarding, Arabic billing copy, and Arabic prompt presets.

AI prompts should preserve Arabic intent instead of translating everything to English by default. Generated scripts, overlays, captions, landing pages, and ads should support Arabic typography and right-to-left layout.

#### Implementation Requirements

- Add app-level i18n routing and translation files.
- Add RTL support for app shell, forms, tables, cards, and navigation.
- Audit CSS for left/right assumptions.
- Add Arabic prompt presets for campaign briefs, ad copy, product photos, and video scripts.
- Add Arabic-capable typography defaults.
- Add Arabic validation and error messages.
- Update generated media templates to support RTL text overlays.

#### Risks And Questions

- Some AI image/video models handle Arabic text poorly inside images.
- RTL support can create layout regressions if retrofitted carelessly.
- Arabic dialect support needs a product decision: Modern Standard Arabic only, or dialect options.

#### MVP Scope

Marketing site, dashboard, project creation, storyboard review, billing, library, and tool shell in Arabic with RTL. Generated text outputs should support Arabic, but image text rendering can be handled by our own templates where possible.

---

### 2. General AI Chat

**Decision:** Undecided  
**Complexity:** Medium  
**Suggested priority:** Medium

#### Description

A conversational AI assistant for writing, summarization, brainstorming, Q&A, and business support. 3aqel positions this as an Arabic chat assistant that understands context and supports multi-turn conversations.

#### Target Users

Users who want a simple ChatGPT-like assistant inside Softai instead of switching tools.

#### Why It Matters

General chat can increase session time and reduce context switching. It can also support campaign planning, script brainstorming, and prompt improvement.

However, generic chat is crowded and does not directly differentiate Softai unless tied to campaign workflows.

#### Softai Workflow

Add `/tools/chat` or an assistant panel inside projects. Users can ask for campaign ideas, rewrite offers, summarize product notes, improve scripts, generate angles, or ask operational questions.

Project-aware mode should allow the assistant to understand the current project brief, storyboard, assets, and outputs.

#### Implementation Requirements

- Conversations and messages tables.
- Streaming chat API route.
- Credit metering per response or token band.
- Project context injection.
- Prompt templates for campaign planning.
- Chat history UI.

#### Risks And Questions

- Generic chat may dilute the product if promoted too heavily.
- Long context can increase provider cost.
- Need clear boundaries around advice quality.

#### MVP Scope

Project-aware campaign assistant that helps write and refine briefs, hooks, offers, CTAs, scripts, and captions.

---

### 3. Standalone Text-To-Image Tool

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

### 4. Image Editor

**Decision:** Undecided  
**Complexity:** Large  
**Suggested priority:** High

#### Description

An AI image editor that modifies existing images using text instructions. 3aqel markets background changes, object removal, automatic enhancement, and no-design-experience editing.

#### Target Users

Ecommerce sellers, marketers, content creators, and agencies who need quick edits to product shots or generated assets.

#### Why It Matters

Generated outputs often need small corrections. Editing keeps users inside Softai instead of sending them to Photoshop, Canva, or Photoroom.

#### Softai Workflow

Users upload or select an existing image, type an edit instruction, and generate a new version. Softai displays before/after previews and stores an edit history.

Example instructions:

- Remove the background.
- Add a warm studio light.
- Replace the table with white marble.
- Remove the object in the top-right corner.
- Make the product larger and centered.

#### Implementation Requirements

- Image upload or library selection.
- Image-to-image provider adapter.
- Optional mask support for object-specific edits.
- Versioned outputs linked to source image.
- Before/after UI.
- Credit charging per edit.

#### Risks And Questions

- Different providers support different edit capabilities.
- Object removal may require masks for reliable results.
- Product fidelity can degrade after repeated edits.

#### MVP Scope

Text-based image editing for uploaded/library images without manual masks. Save each edit as a new output version.

---

### 5. Virtual Product Photography Studio

**Decision:** Undecided  
**Complexity:** Large  
**Suggested priority:** Very high

#### Description

A product photography tool where users upload product photos and generate professional product shots with different backgrounds, lighting, camera angles, and usage contexts.

3aqel specifically markets product photos for ecommerce, catalogs, Amazon/Noon, and social ads.

#### Target Users

Small ecommerce sellers, local retailers, DTC brands, restaurants, beauty brands, product-based SMBs, and agencies.

#### Why It Matters

This is one of the strongest fits for Softai. Softai's target users need ads, and ads need strong product visuals. This feature can feed directly into video ads, static ads, carousels, and landing pages.

#### Softai Workflow

Users upload one or more product images, choose a scene preset, choose lighting and angle, optionally add brand colors or custom direction, then generate a batch of product shots.

Scene presets could include:

- White studio.
- Marble luxury.
- Wooden table.
- Outdoor lifestyle.
- Office desk.
- Kitchen counter.
- Beauty counter.
- Minimal gradient.
- Seasonal campaign.

Generated product photos can be reused in ad projects.

#### Implementation Requirements

- Product image upload.
- Background/lighting/angle presets.
- Batch generation.
- Image-to-image provider that preserves product identity.
- Output gallery.
- Reuse output in campaigns.
- Optional background removal preprocessing.

#### Risks And Questions

- Preserving exact product shape, label, and packaging can be difficult.
- Need to set expectations about AI-generated product accuracy.
- Branded product labels may distort.

#### MVP Scope

Upload one product image, choose from 6-9 presets, generate 2-4 output variants, save to library, and allow use in ad projects.

---

### 6. Logo Studio

**Decision:** Undecided  
**Complexity:** Medium  
**Suggested priority:** Medium

#### Description

A tool that generates logo options from business name, industry, style, color preferences, and brand personality. 3aqel markets multiple logo options suitable for print and digital use.

#### Target Users

New founders, small businesses, side projects, YouTube channels, social accounts, and early-stage brands.

#### Why It Matters

Logo generation is attractive for new SMBs, but it is less directly connected to Softai's ad-video workflow than product photography or ads.

#### Softai Workflow

Users enter business name, optional slogan, industry, style, color palette, and symbol ideas. Softai generates multiple logo directions. Users can download PNG/SVG-like outputs where possible and reuse the logo as a brand asset.

#### Implementation Requirements

- Logo brief form.
- Style and color presets.
- Image generation provider.
- Transparent background option or post-processing.
- Save generated logos as brand assets.
- Brand kit integration.

#### Risks And Questions

- AI text rendering for logos can be unreliable, especially Arabic.
- Trademark uniqueness is not guaranteed.
- SVG/vector export may require a separate vectorization step.

#### MVP Scope

Generate visual logo concepts as PNG images, with a clear disclaimer that users should verify trademark availability and final production quality.

---

### 7. Static Ad Creative Generator

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

### 8. Carousel Builder

**Decision:** Undecided  
**Complexity:** Large  
**Suggested priority:** High

#### Description

A tool that creates multi-slide social media carousels with structured copy and consistent visual design. 3aqel markets Arabic social carousels for Instagram, LinkedIn, Twitter/X, education, product showcases, and tips.

#### Target Users

Social media managers, coaches, educators, agencies, founders, and SMBs that post educational or promotional content.

#### Why It Matters

Carousels are a common marketing format and less expensive to generate than video. They can help users create campaign assets around the same brief used for videos.

#### Softai Workflow

Users enter a topic, audience, goal, tone, number of slides, and optional brand assets. Softai generates a slide outline, writes slide copy, renders the carousel, and lets users download each slide or a ZIP/PDF.

Example carousel types:

- Product benefits.
- How-to guide.
- Before/after.
- Customer objections.
- Launch announcement.
- Educational tips.

#### Implementation Requirements

- Carousel outline generator.
- Slide copy generator.
- Template rendering system.
- Slide editor for text changes.
- Export as PNG batch, ZIP, and PDF.
- Brand kit integration.

#### Risks And Questions

- Text-heavy layouts need strong overflow handling.
- Arabic line breaks and RTL order need careful rendering.
- Users may expect Canva-level manual editing.

#### MVP Scope

Generate 5-7 slides from a topic and render them with 3 template choices. Allow text edits before final export.

---

### 9. Motion Graphics

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

### 10. Talking-Head Videos

**Decision:** Undecided  
**Complexity:** XL  
**Suggested priority:** Medium/High

#### Description

A tool that creates a video of an AI presenter or uploaded avatar speaking a script with synchronized lip movement. 3aqel markets this for Reels, educational videos, marketing videos, and daily content without filming.

#### Target Users

Founders, coaches, educators, creators, agencies, and SMB marketers.

#### Why It Matters

Talking-head content is effective for trust-building and social ads. It could extend Softai from product-only ads into UGC-style ads.

#### Softai Workflow

Users enter or generate a script, choose a presenter/avatar, choose a voice, and render a vertical talking-head video. The video can include captions, background, logo, and CTA.

#### Implementation Requirements

- Presenter/avatar selection or upload.
- Voice/TTS integration.
- Lip-sync/video provider integration.
- Consent and likeness policy.
- Captions and overlays.
- Render queue.

#### Risks And Questions

- Deepfake and consent risk is high.
- Some providers have strict policy limits.
- Quality varies significantly by avatar and language.

#### MVP Scope

Use provider-approved stock avatars first. Add custom avatar upload only after consent, moderation, and abuse controls are strong.

---

### 11. Voice Cloning And TTS

**Decision:** Undecided  
**Complexity:** Large  
**Suggested priority:** High

#### Description

A voice tool that clones a user's voice from a sample and generates voiceovers in Arabic or other languages. 3aqel markets it for video ads, YouTube, podcasts, and multilingual content.

#### Target Users

Creators, founders, marketers, agencies, and SMBs that want voiceovers without recording each time.

#### Why It Matters

Softai's video ads become much more complete with narration. Voice generation also supports talking heads, motion graphics, video editor, and landing page videos.

#### Softai Workflow

Users either choose a stock voice or upload a voice sample with consent attestation. They enter text, generate audio, preview it, and attach it to a project or download it.

#### Implementation Requirements

- TTS provider integration.
- Voice sample upload.
- Consent flow and audit trail.
- Voice library per user.
- Generated audio outputs.
- Usage limits and deletion controls.
- Optional multilingual voice generation.

#### Risks And Questions

- Voice cloning has impersonation risk.
- Need explicit consent and possibly verification.
- Need policy around public figures and third-party voices.

#### MVP Scope

Start with stock Arabic voices and text-to-speech. Add voice cloning after policy, UX, and provider constraints are clear.

---

### 12. Music Maker

**Decision:** Undecided  
**Complexity:** Medium  
**Suggested priority:** Medium

#### Description

An AI music generation tool that creates original background music by mood, genre, tempo, and duration. 3aqel markets this for videos, podcasts, ads, and social content.

#### Target Users

Video creators, marketers, podcasters, and SMBs that need royalty-safe background tracks.

#### Why It Matters

Music improves video quality and can become part of the video generation workflow. As a standalone tool, it is less core than product photos or ad creatives.

#### Softai Workflow

Users select mood, style, duration, and optional prompt. Softai generates a music track, lets users preview it, and attach it to a video project.

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

### 13. Script Writer

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

### 14. Multi-Scene Video Creator

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

### 15. Video Editor

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

### 16. UGC / Video Ads Expert

**Decision:** Undecided  
**Complexity:** Large  
**Suggested priority:** High

#### Description

A guided tool for creating UGC-style video ads with scripts, hooks, persona, product claims, scenes, and generated video. 3aqel exposes this as a video ads expert separate from general video creation.

#### Target Users

Ecommerce brands, direct-response marketers, agencies, course sellers, app founders, and local businesses.

#### Why It Matters

This is extremely aligned with Softai's purpose. It packages existing ad-video flow in language that performance marketers understand.

#### Softai Workflow

Users select campaign goal, product, audience, offer, proof points, UGC style, persona, platform, and CTA. Softai generates multiple ad angles, scripts, storyboards, and videos.

UGC styles could include:

- Founder story.
- Problem/solution.
- Testimonial style.
- Product demo.
- Before/after.
- Myth-busting.

#### Implementation Requirements

- Ad-angle generation.
- Persona/style presets.
- Integration with storyboard and video render.
- Optional talking-head integration.
- Performance-oriented copy templates.
- Variant generation.

#### Risks And Questions

- Generated testimonials must not imply fake customer claims.
- Need controls for regulated industries and claims.
- UGC quality depends on avatar/video realism.

#### MVP Scope

Generate 3 ad angles and 3 scripts from one brief, then let user choose one to convert into a standard Softai video project.

---

### 17. Landing Page Maker

**Decision:** Undecided  
**Complexity:** XL  
**Suggested priority:** Medium/High

#### Description

A tool that generates a landing page from a product/service description, including copy, layout, sections, CTA, and responsive design. 3aqel markets Arabic landing pages ready to publish.

#### Target Users

Founders, SMBs, course creators, local service businesses, ecommerce sellers, and agencies.

#### Why It Matters

Ads need landing pages. This feature would let Softai cover more of the campaign funnel, from creative generation to conversion page.

#### Softai Workflow

Users provide product/service details, audience, offer, proof points, brand style, and CTA. Softai generates a landing page preview with editable sections. Users can publish it or export it.

#### Implementation Requirements

- Page JSON schema.
- Copy generation.
- Section template library.
- Responsive page renderer.
- Editor for text/images/colors.
- Hosting or publish system.
- Optional custom domains later.

#### Risks And Questions

- Publishing introduces hosting, abuse, SEO, and domain concerns.
- Users may expect full website builder capabilities.
- Template quality needs strong design direction.

#### MVP Scope

Generate and host a single-page landing page under a Softai URL with editable copy and generated hero/product sections.

---

### 18. Website Publishing

**Decision:** Undecided  
**Complexity:** Large  
**Suggested priority:** Medium

#### Description

Publishing lets users put generated landing pages or microsites online. 3aqel exposes website publish as a distinct web tool.

#### Target Users

SMBs, founders, agencies, creators, and campaign managers.

#### Why It Matters

Landing page generation is less valuable if users cannot publish easily. One-click publishing can make Softai a campaign-launch tool, not just a creative generator.

#### Softai Workflow

Users generate a landing page, choose a slug, preview it, and publish. Later they can unpublish, update, duplicate, or connect a custom domain.

#### Implementation Requirements

- Public page route by slug.
- Published page storage.
- Slug validation and ownership.
- Publish/unpublish controls.
- Abuse reporting and admin takedown.
- Optional Netlify/Vercel integration or internal hosting.

#### Risks And Questions

- Public hosting creates moderation and abuse risk.
- Custom domains add support complexity.
- Need rate limits and plan limits.

#### MVP Scope

Host pages on Softai subpaths or subdomains. Defer custom domains.

---

### 19. Business Coach

**Decision:** Undecided  
**Complexity:** Medium  
**Suggested priority:** Medium/Low

#### Description

An AI business advisor that helps with business planning, marketing strategy, pricing, sales, and operations. 3aqel mentions persistent memory that remembers project details.

#### Target Users

Small business owners, solo founders, creators, and early-stage operators.

#### Why It Matters

This could support Softai users before campaign creation, helping them clarify offer, audience, positioning, and pricing.

#### Softai Workflow

Users create a business profile and chat with a coach. The coach can recommend campaigns, improve offers, suggest ad angles, and identify missing assets.

#### Implementation Requirements

- Business profile memory.
- Specialized chat prompt.
- Conversation history.
- Suggested campaign actions.
- Optional integration with projects.

#### Risks And Questions

- Generic business advice can be vague.
- Need avoid overclaiming expertise.
- Lower differentiation than campaign tools.

#### MVP Scope

Position it as a campaign strategy assistant, not a general business consultant.

---

### 20. Lead Generation

**Decision:** Undecided  
**Complexity:** XL  
**Suggested priority:** Low unless strategy changes

#### Description

A tool for finding potential customers, contact data, prioritizing leads, and generating outreach messages. 3aqel markets market analysis, contact data, prioritization, and personalized outreach.

#### Target Users

B2B SMBs, agencies, consultants, SaaS founders, and sales teams.

#### Why It Matters

Lead generation is valuable but far outside Softai's current creative-production workflow. It also introduces data sourcing, compliance, and deliverability concerns.

#### Softai Workflow

If implemented, users define target industry, region, company type, and buyer persona. Softai finds or imports leads, scores them, and generates outreach copy and ad audience suggestions.

#### Implementation Requirements

- External lead data provider.
- Data enrichment.
- Deduplication.
- Export CSV.
- Compliance controls.
- Outreach message generator.
- Possibly email validation.

#### Risks And Questions

- Privacy and anti-spam compliance risk.
- Data quality can be poor.
- External provider costs can be high.
- Could distract from ad generation strategy.

#### MVP Scope

Do not start with contact scraping. If desired, build an ideal-customer-profile and outreach-copy generator first.

---

### 21. Money Expert

**Decision:** Undecided  
**Complexity:** Large  
**Suggested priority:** Low

#### Description

An AI finance advisor for budgets, expense analysis, forecasting, pricing, taxes, and investment-style questions. 3aqel markets it for business and personal finance.

#### Target Users

Small business owners, freelancers, and individuals.

#### Why It Matters

Finance advice is useful to SMBs, but it is not strongly connected to Softai's ad creation workflow.

#### Softai Workflow

If implemented, this should be framed around campaign economics: ad budget planning, CAC estimation, ROAS calculators, pricing checks, and profit-margin calculators.

#### Implementation Requirements

- Finance-focused prompt flow.
- CSV upload for expenses or sales.
- Deterministic calculators.
- Disclaimers and advice boundaries.
- Conversation history.

#### Risks And Questions

- Regulated advice risk.
- Incorrect financial guidance can harm users.
- Personal finance support dilutes product positioning.

#### MVP Scope

Reject general finance expert. Consider a campaign budget and ROAS calculator instead.

---

### 22. Genius Tutor

**Decision:** Undecided  
**Complexity:** Medium  
**Suggested priority:** Low

#### Description

An Arabic AI tutor that explains academic or professional topics, adapts to the learner, gives examples, and creates exercises.

#### Target Users

Students, professionals, and learners.

#### Why It Matters

This is a broad consumer/education feature and does not align directly with Softai's SMB ad-generation mission.

#### Softai Workflow

If Softai ever adds this, it should be reframed as a marketing tutor or ad-learning assistant rather than a general tutor.

#### Implementation Requirements

- Tutor chat mode.
- Lesson/exercise generator.
- Progress memory.
- Optional curriculum structure.

#### Risks And Questions

- Low strategic fit.
- Could confuse positioning.
- Education quality expectations are different from creative tools.

#### MVP Scope

Reject as a general tutor. Consider educational content only as courses/help for using Softai.

---

### 23. English Tutor

**Decision:** Undecided  
**Complexity:** Medium  
**Suggested priority:** Low

#### Description

An English-learning assistant for conversation practice, grammar correction, vocabulary, and test preparation.

#### Target Users

Arabic speakers learning English.

#### Why It Matters

It can attract broad users, but it is unrelated to Softai's campaign-production focus.

#### Softai Workflow

If implemented at all, it could help users translate campaign copy or improve bilingual ads, but that is a much narrower feature than an English tutor.

#### Implementation Requirements

- Chat mode.
- Correction rubric.
- Exercises.
- Progress tracking.

#### Risks And Questions

- Very low product fit.
- Crowded category.
- Could dilute brand.

#### MVP Scope

Reject as a standalone feature. Add bilingual ad-copy rewriting instead if needed.

---

### 24. Gallery / Public Showcase

**Decision:** Undecided  
**Complexity:** Medium  
**Suggested priority:** Medium/High

#### Description

A public gallery where users can browse AI-generated images, videos, logos, designs, and campaigns. 3aqel uses this as social proof and inspiration.

#### Target Users

Prospective customers, current users looking for inspiration, and creators who want to share outputs.

#### Why It Matters

Gallery content helps marketing, onboarding, and trust. It shows what the product can create and can improve SEO.

#### Softai Workflow

Users can opt in to publish selected outputs. Public visitors browse by category, industry, format, style, and tool. Each gallery item can include prompt snippets, tool used, and CTA to create similar output.

#### Implementation Requirements

- Public visibility flag on outputs.
- Gallery route.
- Category/tag metadata.
- Moderation queue.
- Admin takedown integration.
- Report abuse action.

#### Risks And Questions

- Users may accidentally publish private brand assets.
- Need moderation for public content.
- Need clear rights/consent language.

#### MVP Scope

Admin-curated gallery first, then user opt-in publishing later.

---

### 25. Credit Refunds

**Decision:** Undecided  
**Complexity:** Medium  
**Suggested priority:** Medium

#### Description

3aqel advertises refunds for unsatisfactory results, up to 5 times monthly, as long as the file was not downloaded.

#### Target Users

All paying users.

#### Why It Matters

AI outputs can fail. Refunds reduce perceived risk and make the credit system feel fair.

#### Softai Workflow

Users see a refund button beside eligible outputs. If they have not downloaded the output and have monthly refunds remaining, Softai reverses the credit transaction and marks the output/job as refunded.

#### Implementation Requirements

- Download tracking per output.
- Refund eligibility rules.
- Monthly refund allowance.
- Credit ledger reversal.
- Job/output refunded state.
- Abuse prevention.

#### Risks And Questions

- Users may abuse refunds if output previews are enough.
- Provider costs are still incurred.
- Need clear policy copy.

#### MVP Scope

Allow manual/admin-approved refunds first, then self-serve refunds with limits.

---

### 26. Courses / Community / Support

**Decision:** Undecided  
**Complexity:** Medium  
**Suggested priority:** Medium

#### Description

3aqel markets recorded courses, workshops, community, and WhatsApp support as part of higher-tier plans.

#### Target Users

New users, SMB owners, marketers, and non-technical customers who need guidance.

#### Why It Matters

For non-technical SMBs, education can increase activation and retention. It can also justify higher plans.

#### Softai Workflow

Users access a learning center with tutorials, campaign examples, prompt recipes, and onboarding checklists. Higher plans can include priority support or live training.

#### Implementation Requirements

- Course/content pages.
- Plan entitlement checks.
- Video hosting or embeds.
- Support CTA integration.
- Onboarding checklist.

#### Risks And Questions

- Requires ongoing content production.
- Support promise creates operational workload.
- Not purely an engineering feature.

#### MVP Scope

Create a learning center with 5-10 written guides and short embedded videos. Defer community operations.

---

### 27. Comparison SEO Pages

**Decision:** Undecided  
**Complexity:** Small  
**Suggested priority:** Medium

#### Description

SEO landing pages comparing Softai against relevant alternatives such as Canva, Midjourney, ChatGPT, Runway, ElevenLabs, Adobe Firefly, and 3aqel.

#### Target Users

Prospects searching for alternatives or comparing tools before purchase.

#### Why It Matters

This is a lightweight acquisition feature. 3aqel uses comparison pages to position itself as an all-in-one Arabic platform.

#### Softai Workflow

Public pages explain what Softai does best, where competitors are stronger, pricing differences, and ideal user fit. Each page should include examples and CTA to create a campaign.

#### Implementation Requirements

- Static comparison route template.
- Comparison content model.
- SEO metadata.
- Internal links from marketing pages.

#### Risks And Questions

- Claims need to be accurate and maintained.
- Aggressive competitor claims can look untrustworthy.

#### MVP Scope

Create 5 comparison pages focused on Softai's ad-video/product-marketing strengths.

---

## Additional Softai Feature Opportunities

These are 10 additional features Softai can add to exceed 3aqel while staying closer to Softai's campaign-production strategy.

### A1. Brand Kit And Brand Memory

**Decision:** Undecided  
**Complexity:** Large  
**Suggested priority:** Very high

#### Description

A persistent brand kit that stores logos, colors, fonts, tone, product descriptions, audience segments, compliance rules, and reusable visual references.

#### Target Users

SMBs, agencies, franchises, ecommerce brands, and repeat campaign creators.

#### Why It Matters

3aqel offers many tools, but persistent brand consistency can be a stronger differentiator. Softai can make every generated ad, carousel, landing page, and video feel like it belongs to the same brand.

#### Softai Workflow

Users create a brand profile once. Every tool can use that profile as context. Generated outputs inherit brand colors, logo placement, voice, and disclaimers.

#### Implementation Requirements

- `brands` and `brand_assets` model.
- Brand profile editor.
- Color/font/logo storage.
- Brand prompt context injection.
- Template integration.
- Multi-brand support for agencies.

#### MVP Scope

One brand kit per user with logo, colors, tone, product summary, and audience.

---

### A2. Campaign Variants And A/B Testing Generator

**Decision:** Undecided  
**Complexity:** Large  
**Suggested priority:** High

#### Description

A tool that generates multiple creative variants from one campaign brief: different hooks, angles, CTAs, visuals, captions, and formats.

#### Target Users

Performance marketers, agencies, ecommerce brands, app marketers, and founders.

#### Why It Matters

Ads are rarely successful with one creative. Variant generation makes Softai more useful for real campaigns than single-output AI tools.

#### Softai Workflow

Users select how many variants they want and which dimensions to vary: hook, offer framing, audience segment, visual style, CTA, or platform. Softai produces a test matrix.

#### Implementation Requirements

- Variant generation prompt templates.
- Campaign group model.
- Output grouping.
- Naming and comparison UI.
- Export matrix.

#### MVP Scope

Generate 3 hooks, 3 scripts, and 3 static/video creative concepts from one product brief.

---

### A3. Competitor Ad Analyzer

**Decision:** Undecided  
**Complexity:** Large  
**Suggested priority:** High

#### Description

A research tool where users paste competitor ad links, upload screenshots, or describe competitors. Softai extracts angles, hooks, offers, visual patterns, and opportunities.

#### Target Users

Founders, agencies, performance marketers, and ecommerce sellers.

#### Why It Matters

This helps users decide what to create before generating content. It moves Softai upstream into campaign strategy.

#### Softai Workflow

Users provide competitor examples. Softai analyzes what works, identifies gaps, and suggests differentiated ad concepts.

#### Implementation Requirements

- URL/screenshot ingestion.
- Vision model analysis.
- Structured competitor insights.
- Suggested campaign concepts.
- Legal-safe copy guidance.

#### MVP Scope

Upload screenshots or paste text from competitor ads. Generate an analysis and 5 differentiated ad angles.

---

### A4. Platform Export Packs

**Decision:** Undecided  
**Complexity:** Medium/Large  
**Suggested priority:** High

#### Description

Export generated campaigns into platform-specific packages for Meta, TikTok, YouTube Shorts, Google Display, LinkedIn, or Snapchat.

#### Target Users

SMB marketers and agencies who need handoff-ready assets.

#### Why It Matters

Users do not just need files; they need the right sizes, filenames, copy, captions, thumbnails, and upload notes.

#### Softai Workflow

Users choose a platform pack. Softai exports correctly sized assets plus captions, primary text, headlines, descriptions, hashtags, and recommended settings.

#### Implementation Requirements

- Platform requirements config.
- Asset resizing/rendering.
- Copy generation per platform.
- ZIP export.
- Download tracking.

#### MVP Scope

Meta and TikTok export packs for video and static ad outputs.

---

### A5. Ad Compliance And Claims Checker

**Decision:** Undecided  
**Complexity:** Large  
**Suggested priority:** High

#### Description

An AI and rules-based checker that reviews ad copy, scripts, landing pages, and claims for risky language, unsupported guarantees, restricted categories, and platform policy issues.

#### Target Users

SMBs, agencies, regulated-adjacent businesses, ecommerce sellers, health/beauty brands, finance-adjacent businesses.

#### Why It Matters

Ad rejection is costly. Compliance checking is a reliability differentiator and fits Softai's safety/admin priorities.

#### Softai Workflow

Before rendering/exporting, Softai flags risky claims and suggests safer alternatives.

#### Implementation Requirements

- Policy rule library.
- LLM review step.
- Risk scoring.
- Suggested rewrite flow.
- Audit trail.

#### MVP Scope

Check scripts and ad copy for guarantees, medical claims, financial claims, before/after claims, and prohibited terms.

---

### A6. Campaign Calendar And Content Planner

**Decision:** Undecided  
**Complexity:** Medium/Large  
**Suggested priority:** Medium

#### Description

A planning calendar that turns campaign goals into weekly content plans, ad refresh schedules, and asset production queues.

#### Target Users

SMB owners, social media managers, agencies, and content teams.

#### Why It Matters

Users need ongoing campaigns, not one-off outputs. A planner increases retention and gives users a reason to come back.

#### Softai Workflow

Users choose business goal, channels, posting frequency, and campaign dates. Softai generates a calendar with recommended assets and lets users create each asset from the plan.

#### Implementation Requirements

- Calendar model.
- Campaign planner generator.
- Task/status tracking.
- Links to tool creation flows.
- Calendar UI.

#### MVP Scope

Generate a 30-day content/ad plan and let users create assets from each planned item.

---

### A7. Product Feed Import

**Decision:** Undecided  
**Complexity:** Large  
**Suggested priority:** High for ecommerce

#### Description

Import products from CSV, Shopify, WooCommerce, or manual bulk upload, then generate ads and product photos for multiple products.

#### Target Users

Ecommerce sellers, retailers, agencies, and catalog-heavy SMBs.

#### Why It Matters

Softai can become much more powerful for product businesses if users can generate campaign assets in batches.

#### Softai Workflow

Users import product names, descriptions, prices, images, categories, and URLs. Softai creates product profiles and batch-generates photos, ads, and videos.

#### Implementation Requirements

- Product catalog model.
- CSV importer.
- Optional Shopify/WooCommerce integrations.
- Bulk generation jobs.
- Product-to-project creation.

#### MVP Scope

CSV import with product name, description, price, image URL, and category.

---

### A8. Performance Feedback Loop

**Decision:** Undecided  
**Complexity:** XL  
**Suggested priority:** Medium/High long term

#### Description

Users enter or import performance data from ad platforms. Softai analyzes winning and losing creatives and recommends new variants.

#### Target Users

Performance marketers, agencies, ecommerce brands, and app marketers.

#### Why It Matters

This turns Softai from a generation tool into a creative optimization system.

#### Softai Workflow

Users upload CSV reports or connect ad accounts. Softai maps results to creative assets, identifies patterns, and generates the next test batch.

#### Implementation Requirements

- Performance data import.
- Metrics mapping.
- Creative metadata tracking.
- Analysis engine.
- Variant recommendation generator.

#### MVP Scope

CSV upload for Meta/TikTok performance reports and manual mapping to Softai outputs.

---

### A9. Team Workspaces And Client Review

**Decision:** Undecided  
**Complexity:** Large  
**Suggested priority:** Medium/High for agencies

#### Description

Collaborative workspaces where teams or agencies can create projects, invite clients, collect comments, approve storyboards, and manage roles.

#### Target Users

Agencies, freelancers, marketing teams, and multi-brand SMBs.

#### Why It Matters

Softai already has review-oriented workflows. Client approval can make the product more valuable for agencies.

#### Softai Workflow

Users create a workspace, invite members/clients, share a project review link, collect comments, and approve outputs.

#### Implementation Requirements

- Organizations/workspaces.
- Roles and permissions.
- Shared review links.
- Comments and approvals.
- Activity log.

#### MVP Scope

Private review links with comments and approval status for storyboards/videos.

---

### A10. Prompt And Creative Recipe Library

**Decision:** Undecided  
**Complexity:** Medium  
**Suggested priority:** High

#### Description

A library of reusable prompt recipes and creative frameworks for ads, product photos, videos, carousels, hooks, landing pages, and UGC scripts.

#### Target Users

All users, especially beginners.

#### Why It Matters

Many users do not know what to ask AI for. Recipes improve output quality and reduce blank-page anxiety.

#### Softai Workflow

Users browse recipes by goal, industry, platform, and format. Selecting a recipe pre-fills a tool with structured prompts and examples.

#### Implementation Requirements

- Recipe model or static registry.
- Browse/search UI.
- Tool deep links with prefilled fields.
- Saved/favorite recipes.
- Admin-editable recipe content later.

#### MVP Scope

Static recipe library with 30-50 high-quality recipes linked to existing and planned tools.

## Next Step

For each feature, assign one of these decisions: Implement, Defer, Reject, or Needs Research. After that, the approved features can be converted into implementation issues or a PRD.
