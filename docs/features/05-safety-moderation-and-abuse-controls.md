# Safety, Moderation, And Abuse Controls

## Outcome

Soft-Magic AI prevents illegal, abusive, unsafe, or brand-damaging content while keeping legitimate business generation fast.

## Users

All users, admins, platform operators.

## MVP

- Prompt moderation before provider calls.
- Output report abuse flow.
- Admin takedown and user ban tools.
- Safe error messages when content is blocked.

## Full Version

- Output moderation for images/video/audio.
- Workspace-level policy controls.
- High-risk category review queue.
- Brand safety settings for regulated businesses.

## User Flow

User submits a generation. If blocked, Soft-Magic AI explains the policy category and suggests a safer alternative. If output is problematic, user can report it.

## Data Model

- `moderation_events`: input/output, category, decision, provider, reviewer.
- `abuse_reports`: reporter, asset/output, reason, status.
- `user_restrictions`: ban, suspension, feature limits.

## API/Provider Needs

- Text moderation.
- Image/video safety where supported by providers.
- Internal policy classifier for business claims and regulated categories.

## UI Surfaces

- Blocked generation notice.
- Report abuse action on assets.
- Admin moderation queue.

## Dependencies

- Asset Library And Media Storage.
- Admin operations.

## Acceptance Criteria

- Blocked content does not call expensive generation providers.
- Admins can takedown public/shared outputs.
- Reports are stored and reviewable.
- Safety decisions are logged for support.

## Risks

- Overblocking hurts legitimate ad use cases.
- Underblocking creates legal and platform risk.
- Provider policies may differ from Soft-Magic AI policies.
