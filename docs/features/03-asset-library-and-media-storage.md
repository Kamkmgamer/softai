# Asset Library And Media Storage

## Outcome

Users have a durable library for uploaded and generated images, videos, audio, documents, brand assets, and exports.

## Users

Business owners, marketers, agencies, social media managers.

## MVP

- Store uploaded assets and generated outputs in a unified library.
- Filter by media type, project, date, and source.
- Download assets.
- Reuse assets in future generations.

## Full Version

- Collections, tags, favorites, trash, bulk actions.
- Asset version history.
- Rights/license metadata.
- Smart search by product, campaign, prompt, and visual content.

## User Flow

User uploads a product image or generates a result. Softai saves it automatically. The user can reuse it in an ad, video, carousel, or landing page.

## Data Model

- `assets`: owner, workspace, type, source, storage key, mime type, dimensions, duration, size.
- `asset_relations`: project, product, brand kit, generation job links.
- `asset_tags`: labels, user tags, AI tags.
- `asset_versions`: prior derivatives and edits.

## API/Provider Needs

- UploadThing or object storage for uploads.
- Signed URLs for private media.
- Optional image/video metadata extraction.

## UI Surfaces

- `/library` expanded grid.
- Asset picker modal.
- Asset detail drawer.
- Project assets tab.

## Dependencies

- Auth/workspace ownership.
- Moderation for public/shared media.

## Acceptance Criteria

- Uploads and generated outputs appear in one library.
- Assets cannot be accessed across users/workspaces.
- Existing project outputs can be reused as new inputs.
- Large media does not block page rendering.

## Risks

- Storage costs can grow quickly.
- Signed URL expiry needs careful UX.
- Video thumbnails/previews need async processing.
