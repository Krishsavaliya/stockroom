
import { auth } from "@clerk/nextjs/server";

import {
  createProduct,
  getProducts,
  DuplicateSkuError,
} from "@/lib/services/products";

import { productCreateSchema } from "@/lib/validations/product";

// GET /api/products
export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";

    const page = Math.max(
      1,
      Number(searchParams.get("page")) || 1
    );

    const pageSize = Math.min(
      100,
      Math.max(
        1,
        Number(searchParams.get("pageSize")) || 20
      )
    );

    const statusParam = searchParams.get("stockStatus");

    const allowedStatuses = [
      "in_stock",
      "low_stock",
      "out_of_stock",
    ] as const;

    const stockStatus = allowedStatuses.find(
      (status) => status === statusParam
    );

    const includeInactive =
      searchParams.get("includeInactive") === "true";

    const result = await getProducts(userId, {
      search,
      category,
      stockStatus,
      includeInactive,
      page,
      pageSize,
    });

    return Response.json(result);

  } catch (error) {
    console.error("Get products error:", error);

    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}


// POST /api/products
export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body: unknown = await request.json();

    const validation = productCreateSchema.safeParse(body);

    if (!validation.success) {
      return Response.json(
        {
          error: "Invalid product data",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const product = await createProduct(
      userId,
      validation.data
    );

    return Response.json(
      {
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof DuplicateSkuError) {
      return Response.json(
        { error: error.message },
        { status: 409 }
      );
    }

    if (error instanceof SyntaxError) {
      return Response.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    console.error("Create product error:", error);

    return Response.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
