# Website Publishing

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
