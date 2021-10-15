import React from 'react';
import { useRouter } from 'next/dist/client/router';
import AddPost from '../common/components/posts/AddPost';
import { IPostWithReplies } from '../common/types/IPost';
import fetchJson, { EApiEndpoints } from '../common/utils/fetcher';
import styles from '../styles/pages/index.module.scss';
import { Authentication } from '../common/components/users/Authentication';
import { IUser } from '../common/models/users/user';

export async function getServerSideProps() {
  const user: IUser | false = await (
    await fetch('http://localhost:3000/api/auth/me')
  ).json();
  const posts =
    user === false ? [] : await fetchJson('GET', EApiEndpoints.POSTS);
  return {
    props: {
      posts,
      user: false,
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
          <Authentication />
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by{' '}
          <img src='/vercel.svg' alt='Vercel Logo' className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
