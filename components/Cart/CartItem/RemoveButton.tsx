"use client";

import { useTransition } from "react";
import { removeProduct } from "@/actions/Cart/removeProduct";
import { useCart } from "@/context/CartContext";
import { Trash2 } from "lucide-react";

export function RemoveButton({ cartItemId }: { cartItemId: string }) {
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
      className="mt-2 flex items-center gap-1 rounded-md border px-2 py-1 text-sm text-red-500 hover:text-red-700"
    >
      {isPending ? "..." : <Trash2 className="h-[20px]" />}
    </button>
  );
}
