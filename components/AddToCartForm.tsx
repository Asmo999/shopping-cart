"use client";
import { useState, useTransition, useRef, useEffect } from "react";
import { addProduct } from "@/actions/Cart/addProduct";
import { Plus, ChevronDown, X } from "lucide-react";

export function AddToCartForm({
  productId,
  availableQuantity,
}: {
  productId: string;
  availableQuantity: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = () => {
    setError("");
    setSuccess(false);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("productId", productId);
      formData.set("quantity", String(quantity));

      const result = await addProduct(formData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2800);
      } else {
        setError(
          result.error || "Failed to add item to cart. Please try again.",
        );
      }
    });
  };

  if (availableQuantity === 0) {
    return (
      <div className="flex items-center">
        <span className="font-medium text-red-500">Out of Stock</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {error && (
        <div className="absolute top-[-150px] flex items-center justify-between rounded-md bg-red-50 px-4 py-2 text-sm text-red-600 xl:top-[-100px]">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-2 text-red-400 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="absolute top-[-150px] flex items-center justify-between rounded-md bg-green-50 px-4 py-2 text-sm text-green-600 xl:top-[-100px]">
          <span>Product added successfully! Check out your cart.</span>
          <button
            onClick={() => setSuccess(false)}
            className="ml-2 text-green-400 hover:text-green-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={isPending}
            className="flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1 hover:bg-gray-50"
          >
            <span>{quantity}</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {isOpen && (
            <div className="absolute left-0 top-full mt-1 max-h-48 w-20 overflow-auto rounded-md border bg-white shadow-lg">
              {[...Array(availableQuantity).keys()].map((i) => (
                <button
                  key={i + 1}
                  onClick={() => {
                    setQuantity(i + 1);
                    setIsOpen(false);
                  }}
                  className="w-full px-2 py-1 text-left hover:bg-gray-100"
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="flex items-center rounded-md border px-3 py-1 transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden xl:block">
            {isPending ? "Adding..." : "Add to Cart"}
          </span>
          <span className="block xl:hidden">
            {isPending ? "Adding..." : "Add"}
          </span>
        </button>
      </div>
    </div>
  );
}
