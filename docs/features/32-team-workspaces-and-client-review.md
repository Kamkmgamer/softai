# Team Workspaces And Client Review

## Outcome

Teams and agencies can collaborate on brands, projects, approvals, and client feedback.

## Users

Agencies, small teams, freelancers with clients, businesses with reviewers.

## MVP

- Workspace members.
- Project sharing.
- Comment-only client review links.
- Approval status per asset/project.

## Full Version

- Roles and permissions.
- Client portals.
- Versioned approvals.
- White-label review pages.
- Organization billing and seat management.

## User Flow

Agency generates three ad variants, sends a review link to client, client comments and approves one, agency exports final pack.

## Data Model

- `workspaces`: organization/team.
- `workspace_members`: role, status.
- `review_links`: project/asset access token, expiry, permissions.
- `comments`: asset/project, author, body, resolved status.

## API/Provider Needs

- Clerk Organizations if using Clerk org features.
- Email notifications later.

## UI Surfaces

- Workspace settings.
- Review page.
- Comments panel.
- Approval badges.

## Dependencies

- Auth/billing architecture.
- Asset Library And Media Storage.

## Acceptance Criteria

- Users can share a review link without exposing the whole account.
- Reviewers can comment/approve according to permissions.
- Owners can revoke links.
- Assets show approval state.

## Risks

- Permissions must be strict.
- Shared media URLs need secure access controls.
- Workspace billing can complicate existing user billing.
