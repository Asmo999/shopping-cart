"use server";

import { cookies } from "next/headers";
import { cartAddItemSchema } from "@/lib/validations/cart";
import type { Cart } from "@/types";

export async function addProduct(formData: FormData): Promise<{
  success?: boolean;
  cart?: Cart;
  error?: string;
}> {
  const rawData = {
    productId: formData.get("productId"),
    quantity: Number(formData.get("quantity")),
  };

  const validationResult = cartAddItemSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      success: false,
      error: "Invalid form data",
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("visitor-token")?.value;
  if (!token) {
    return {
      success: false,
      error: "Authentication required",
    };
  }

  const mutation = `
    mutation AddItem($input: AddItemArgs!) {
      addItem(input: $input) {
        _id
        hash
        items {
          _id
          product {
            _id
            title
            cost
            availableQuantity
          }
          quantity
        }
      }
    }
  `;

  try {
    const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            productId: validationResult.data.productId,
            quantity: validationResult.data.quantity,
          },
        },
      }),
    });

    const { data, errors } = await response.json();

    if (errors) {
      try {
        const errorData = JSON.parse(errors[0].message);
        return {
          success: false,
          error: errorData[0].message,
        };
      } catch {
        return {
          success: false,
          error: errors[0].message,
        };
      }
    }

    return {
      success: true,
      cart: data.addItem,
    };
  } catch (error) {
    console.error("Add product error:", error);
    return {
      success: false,
      error: "Failed to add product - please try again",
    };
  }
}
