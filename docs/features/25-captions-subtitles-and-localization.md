# Captions, Subtitles, And Localization

## Outcome

Users can create accessible, platform-ready videos in multiple languages with accurate captions and localized copy.

## Users

Businesses targeting social platforms, multilingual audiences, Arabic/English users.

## MVP

- Generate captions from script or speech-to-text.
- Burn captions into video.
- Support English and Arabic text direction.

## Full Version

- Translate captions and ad copy.
- Dub voiceover into other languages.
- Subtitle style templates.
- Safe-zone validation for platforms.

## User Flow

User adds captions to a video, chooses style and language, previews placement, and exports a captioned version.

## Data Model

- `captions`: asset/render, language, segments, source.
- `localizations`: source content, target language, translated content.

## API/Provider Needs

- Speech-to-text.
- Translation/LLM localization.
- Video caption rendering.

## UI Surfaces

- Captions step in video editor.
- Caption style editor.
- Localization panel.

## Dependencies

- AI Video Editor.
- Voiceover, TTS, And Voice Cloning.
- Platform Export Packs.

## Acceptance Criteria

- User can add captions to a video.
- Captions can be edited before export.
- Arabic captions render RTL correctly.
- Captioned export is saved as a new asset.

## Risks

- Speech recognition errors need editing UI.
- RTL caption rendering requires testing.
- Translations can change marketing meaning.
