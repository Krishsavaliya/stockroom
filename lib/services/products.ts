
import {
  and,
  count,
  desc,
  eq,
  ilike,
  or,
  gt,
  lte,
} from "drizzle-orm";

import { db } from "@/db";
import { products, stockMovements } from "@/db/schema";

import type {
  ProductCreateInput,
  ProductUpdateInput,
} from "@/lib/validations/product";

export class DuplicateSkuError extends Error {
  constructor() {
    super("A product with this SKU already exists.");
    this.name = "DuplicateSkuError";
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

// CREATE PRODUCT
export async function createProduct(
  ownerId: string,
  input: ProductCreateInput
) {
  try {
    return await db.transaction(async (tx) => {
      // 1. Create product
      const [product] = await tx
        .insert(products)
        .values({
          ownerId,
          name: input.name,
          sku: input.sku,
          category: input.category,
          unit: input.unit,
          purchasePrice: input.purchasePrice,
          sellingPrice: input.sellingPrice,
          currentStock: input.initialStock,
          reorderLevel: input.reorderLevel,
          isActive: true,
        })
        .returning();

      // 2. Record opening stock
      if (input.initialStock > 0) {
        await tx.insert(stockMovements).values({
          ownerId,
          productId: product.id,
          quantityDelta: input.initialStock,
          reason: "opening_stock",
          note: "Initial stock when product was created",
          createdBy: ownerId,
        });
      }

      // 3. Return created product
      return product;
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new DuplicateSkuError();
    }

    throw error;
  }
}

// GET PRODUCTS
interface GetProductsOptions {
  search?: string;
  category?: string;
  stockStatus?: "in_stock" | "low_stock" | "out_of_stock";
  includeInactive?: boolean;
  page?: number;
  pageSize?: number;
}

export async function getProducts(
  ownerId: string,
  options: GetProductsOptions = {}
) {
  const page = Math.max(1, options.page ?? 1);

  const pageSize = Math.min(
    100,
    Math.max(1, options.pageSize ?? 20)
  );

  const search = options.search?.trim();
  const category = options.category?.trim();

  const where = and(
    // Only the authenticated user's products
    eq(products.ownerId, ownerId),

    // Hide inactive products by default
    options.includeInactive
      ? undefined
      : eq(products.isActive, true),

    // Search by product name, SKU or category
    search
      ? or(
          ilike(products.name, `%${search}%`),
          ilike(products.sku, `%${search}%`),
          ilike(products.category, `%${search}%`)
        )
      : undefined,

    // Exact category filter
    category
      ? eq(products.category, category)
      : undefined,

    // Stock filters
    options.stockStatus === "out_of_stock"
      ? eq(products.currentStock, 0)
      : undefined,

    options.stockStatus === "low_stock"
      ? and(
          gt(products.currentStock, 0),
          lte(products.currentStock, products.reorderLevel)
        )
      : undefined,

    options.stockStatus === "in_stock"
      ? gt(products.currentStock, products.reorderLevel)
      : undefined
  );

  const [items, countResult] = await Promise.all([
    db
      .select()
      .from(products)
      .where(where)
      .orderBy(desc(products.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),

    db
      .select({
        total: count(),
      })
      .from(products)
      .where(where),
  ]);

  const total = countResult[0].total;

  return {
    items,

    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}


// GET SINGLE PRODUCT
export async function getProductById(
  ownerId: string,
  productId: string
) {
  const [product] = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.id, productId),
        eq(products.ownerId, ownerId)
      )
    )
    .limit(1);

  return product ?? null;
}

// UPDATE PRODUCT
export async function updateProduct(
  ownerId: string,
  productId: string,
  input: ProductUpdateInput
) {
  try {
    const [updatedProduct] = await db
      .update(products)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(products.id, productId),
          eq(products.ownerId, ownerId),
          eq(products.isActive, true)
        )
      )
      .returning();

    return updatedProduct ?? null;
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new DuplicateSkuError();
    }

    throw error;
  }
}

// DEACTIVATE PRODUCT
export async function deactivateProduct(
  ownerId: string,
  productId: string
) {
  const [updatedProduct] = await db
    .update(products)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(products.id, productId),
        eq(products.ownerId, ownerId),
        eq(products.isActive, true)
      )
    )
    .returning({
      id: products.id,
    });

  return updatedProduct ?? null;
}