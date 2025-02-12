"use server";

import { cookies } from "next/headers";
import { cartUpdateItemQuantitySchema } from "@/lib/validations/cart";
import type { Cart } from "@/types";

export async function updateItemQuantity(formData: FormData): Promise<{
  success?: boolean;
  cart?: Cart;
  message?: string;
  errors?: Record<string, string[]>;
}> {
  const rawData = {
    cartItemId: formData.get("cartItemId"),
    quantity: Number(formData.get("quantity")),
  };
  const validationResult = cartUpdateItemQuantitySchema.safeParse(rawData);
  console.log({ validationResult });
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
    mutation updateQuantity($input: UpdateItemQuantityArgs!) {
      updateItemQuantity(input: $input) {
        _id
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
            cartItemId: validationResult.data.cartItemId,
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
