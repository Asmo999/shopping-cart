import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { setContext } from "@apollo/client/link/context";
import { cookies } from "next/headers";

const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_ENDPOINT,
});

const authLink = setContext(async (_, { headers }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("visitor-token");
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${token?.value}`,
    },
  };
});

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
});
