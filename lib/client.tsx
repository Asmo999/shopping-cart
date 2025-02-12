import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { setContext } from "@apollo/client/link/context";
import { cookies } from "next/headers";

const httpLink = new HttpLink({ uri: "https://take-home-be.onrender.com/api" });

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

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
    // link: new HttpLink({
    //   // this needs to be an absolute url, as relative urls cannot be used in SSR
    //   uri: "http://example.com/api/graphql",
    //   // you can disable result caching here if you want to
    //   // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
    //   // fetchOptions: { cache: "no-store" },
    // }),
  });
});
