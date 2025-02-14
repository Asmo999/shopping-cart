"use client";

import { useCart } from "@/context/CartContext";
import QuantitySelect from "@/components/Cart/CartItem/QuantitySelect";
import { RemoveButton } from "@/components/Cart/CartItem/RemoveButton";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
interface CartProps {
  onCloseAction: () => void;
}

export default function Index({ onCloseAction }: CartProps) {
  const router = useRouter();
  const { cart, refreshCart } = useCart();
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const clickedElement = event.target as HTMLElement;

      const isProductListClick = clickedElement.closest(".product-list");
      const isCartClick = cartRef.current?.contains(clickedElement);
      if (isProductListClick !== null && !isCartClick) {
        onCloseAction();
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onCloseAction]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const handleCheckout = () => {
    onCloseAction();
    router.push("/checkout");
  };
  if (!cart) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white xl:left-auto xl:right-0 xl:w-[400px] xl:border-l">
        <div className="animate-pulse text-lg">Loading cart...</div>
      </div>
    );
  }

  return (
    <div
      ref={cartRef}
      className="fixed inset-0 z-50 flex flex-col bg-white xl:left-auto xl:right-0 xl:w-[400px] xl:border-l"
    >
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <button
            className="rounded-full p-2 hover:bg-gray-100"
            onClick={onCloseAction}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {cart.items.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {cart.items.map((item, index) => (
              <li
                key={item._id || index}
                className="flex h-[150px] items-start justify-between gap-2 rounded-lg border p-4"
              >
                <div className="h-full w-full basis-[34%] content-center rounded-md bg-main text-center text-black/30 xl:basis-1/2">
                  {item.product.title[0]}
                </div>
                <div className="h-full basis-full">
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex justify-between">
                      <h3 className="max-w-[150px] truncate font-medium xl:max-w-[100px] xl:text-sm">
                        {item.product.title}
                      </h3>
                      <p className="font-medium xl:text-sm">
                        ${(item.product.cost * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="">
                      <QuantitySelect
                        itemId={item._id}
                        itemQuantity={item.quantity}
                        availableQuantity={item.product.availableQuantity}
                      />
                      <RemoveButton cartItemId={item._id} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {cart.items.length > 0 && (
        <div className="border-t p-4">
          <div className="mb-4 flex justify-between xl:text-base">
            <span className="font-medium">Total</span>
            <span className="font-medium">
              $
              {cart.items
                .reduce(
                  (sum, item) => sum + item.product.cost * item.quantity,
                  0,
                )
                .toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full rounded-lg bg-black py-3 text-white hover:bg-gray-800 xl:text-base"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
