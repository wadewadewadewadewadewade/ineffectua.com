import React from 'react';
import { useRouter } from 'next/dist/client/router';
import AddPost from '../common/components/posts/AddPost';
import { IPostWithReplies } from '../common/types/IPost';
import fetchJson, { EApiEndpoints } from '../common/utils/fetcher';
import styles from '../styles/pages/index.module.scss';
import { Authentication } from '../common/components/users/Authentication';
import { ConfirmEmail } from '../common/components/users/ConfirmEmail';
import { GetServerSideProps } from 'next';
import { TVerifyUserResponse } from './api/auth';
import { SiteAppBar } from '../common/components/navigation/SiteAppBar';

type THeaders = [string, string];

export const getServerSideProps: GetServerSideProps = async context => {
  const isHeaders = (obj: [key: string, val: string]): obj is THeaders =>
    typeof obj[1] === 'string';
  const contextHeadersArray: THeaders[] = Object.entries(
    context.req.headers,
  ).filter(isHeaders);
  const contextHeaders: Record<string, string> = contextHeadersArray.reduce(
    (acc, obj) => ({ ...acc, [obj[0]]: obj[1] }),
    {},
  );
  const user: TVerifyUserResponse = await fetchJson(
    'GET',
    EApiEndpoints.VERIFY,
    undefined,
    undefined,
    {
      ...contextHeaders,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  );
  const posts = await fetchJson('GET', EApiEndpoints.POSTS);
  return {
    props: {
      posts,
      user,
      fallback: 'blocking',
      revalidate: 1,
    },
  };
};

export default function Home({
  posts,
  user,
}: {
  posts: IPostWithReplies[];
  user: TVerifyUserResponse;
}) {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <SiteAppBar title='Posts' />
      <main className={styles.main}>
        <h1 className='title'>
          Welcome to <a href='https://nextjs.org'>Next.js with MongoDB!</a>
        </h1>
        {'isAuthenticated' in user ? (
          <Authentication />
        ) : user.isConfirmed ? (
          <>
            <h2 className='subtitle'>Posts</h2>
            <AddPost
              onPost={() => {
                router.replace(router.asPath);
              }}
              replies={posts}
            />
          </>
        ) : (
          <ConfirmEmail />
        )}
      </main>

      <footer className={styles.footer}>
        <a href='https://vercel.com' target='_blank' rel='noopener noreferrer'>
          Powered by{' '}
          <img src='/vercel.svg' alt='Vercel Logo' className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
