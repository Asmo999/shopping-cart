"use client";

import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/apollo/Client";
import { CartProvider } from "@/context/CartContext";
import { CartSubscription } from "@/components/Cart/CartSubscription";
import Cart from "@/components/Cart";
import { useState } from "react";
import CartButton from "@/components/Cart/CartButton";

const CartWrapper = () => {
  const [showCart, setShowCart] = useState(false);
  return (
    <ApolloProvider client={client}>
      <CartProvider>
        <CartButton onClickAction={() => setShowCart(true)} />
        {showCart && (
          <>
            <Cart onCloseAction={() => setShowCart(false)} />
            <CartSubscription />
          </>
        )}
      </CartProvider>
    </ApolloProvider>
  );
};

export default CartWrapper;
