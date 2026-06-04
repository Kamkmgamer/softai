# Arabic-First Product UX

**Decision:** Undecided  
**Complexity:** Medium  
**Suggested priority:** Very high

#### Description

Arabic-first UX means the product is not merely translated. The interface, content hierarchy, prompt examples, defaults, tool names, support flows, and generated outputs are designed for Arabic-speaking SMB users from the beginning.

3aqel's strongest positioning is that users can describe what they want in Arabic and receive Arabic-aware outputs across designs, scripts, video, voice, and websites.

#### Target Users

Arabic-speaking founders, marketers, small business owners, agencies, content creators, and operators who are uncomfortable managing English-first AI tools.

#### Why It Matters

Soft-Magic AI currently has an English-first UI. If we compete with 3aqel in the same region, Arabic UX is a foundational parity feature rather than a nice-to-have.

Arabic-first UX also improves prompt quality because users can explain their products, offers, and audiences in their natural language.

#### Soft-Magic AI Workflow

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
