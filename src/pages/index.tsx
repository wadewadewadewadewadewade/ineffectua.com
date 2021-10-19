import React from 'react';
import { useRouter } from 'next/dist/client/router';
import AddPost from '../common/components/posts/AddPost';
import { IPostWithReplies } from '../common/types/IPost';
import fetchJson, { EApiEndpoints } from '../common/utils/fetcher';
import styles from '../styles/pages/index.module.scss';
import { Authentication } from '../common/components/users/Authentication';
import { IUser } from '../common/models/users/user';
import { ConfirmEmail } from '../common/components/users/ConfirmEmail';
import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user: IUser | false = await fetchJson(
    'GET',
    EApiEndpoints.VERIFY,
    undefined,
    undefined,
    context.req.headers,
  );
  const posts =
    user === false || !user.isConfirmed
      ? []
      : await fetchJson('GET', EApiEndpoints.POSTS);
  return {
    props: {
      posts,
      user,
      fallback: 'blocking',
    },
  };
}

export default function Home({
  posts,
  user,
}: {
  posts: IPostWithReplies[];
  user: IUser | false;
}) {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className='title'>
          Welcome to <a href='https://nextjs.org'>Next.js with MongoDB!</a>
        </h1>
        {user ? (
          user.isConfirmed ? (
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
          )
        ) : (
          <Authentication />
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
