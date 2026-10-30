
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { productCreateSchema } from "@/lib/validations/product";

type ProductFormValues = z.infer<typeof productCreateSchema>;

export function ProductForm() {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productCreateSchema),

    defaultValues: {
      name: "",
      sku: "",
      category: "",
      unit: "piece",
      purchasePrice: "0.00",
      sellingPrice: "0.00",
      initialStock: 0,
      reorderLevel: 0,
    },
  });

  async function onSubmit(values: ProductFormValues) {
    setServerError(null);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(
          result.error || "Failed to create product"
        );
        return;
      }

      router.push("/products");
      router.refresh();

    } catch {
      setServerError(
        "Unable to connect to the server. Please try again."
      );
    }
  }

  const errors = form.formState.errors;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >

      {/* Product Information */}
      <section className="space-y-4">

        <div>
          <h2 className="text-base font-semibold">
            Product Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter the basic details of your product.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>

            <Input
              id="name"
              placeholder="Mechanical Keyboard"
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
              placeholder="KB001"
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
              placeholder="Electronics"
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
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              {...form.register("unit")}
            >
              <option value="piece">Piece</option>
              <option value="box">Box</option>
              <option value="kg">Kilogram (kg)</option>
              <option value="g">Gram (g)</option>
              <option value="litre">Litre</option>
              <option value="ml">Millilitre (ml)</option>
              <option value="metre">Metre</option>
            </select>

            {errors.unit && (
              <p className="text-xs text-red-500">
                {errors.unit.message}
              </p>
            )}
          </div>

        </div>

      </section>

      {/* Pricing */}
      <section className="space-y-4">

        <div>
          <h2 className="text-base font-semibold">
            Pricing
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Set purchase and selling prices.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <div className="space-y-2">
            <Label htmlFor="purchasePrice">
              Purchase Price
            </Label>

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
            <Label htmlFor="sellingPrice">
              Selling Price
            </Label>

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

        </div>

      </section>

      {/* Inventory */}
      <section className="space-y-4">

        <div>
          <h2 className="text-base font-semibold">
            Initial Inventory
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Set the starting quantity and low-stock threshold.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <div className="space-y-2">
            <Label htmlFor="initialStock">
              Opening Stock
            </Label>

            <Input
              id="initialStock"
              type="number"
              min="0"
              step="1"
              {...form.register("initialStock", {
                valueAsNumber: true,
              })}
            />

            {errors.initialStock && (
              <p className="text-xs text-red-500">
                {errors.initialStock.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reorderLevel">
              Reorder Level
            </Label>

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

      </section>

      {/* Server Error */}
      {serverError && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
        >
          {serverError}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/products")}
          disabled={form.formState.isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? "Creating..."
            : "Create Product"}
        </Button>

      </div>

    </form>
  );
}
