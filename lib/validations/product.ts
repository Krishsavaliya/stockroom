
import { z } from "zod";

const priceSchema = z
  .string()
  .trim()
  .regex(
    /^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/,
    "Enter a valid price with up to 2 decimal places"
  );

export const productCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must contain at least 2 characters")
    .max(150),

  sku: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .max(64),

  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(100),

  unit: z
    .string()
    .trim()
    .min(1, "Unit is required")
    .max(30),

  purchasePrice: priceSchema,

  sellingPrice: priceSchema,

  // Opening quantity is used when creating the product.
  initialStock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(2147483647),

  reorderLevel: z
    .number()
    .int("Reorder level must be a whole number")
    .min(0, "Reorder level cannot be negative")
    .max(2147483647),
});

export const productUpdateSchema = productCreateSchema
  .omit({ initialStock: true })
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided",
    }
  );

export type ProductCreateInput = z.infer<
  typeof productCreateSchema
>;

export type ProductUpdateInput = z.infer<
  typeof productUpdateSchema
>;
