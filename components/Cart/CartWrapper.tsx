"use client";

import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/apollo/Client";
import { CartProvider } from "@/context/CartContext";
import { CartSubscription } from "@/components/Cart/CartSubscription";
import Cart from "@/components/Cart";

const CartWrapper = () => {
  return (
    <ApolloProvider client={client}>
      <CartProvider>
        <Cart />
        <CartSubscription />
      </CartProvider>
    </ApolloProvider>
  );
};

export default CartWrapper;
