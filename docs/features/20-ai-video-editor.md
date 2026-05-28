# AI Video Editor

## Outcome

Users can edit and improve generated or uploaded videos inside Softai without external tools.

## Users

Marketers, business owners, agencies, creators.

## MVP

- Trim video.
- Add/remove captions.
- Add text overlays and logo.
- Replace soundtrack.
- Export in platform formats.

## Full Version

- Object removal/inpainting.
- Background replacement.
- Motion brush.
- Scene extension.
- Timeline with clips, audio, and layers.

## User Flow

User opens a generated video, trims the ending, changes CTA overlay, adds captions, and exports for Instagram Reels.

## Data Model

- `video_edit_sessions`: source assets, timeline JSON, status.
- `timeline_tracks`: video, audio, text, captions, overlays.
- `renders`: output format and status.

## API/Provider Needs

- Server-side rendering/transcoding.
- Optional AI video edit providers.
- Speech-to-text for captions.

## UI Surfaces

- Video editor route.
- Timeline/preview UI.
- Export modal.

## Dependencies

- Asset Library And Media Storage.
- Platform Export Packs.
- Captions, Subtitles, And Localization.

## Acceptance Criteria

- User can trim, caption, overlay, and export a video.
- Original video remains unchanged.
- Export creates a new library asset.
- Timeline state persists across refreshes.

## Risks

- Browser video editing can become heavy.
- Server rendering can be costly.
- Advanced Runway-style video editing is provider-dependent.
