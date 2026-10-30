import { sql } from "drizzle-orm";
import { boolean,check,index,integer,numeric,pgEnum,pgTable,text,timestamp,uniqueIndex,uuid,varchar,} from "drizzle-orm/pg-core";

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    ownerId: text("owner_id").notNull(),

    name: varchar("name", { length: 150 }).notNull(),

    sku: varchar("sku", { length: 64 }).notNull(),

    category: varchar("category", { length: 100 }).notNull(),

    unit: varchar("unit", { length: 30 })
      .notNull()
      .default("piece"),

    purchasePrice: numeric("purchase_price", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0.00"),

    sellingPrice: numeric("selling_price", {
      precision: 12,
      scale: 2,
    })
      .notNull()
      .default("0.00"),

    currentStock: integer("current_stock")
      .notNull()
      .default(0),

    reorderLevel: integer("reorder_level")
      .notNull()
      .default(0),

    isActive: boolean("is_active")
      .notNull()
      .default(true),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("products_owner_sku_unique").on(
      table.ownerId,
      table.sku
    ),

    index("products_owner_id_idx").on(table.ownerId),
  ]
);


export const stockMovementReasonEnum = pgEnum(
  "stock_movement_reason",
  [
    "opening_stock",
    "restock",
    "stock_reduction",
    "correction",
  ]
);

export const stockMovements = pgTable(
  "stock_movements",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    ownerId: text("owner_id").notNull(),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "restrict",
      }),

    quantityDelta: integer("quantity_delta").notNull(),

    reason: stockMovementReasonEnum("reason").notNull(),

    note: text("note"),

    createdBy: text("created_by").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("stock_movements_owner_created_at_idx").on(
      table.ownerId,
      table.createdAt
    ),

    index("stock_movements_product_created_at_idx").on(
      table.productId,
      table.createdAt
    ),

    check(
      "stock_movements_quantity_delta_nonzero",
      sql`${table.quantityDelta} <> 0`
    ),
  ]
);
