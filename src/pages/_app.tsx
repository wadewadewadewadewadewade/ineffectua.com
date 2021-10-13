import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { UserfrontAuthenticationContextProvider } from '../common/context/UserfrontAuthenticationContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UserfrontAuthenticationContextProvider>
        <Component {...pageProps} />
      </UserfrontAuthenticationContextProvider>
    </>
  )
}
export default MyApp