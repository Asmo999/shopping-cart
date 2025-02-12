"use server";

import { cookies } from "next/headers";
import { cartAddItemSchema } from "@/lib/validations/cart";
import type { Cart } from "@/types";

export async function addProduct(formData: FormData): Promise<{
  success?: boolean;
  cart?: Cart;
  message?: string;
  errors?: Record<string, string[]>;
}> {
  const rawData = {
    productId: formData.get("productId"),
    quantity: Number(formData.get("quantity")),
  };

  const validationResult = cartAddItemSchema.safeParse(rawData);
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
    const response = await fetch(process.env.GRAPHQL_ENDPOINT!, {
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
      return { message: errors[0].message };
    }

    return { success: true, cart: data.addItem };
  } catch (error) {
    console.error("Add product error:", error);
    return { message: "Failed to add product - please try again" };
  }
}
