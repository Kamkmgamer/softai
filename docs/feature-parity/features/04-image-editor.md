# Image Editor

**Decision:** Undecided  
**Complexity:** Large  
**Suggested priority:** High

#### Description

An AI image editor that modifies existing images using text instructions. 3aqel markets background changes, object removal, automatic enhancement, and no-design-experience editing.

#### Target Users

Ecommerce sellers, marketers, content creators, and agencies who need quick edits to product shots or generated assets.

#### Why It Matters

Generated outputs often need small corrections. Editing keeps users inside Softai instead of sending them to Photoshop, Canva, or Photoroom.

#### Softai Workflow

Users upload or select an existing image, type an edit instruction, and generate a new version. Softai displays before/after previews and stores an edit history.

Example instructions:

- Remove the background.
- Add a warm studio light.
- Replace the table with white marble.
- Remove the object in the top-right corner.
- Make the product larger and centered.

#### Implementation Requirements

- Image upload or library selection.
- Image-to-image provider adapter.
- Optional mask support for object-specific edits.
- Versioned outputs linked to source image.
- Before/after UI.
- Credit charging per edit.

#### Risks And Questions

- Different providers support different edit capabilities.
- Object removal may require masks for reliable results.
- Product fidelity can degrade after repeated edits.

#### MVP Scope

Text-based image editing for uploaded/library images without manual masks. Save each edit as a new output version.

---
