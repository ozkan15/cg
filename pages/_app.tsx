import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
  InMemoryCache
} from '@apollo/client'
import Head from 'next/head';
import { persistCache } from 'apollo3-cache-persist';
import { useEffect, useState } from 'react';
import { DELETED_TOURNAMENTS, TOURNAMENTS_ADDITIONAL_INFO } from '../src/common/constantst';

function MyApp({ Component, pageProps }: AppProps) {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  async function initApolloClient() {
    localStorage.removeItem(DELETED_TOURNAMENTS);
    localStorage.removeItem(TOURNAMENTS_ADDITIONAL_INFO);

    const cache = new InMemoryCache()

    await persistCache({
      cache,
      storage: window.localStorage
    });

    setClient(new ApolloClient({
      cache: cache,
      uri: "https://web.dev.daory.net/graphql",
    }));
  }

  useEffect(() => {
    initApolloClient();
  }, []);

  if (!client) return null;

  return <ApolloProvider client={client}>
    <Head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css"
        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
        crossOrigin="anonymous" />
    </Head>
    <Component {...pageProps} />
  </ApolloProvider >
}

export default MyApp
