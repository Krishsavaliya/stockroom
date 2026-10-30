
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  sellingPrice: string;
  isActive: boolean;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

type StockStatus =
  | ""
  | "in_stock"
  | "low_stock"
  | "out_of_stock";

export function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stockStatus, setStockStatus] =
    useState<StockStatus>("");

  const [includeInactive, setIncludeInactive] =
    useState(false);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: String(pagination.page),
          pageSize: String(pagination.pageSize),
        });

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (category.trim()) {
          params.set("category", category.trim());
        }

        if (stockStatus) {
          params.set("stockStatus", stockStatus);
        }

        if (includeInactive) {
          params.set("includeInactive", "true");
        }

        const response = await fetch(
          `/api/products?${params.toString()}`,
          {
            signal: controller.signal,
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Failed to fetch products"
          );
        }

        setProducts(result.items);
        setPagination(result.pagination);

      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );

      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    // Small delay to prevent a request on every keystroke.
    const timeout = setTimeout(fetchProducts, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };

  }, [
    search,
    category,
    stockStatus,
    includeInactive,
    pagination.page,
    pagination.pageSize,
  ]);

  function resetPage() {
    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  }

  const startItem =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) * pagination.pageSize + 1;

  const endItem = Math.min(
    pagination.page * pagination.pageSize,
    pagination.total
  );

  const totalPages = Math.max(1, pagination.totalPages);

  return (
    <div className="space-y-5">

      {/* Search and Add Product */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <Input
          placeholder="Search by name, SKU or category..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetPage();
          }}
          className="sm:max-w-sm"
        />

        <Link href="/products/new">
          <Button className="w-full sm:w-auto">
            + Add Product
          </Button>
        </Link>

      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

        <Input
          placeholder="Filter by category..."
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            resetPage();
          }}
          className="sm:max-w-xs"
        />

        <select
          value={stockStatus}
          onChange={(e) => {
            setStockStatus(e.target.value as StockStatus);
            resetPage();
          }}
          className="h-9 rounded-md border border-input bg-white px-3 text-sm"
        >
          <option value="">All stock statuses</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(e) => {
              setIncludeInactive(e.target.checked);
              resetPage();
            }}
          />
          Include inactive
        </label>

      </div>

      {/* Products Table */}
      <div className="overflow-x-auto rounded-xl border bg-white">

        <table className="w-full text-left text-sm">

          <thead className="border-b bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4 font-medium">Product</th>
              <th className="px-5 py-4 font-medium">SKU</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Stock</th>
              <th className="px-5 py-4 font-medium">Selling Price</th>
              <th className="px-5 py-4 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {loading && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                  Loading products...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-red-600">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                  No products found.
                </td>
              </tr>
            )}

            {!loading && !error && products.map((product) => {

              const status = !product.isActive
                ? "Inactive"
                : product.currentStock === 0
                  ? "Out of Stock"
                  : product.currentStock <= product.reorderLevel
                    ? "Low Stock"
                    : "In Stock";

              const statusClass = !product.isActive
                ? "bg-slate-100 text-slate-600"
                : status === "Out of Stock" ||
                    status === "Low Stock"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700";

              return (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50"
                >

                  <td className="px-5 py-4 font-medium">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-slate-900 hover:text-blue-600 hover:underline"
                    >
                      {product.name}
                    </Link>
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {product.sku}
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {product.category}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {product.currentStock} {product.isActive ? "" : "(inactive)"}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {Number(product.sellingPrice).toFixed(2)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
                    >
                      {status}
                    </span>
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-sm text-slate-500">
          Showing {startItem}–{endItem} of {pagination.total} products
        </p>

        <div className="flex items-center gap-3">

          <Button
            variant="outline"
            size="sm"
            disabled={loading || pagination.page <= 1}
            onClick={() => {
              setPagination((previous) => ({
                ...previous,
                page: previous.page - 1,
              }));
            }}
          >
            Previous
          </Button>

          <span className="text-sm text-slate-600">
            Page {Math.min(pagination.page, totalPages)} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={
              loading ||
              pagination.page >= pagination.totalPages
            }
            onClick={() => {
              setPagination((previous) => ({
                ...previous,
                page: previous.page + 1,
              }));
            }}
          >
            Next
          </Button>

        </div>

      </div>

    </div>
  );
}
