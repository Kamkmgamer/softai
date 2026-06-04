# Multi-Scene Video Ad Creator

## Outcome

Users can create complete short-form ad videos with multiple scenes, script, visuals, voiceover, music, captions, and export formats.

## Users

Small businesses, paid media teams, agencies, creators.

## MVP

- Generate storyboard from product, offer, audience, platform, and duration.
- Review/edit scene plan.
- Generate scene images/video clips.
- Render final video from scenes.

## Full Version

- Timeline editor.
- Regenerate individual scenes.
- Multiple hook variants.
- Voiceover/music/captions integrated.
- Template packs by industry and platform.

## User Flow

User creates campaign brief. Soft-Magic AI proposes a 5-scene TikTok ad. User edits scenes, generates media, and renders the final video.

## Data Model

- `projects`: campaign/video project.
- `storyboards`: script, scenes, platform, duration.
- `scenes`: order, visual prompt, narration, overlay text, asset links.
- `renders`: final output status and settings.

## API/Provider Needs

- LLM storyboard generation.
- Image/video providers.
- TTS and captions.
- Server-side video rendering.

## UI Surfaces

- Existing project creation/review pages.
- Scene editor.
- Render progress and final player.

## Dependencies

- Brand Kit And Brand Memory.
- Product Catalog And Product Memory.
- Text-To-Video Studio.
- Image-To-Video Studio.
- Voiceover, TTS, And Voice Cloning.

## Acceptance Criteria

- User can go from brief to final rendered video.
- Scenes are editable before generation/rendering.
- Failed scene generation does not fail the entire project irrecoverably.
- Final video is saved to library.

## Risks

- Rendering pipeline complexity.
- Scene consistency across clips is hard.
- Long workflows need autosave and clear progress.
