"use client";

import { useState, useTransition } from "react";
import { addProduct } from "@/actions/Cart/addProduct";

export function AddToCartForm({
  productId,
  availableQuantity,
}: {
  productId: string;
  availableQuantity: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setQuantity(Number(event.target.value));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("productId", productId);
      formData.set("quantity", String(quantity));

      const result = await addProduct(formData);

      if (result.success) {
        console.log("Product added to cart:", result);
      } else {
        console.log("Error adding product:", result);
      }
    });
  };

  const maxQuantity = Math.max(1, availableQuantity);

  return (
    <div>
      <label htmlFor="quantity">Quantity</label>
      <select
        id="quantity"
        value={quantity}
        onChange={handleQuantityChange}
        disabled={availableQuantity === 0}
      >
        {[...Array(maxQuantity).keys()].map((i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
      <button
        onClick={handleSubmit}
        disabled={isPending || availableQuantity === 0}
      >
        {availableQuantity === 0
          ? "Out of Stock"
          : isPending
            ? "Adding..."
            : "Add to Cart"}
      </button>
    </div>
  );
}
