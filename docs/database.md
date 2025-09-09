# Inventory Service Database Design

## Overview

This database design is for the **inventory service of Inventra** using PostgreSQL. It handles products, locations, stock, and movements. Flexible product metadata is stored in JSON columns, while transactional and relational data uses standard SQL structures. Caching is intended to improve read performance.

All entities include `storeId` to associate them with a store.

---

## Entities and Relationships

### Product

- Core product information.

**Fields:**

- `id` (UUID, PK)
- `storeId` (String)
- `name` (String)
- `description` (String)
- `image` (String)
- `sku` (String, unique per store)
- `basePrice` (Decimal(10,2))
- `categoryId` (optional, FK to Category)
- `tags` (String array)
- `attributes` (JSON)
- `createdAt`, `updatedAt`, `deletedAt`

**Indexes/Constraints:**

- Unique: `[sku, storeId]`
- Index: `[deletedAt, categoryId, storeId]`

**Relationships:**

- One-to-many with `Inventory`
- Many-to-one with `Category`

---

### Category

- Organizes products.

**Fields:**

- `id` (UUID, PK)
- `storeId` (String)
- `name` (String)
- `description` (optional)
- `image` (optional)
- `createdAt`

**Indexes/Constraints:**

- Unique: `[name, storeId]`

**Relationships:**

- One-to-many with `Product`

---

### Location

- Represents a branch or warehouse.
- Optional: products can exist without a location (`locationId` nullable in inventory).

**Fields:**

- `id` (UUID, PK)
- `storeId` (String)
- `name` (String)
- `address` (String)
- `createdAt`

**Indexes/Constraints:**

- Unique: `[name, storeId]`

**Relationships:**

- One-to-many with `Inventory`

---

### Inventory

- Tracks stock and optional price overrides.
- Tied to a product and optionally a location.

**Fields:**

- `id` (UUID, PK)
- `storeId` (String)
- `productId` (FK to Product)
- `locationId` (nullable, FK to Location)
- `priceOverride` (Decimal(10,2))
- `quantity` (Int, default 0)
- `createdAt`, `updatedAt`, `deletedAt`

**Indexes/Constraints:**

- Unique: `[productId, locationId]`
- Index: `[productId, locationId]`

**Relationships:**

- One-to-many with `InventoryMovement`
- Many-to-one with `Product`
- Many-to-one with `Location` (optional)

---

### InventoryMovement

- Tracks changes to inventory.
- Linked directly to inventory.

**Fields:**

- `id` (UUID, PK)
- `storeId` (String)
- `inventoryId` (FK to Inventory)
- `quantity` (Int)
- `type` (Enum: `INCREASE` / `DECREASE`)
- `reason` (String)
- `createdAt`

**Indexes:**

- `[inventoryId, type]`
- Optional: `[inventoryId, createdAt]`

**Relationships:**

- Many-to-one with `Inventory`
