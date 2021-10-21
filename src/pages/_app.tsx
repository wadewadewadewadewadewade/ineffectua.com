import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import client from '../common/utils/apollo-client';
import { AuthenticationContextProvider } from '../common/context/AuthenticationContext';
import { ThemeProvider } from '@mui/material';
import theme from '../theme';
import { SiteAppBar } from '../common/components/navigation/SiteAppBar';
import styles from '../styles/global.module.scss';
import '../styles/global.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
        <link
          href='https://fonts.googleapis.com/css2?family=Montserrat&display=swap'
          rel='stylesheet'
        />
      </Head>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <AuthenticationContextProvider>
            <div className={styles.container}>
              <SiteAppBar />

              <main className={styles.main}>
                <Component {...pageProps} />
              </main>

              <footer className={styles.footer}>
                <a
                  href='https://vercel.com'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Powered by{' '}
                  <img
                    src='/vercel.svg'
                    alt='Vercel Logo'
                    className={styles.logo}
                  />
                </a>
              </footer>
            </div>
          </AuthenticationContextProvider>
        </ThemeProvider>
      </ApolloProvider>
    </>
  );
}
export default MyApp;
