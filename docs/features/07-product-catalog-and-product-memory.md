# Product Catalog And Product Memory

## Outcome

Soft-Magic AI understands what the business sells, so users can generate ads and media around products without re-entering details every time.

## Users

Ecommerce sellers, local services, restaurants, agencies managing client products.

## MVP

- Product records with name, description, price, benefits, audience, images, and offer notes.
- Product picker in generation tools.
- Product context injected into prompts.

## Full Version

- Bulk CSV/Shopify/WooCommerce import.
- Product variants.
- Inventory and seasonal tags.
- Product-specific performance history.

## User Flow

User adds a product once, uploads photos, and then generates product photos, ads, videos, carousels, landing pages, and copy from that product.

## Data Model

- `products`: workspace, brand, name, description, category, price, benefits, objections.
- `product_assets`: product photos, packaging, lifestyle shots.
- `product_offers`: discounts, bundles, launches, seasonal campaigns.

## API/Provider Needs

- Upload processing.
- Optional feed import APIs.
- Optional image tagging/classification.

## UI Surfaces

- Products page.
- Product picker in project creation and tools.
- Product detail with generated asset history.

## Dependencies

- Asset Library And Media Storage.
- Brand Kit And Brand Memory.

## Acceptance Criteria

- Users can create and edit products.
- Product context can be attached to generations.
- Generated outputs link back to product records.
- Product images can be reused as inputs.

## Risks

- Poor product data produces weak ads.
- Feed imports create mapping and validation complexity.
- Product claims need compliance review.
