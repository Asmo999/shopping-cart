import {
  ApolloClient,
  InMemoryCache,
  split,
  ApolloLink,
  Observable,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { HttpLink } from "@apollo/client";
import { getVisitorToken } from "@/actions/getVisitorToken";

async function getHeaders() {
  try {
    const visitorToken = await getVisitorToken();
    return {
      authorization: visitorToken ? `Bearer ${visitorToken}` : "",
    };
  } catch (error) {
    console.error("Failed to get visitor token:", error);
    return {};
  }
}

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "FallbackUri",
});

const authLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    getHeaders()
      .then((headers) => {
        operation.setContext({
          headers: {
            ...headers,
          },
        });

        forward(operation).subscribe({
          next: (result) => observer.next(result),
          error: (error) => observer.error(error),
          complete: () => observer.complete(),
        });
      })
      .catch((error) => {
        observer.error(error);
      });
  });
});

const wsUrl = process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT;
if (!wsUrl) {
  throw new Error("NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT is not configured");
}
const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT || "FallbackUri",
    connectionParams: async () => {
      try {
        const token = await getVisitorToken();
        console.log("Token for WebSocket connection:", token);
        return {
          authToken: token || "",
        };
      } catch (error) {
        console.error(
          "Error getting visitor token for WebSocket connection:",
          error,
        );
        return {};
      }
    },
  }),
);

const splitLink =
  typeof window !== "undefined" && true
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        authLink.concat(httpLink),
      )
    : authLink.concat(httpLink);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
