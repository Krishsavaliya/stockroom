
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { productUpdateSchema } from "@/lib/validations/product";

type EditValues = z.infer<typeof productUpdateSchema>;

interface ProductEditFormProps {
  product: {
    id: string;
    name: string;
    sku: string;
    category: string;
    unit: string;
    purchasePrice: string;
    sellingPrice: string;
    reorderLevel: number;
  };
}

export function ProductEditForm({
  product,
}: ProductEditFormProps) {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<EditValues>({
    resolver: zodResolver(productUpdateSchema),

    defaultValues: {
      name: product.name,
      sku: product.sku,
      category: product.category,
      unit: product.unit,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      reorderLevel: product.reorderLevel,
    },
  });

  const errors = form.formState.errors;

  async function onSubmit(values: EditValues) {
    setServerError(null);

    try {
      const response = await fetch(
        `/api/products/${product.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to update product"
        );
      }

      router.push(`/products/${product.id}`);
      router.refresh();

    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >

      <div>
        <h2 className="text-base font-semibold">
          Product Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Update your product details and pricing.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">

        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>

          <Input
            id="name"
            {...form.register("name")}
          />

          {errors.name && (
            <p className="text-xs text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>

          <Input
            id="sku"
            {...form.register("sku")}
          />

          {errors.sku && (
            <p className="text-xs text-red-500">
              {errors.sku.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>

          <Input
            id="category"
            {...form.register("category")}
          />

          {errors.category && (
            <p className="text-xs text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>

          <select
            id="unit"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            {...form.register("unit")}
          >
            {[
              "piece",
              "box",
              "kg",
              "g",
              "litre",
              "ml",
              "metre",
            ].map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>

          {errors.unit && (
            <p className="text-xs text-red-500">
              {errors.unit.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Purchase Price</Label>

          <Input
            id="purchasePrice"
            type="number"
            min="0"
            step="0.01"
            {...form.register("purchasePrice")}
          />

          {errors.purchasePrice && (
            <p className="text-xs text-red-500">
              {errors.purchasePrice.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Selling Price</Label>

          <Input
            id="sellingPrice"
            type="number"
            min="0"
            step="0.01"
            {...form.register("sellingPrice")}
          />

          {errors.sellingPrice && (
            <p className="text-xs text-red-500">
              {errors.sellingPrice.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reorderLevel">Reorder Level</Label>

          <Input
            id="reorderLevel"
            type="number"
            min="0"
            step="1"
            {...form.register("reorderLevel", {
              valueAsNumber: true,
            })}
          />

          {errors.reorderLevel && (
            <p className="text-xs text-red-500">
              {errors.reorderLevel.message}
            </p>
          )}
        </div>

      </div>

      {/* Current stock is intentionally read-only */}
      <div className="rounded-lg bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-700">
          Current Stock
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {product.id ? "Stock changes are managed separately in the Inventory section." : ""}
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
        >
          {serverError}
        </div>
      )}

      <div className="flex justify-end gap-3 border-t pt-5">

        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={form.formState.isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? "Saving..."
            : "Save Changes"}
        </Button>

      </div>

    </form>
  );
}
