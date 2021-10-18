import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { AuthenticationContextProvider } from '../common/context/AuthenticationContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AuthenticationContextProvider>
        <Component {...pageProps} />
      </AuthenticationContextProvider>
    </>
  );
}
export default MyApp;
