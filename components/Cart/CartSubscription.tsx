"use client";

import { useEffect, useState } from "react";
import { gql, useSubscription } from "@apollo/client";

const CART_SUBSCRIPTION = gql`
  subscription OnCartItemUpdate {
    cartItemUpdate {
      event
      payload {
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

export function CartSubscription() {
  const { data, error } = useSubscription(CART_SUBSCRIPTION);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      const { event, payload } = data.cartItemUpdate;
      if (event === "ITEM_OUT_OF_STOCK") {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          `Item "${payload.product.title}" is out of stock and removed from your cart.`,
        ]);
      } else if (event === "ITEM_QUANTITY_UPDATED") {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          `Item "${payload.product.title}" quantity has been updated to ${payload.quantity}.`,
        ]);
      }
    } else if (error) {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        "Something went wrong...",
      ]);
    }
  }, [data, error]);

  const handleAcceptChanges = (index: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index),
    );
  };

  return (
    notifications.length > 0 && (
      <div className="notification-container">
        {notifications.map((notification, index) => (
          <div key={index} className="notification-box">
            <p>{notification}</p>
            <button
              className="notification-btn"
              onClick={() => handleAcceptChanges(index)}
            >
              OK
            </button>
          </div>
        ))}
      </div>
    )
  );
}
