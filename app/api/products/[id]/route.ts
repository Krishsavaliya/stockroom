
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import {
  updateProduct,
  deactivateProduct,
  DuplicateSkuError,
} from "@/lib/services/products";

import { productUpdateSchema } from "@/lib/validations/product";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// PATCH /api/products/:id
export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const validId = z.string().uuid().safeParse(id);

  if (!validId.success) {
    return Response.json(
      { error: "Invalid product ID" },
      { status: 400 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON request body" },
      { status: 400 }
    );
  }

  const validation = productUpdateSchema.safeParse(body);

  if (!validation.success) {
    return Response.json(
      {
        error: "Invalid product data",
        details: validation.error.flatten(),
      },
      { status: 400 }
    );
  }

  try {
    const product = await updateProduct(
      userId,
      id,
      validation.data
    );

    if (!product) {
      return Response.json(
        { error: "Product not found or inactive" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    if (error instanceof DuplicateSkuError) {
      return Response.json(
        { error: error.message },
        { status: 409 }
      );
    }

    console.error("Update product error:", error);

    return Response.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/:id
export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const validId = z.string().uuid().safeParse(id);

  if (!validId.success) {
    return Response.json(
      { error: "Invalid product ID" },
      { status: 400 }
    );
  }

  try {
    const product = await deactivateProduct(userId, id);

    if (!product) {
      return Response.json(
        { error: "Product not found or already inactive" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Product deactivated successfully",
    });

  } catch (error) {
    console.error("Deactivate product error:", error);

    return Response.json(
      { error: "Failed to deactivate product" },
      { status: 500 }
    );
  }
}
