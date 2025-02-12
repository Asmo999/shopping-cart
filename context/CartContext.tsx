"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { Cart, Notification } from "@/types";

type CartContextType = {
  cart: Cart | null;
  notifications: Notification[];
  showNotification: (notification: Notification) => void;
  dismissNotification: () => void;
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
        }
      }
    }
  }
`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data, loading, error, refetch } = useQuery(GET_CART);

  useEffect(() => {
    if (error) {
      showNotification({
        type: "error",
        message: "Failed to fetch cart data",
      });
    }
  }, [error]);

  const showNotification = (notification: Notification) => {
    // setNotifications((prev) => [...prev, notification]);
  };

  const dismissNotification = () => {
    setNotifications((prev) => prev.slice(1));
  };

  const refreshCart = () => {
    refetch();
  };

  return (
    <CartContext.Provider
      value={{
        cart: data?.getCart || null,
        notifications,
        showNotification,
        dismissNotification,
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
