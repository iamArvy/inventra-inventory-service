# Inventory Service Database Design

## Overview

This database design is for the **inventory service of Inventra** using PostgreSQL. It handles products, stores, stock, and movements. Flexible product metadata is storeed in JSON columns, while transactional and relational data uses standard SQL structures. Caching is intended to improve read performance.

All entities include `enterpriseId` to associate them with a enterprise.

---

## Entities and Relationships

### Product

- Core product information.

**Fields:**

- `id` (UUID, PK)
- `enterpriseId` (String)
- `name` (String)
- `description` (String)
- `image` (String)
- `sku` (String, unique per enterprise)
- `basePrice` (Decimal(10,2))
- `categoryId` (optional, FK to Category)
- `tags` (String array)
- `attributes` (JSON)
- `createdAt`, `updatedAt`, `deletedAt`

**Indexes/Constraints:**

- Unique: `[sku, enterpriseId]`
- Index: `[deletedAt, categoryId, enterpriseId]`

**Relationships:**

- One-to-many with `Inventory`
- Many-to-one with `Category`

---

### Category

- Organizes products.

**Fields:**

- `id` (UUID, PK)
- `enterpriseId` (String)
- `name` (String)
- `description` (optional)
- `image` (optional)
- `createdAt`

**Indexes/Constraints:**

- Unique: `[name, enterpriseId]`

**Relationships:**

- One-to-many with `Product`

---

### store

- Represents a branch or warehouse.
- Optional: products can exist without a store (`storeId` nullable in inventory).

**Fields:**

- `id` (UUID, PK)
- `enterpriseId` (String)
- `name` (String)
- `address` (String)
- `createdAt`

**Indexes/Constraints:**

- Unique: `[name, enterpriseId]`

**Relationships:**

- One-to-many with `Inventory`

---

### Inventory

- Tracks stock and optional price overrides.
- Tied to a product and optionally a store.

**Fields:**

- `id` (UUID, PK)
- `enterpriseId` (String)
- `productId` (FK to Product)
- `storeId` (nullable, FK to store)
- `priceOverride` (Decimal(10,2))
- `quantity` (Int, default 0)
- `createdAt`, `updatedAt`, `deletedAt`

**Indexes/Constraints:**

- Unique: `[productId, storeId]`
- Index: `[productId, storeId]`

**Relationships:**

- One-to-many with `InventoryMovement`
- Many-to-one with `Product`
- Many-to-one with `store` (optional)

---

### InventoryMovement

- Tracks changes to inventory.
- Linked directly to inventory.

**Fields:**

- `id` (UUID, PK)
- `enterpriseId` (String)
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
