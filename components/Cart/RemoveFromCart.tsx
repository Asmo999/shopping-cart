"use client";

import { useTransition } from "react";
import { removeProduct } from "@/actions/Cart/removeProduct";
import { useCart } from "@/context/CartContext";

export function RemoveFromCartButton({ cartItemId }: { cartItemId: string }) {
  const [isPending, startTransition] = useTransition();
  const { refreshCart } = useCart();
  const handleRemove = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("cartItemId", cartItemId);

      const result = await removeProduct(formData);

      if (result.success) {
        refreshCart();
      } else {
      }
    });
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      className="text-red-500 hover:text-red-700"
    >
      {isPending ? "Removing..." : "Remove"}
    </button>
  );
}
