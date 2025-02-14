"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { Cart } from "@/types";

type CartContextType = {
  cart: Cart | null;
  refreshCart: () => void;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export const GET_CART = gql`
  query GetCart {
    getCart {
      _id
      hash
      items {
        _id
        quantity
        product {
          _id
          title
          availableQuantity
          cost
        }
      }
    }
  }
`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data, refetch } = useQuery(GET_CART);

  const refreshCart = () => {
    refetch();
  };

  return (
    <CartContext.Provider
      value={{
        cart: data?.getCart || null,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
