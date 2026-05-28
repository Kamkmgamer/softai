# Platform Export Packs

## Outcome

Users can export every asset in the exact formats needed for TikTok, Instagram, YouTube Shorts, Meta ads, Google display, websites, and marketplaces.

## Users

Small businesses, paid media teams, social managers, agencies.

## MVP

- Export presets for 1:1, 4:5, 9:16, 16:9.
- Download image/video in platform-ready resolution.
- Naming conventions by campaign/product.

## Full Version

- Safe-zone overlays.
- Multi-format batch export.
- Direct publishing/integration.
- Platform checklist for file size, duration, text, captions.

## User Flow

User clicks export, selects target platforms, and receives correctly sized files.

## Data Model

- `exports`: source asset, platform, format, status, output asset.
- `export_presets`: platform, dimensions, duration limit, file constraints.

## API/Provider Needs

- Image resize/composition.
- Video transcode/rendering.
- Optional platform APIs later.

## UI Surfaces

- Export modal on every asset.
- Batch export from project/library.

## Dependencies

- Asset Library And Media Storage.
- AI Video Editor for video renders.

## Acceptance Criteria

- User can export at least major social aspect ratios.
- Exported assets are saved and downloadable.
- Exports preserve text/logo safe positioning where applicable.
- Batch exports do not block UI.

## Risks

- Platform specs change.
- Video transcoding is resource-intensive.
- Safe zones differ by placement and UI overlays.
