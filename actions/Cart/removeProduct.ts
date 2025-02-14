"use server";

import { cookies } from "next/headers";
import { cartRemoveItemSchema } from "@/lib/validations/cart";
import type { Cart } from "@/types";

export async function removeProduct(formData: FormData): Promise<{
  success?: boolean;
  cart?: Cart;
  message?: string;
  errors?: Record<string, string[]>;
}> {
  const rawData = {
    cartItemId: formData.get("cartItemId"),
  };

  const validationResult = cartRemoveItemSchema.safeParse(rawData);
  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      message: "Invalid form data",
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("visitor-token")?.value;
  if (!token) {
    return { message: "Authentication required" };
  }

  const mutation = `
    mutation RemoveItem($input: RemoveItemArgs!) {
      removeItem(input: $input) {
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
            cartItemId: validationResult.data.cartItemId,
          },
        },
      }),
    });

    const { data, errors } = await response.json();

    if (errors) {
      return { message: errors[0].message };
    }

    return { success: true, cart: data.removeItem };
  } catch (error) {
    console.error("Remove product error:", error);
    return { message: "Failed to remove product - please try again" };
  }
}
