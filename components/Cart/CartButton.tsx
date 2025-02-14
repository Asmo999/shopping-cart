"use client";

import { ShoppingCart } from "lucide-react";

interface CartButtonProps {
  onClickAction: () => void;
}

export default function CartButton({ onClickAction }: CartButtonProps) {
  return (
    <button onClick={onClickAction} className="flex items-center gap-2">
      <ShoppingCart />
      Cart
    </button>
  );
}
