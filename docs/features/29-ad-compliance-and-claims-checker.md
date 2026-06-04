# Ad Compliance And Claims Checker

## Outcome

Soft-Magic AI helps users avoid risky, unsupported, or platform-rejected claims in ads and landing pages.

## Users

Businesses in health, beauty, finance, education, supplements, agencies, platform advertisers.

## MVP

- Scan generated copy/scripts for risky claims.
- Flag unsupported absolutes, medical/financial claims, prohibited wording, and missing disclaimers.
- Suggest safer alternatives.

## Full Version

- Industry policy profiles.
- Platform-specific checks for Meta, Google, TikTok.
- Evidence/source attachment for claims.
- Approval workflow for teams.

## User Flow

Before export, Soft-Magic AI checks copy and warns: “This claim may be risky. Consider this safer version.”

## Data Model

- `compliance_checks`: asset/copy, categories, severity, suggestions, status.
- `claim_sources`: product claim, evidence URL/file, reviewer.

## API/Provider Needs

- LLM/classifier for policy review.
- Policy rules maintained internally.

## UI Surfaces

- Inline warnings in copy/script tools.
- Pre-export compliance panel.
- Admin policy config later.

## Dependencies

- Script Writer And Offer Copy Studio.
- Static Ad Creative Generator.
- Landing Page And Website Generator.

## Acceptance Criteria

- Risky generated claims are flagged before export.
- User can accept safer rewrite suggestions.
- Check results are stored with the asset/project.
- Tool states clearly that it is guidance, not legal advice.

## Risks

- False negatives can create user/platform risk.
- False positives can frustrate users.
- Policies vary by geography and platform.
