"use client";

import { useCart } from "@/context/CartContext";
import QuantitySelect from "@/components/Cart/CartItem/QuantitySelect";
import { RemoveButton } from "@/components/Cart/CartItem/RemoveButton";

export default function Index() {
  const { cart } = useCart();

  if (!cart) {
    return <div>Loading cart...</div>;
  }

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Shopping Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul className="space-y-4">
          {cart.items.map((item, index: number) => (
            <li key={index} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{item.product.title}</h3>
                <div className="flex">
                  <QuantitySelect
                    itemId={item._id}
                    itemQuantity={item.quantity}
                    availableQuantity={item.product.availableQuantity}
                  />
                </div>
                <RemoveButton cartItemId={item._id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
