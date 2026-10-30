"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ProductActionsProps {
  productId: string;
  isActive: boolean;
}

export function ProductActions({
  productId,
  isActive,
}: ProductActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDeactivate() {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this product?"
    );

    if (!confirmed) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Deactivation failed");
      }

      router.replace("/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isActive) return null;

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        variant="destructive"
        onClick={handleDeactivate}
        disabled={loading}
      >
        {loading ? "Deactivating..." : "Deactivate"}
      </Button>

      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
