import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
        uri: 'https://web.dev.daory.net/graphql'
    }),
    cache: new InMemoryCache(),
});

export default client;