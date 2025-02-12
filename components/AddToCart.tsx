"use client";

import { useTransition } from "react";
import { addProduct } from "@/actions/addProduct";

export function AddToCartForm({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("productId", productId);
      formData.set("quantity", "1");

      const result = await addProduct(formData);

      if (result.success) {
        console.log("yeaa");
      } else {
        console.log("nouu");
      }
    });
  };

  return (
    <button onClick={handleSubmit} disabled={isPending}>
      {isPending ? "Adding..." : "Add to Cart"}
    </button>
  );
}
