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
  const [notification, setNotification] = useState<null | string>(null);

  useEffect(() => {
    if (data) {
      const { event, payload } = data.cartItemUpdate;
      if (event === "ITEM_OUT_OF_STOCK") {
        setNotification(
          `Item "${payload.product.title}" is out of stock and removed from your cart.`,
        );
      } else if (event === "ITEM_QUANTITY_UPDATED") {
        setNotification(
          `Item "${payload.product.title}" quantity has been updated to ${payload.quantity}.`,
        );
      }
    } else if (error) {
      setNotification("Something went wrong...");
    }
  }, [data, error]);

  const handleAcceptChanges = () => {
    setNotification(null);
  };

  return (
    notification && (
      <div className="notification-container">
        <div className="notification-box">
          <p>{notification}</p>
          <button className="notification-btn" onClick={handleAcceptChanges}>
            OK
          </button>
        </div>
      </div>
    )
  );
}
