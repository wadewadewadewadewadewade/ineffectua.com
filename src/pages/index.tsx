import React, { useContext } from 'react';
import { useRouter } from 'next/dist/client/router';
import AddPost from '../common/components/posts/AddPost';
import { IPostWithReplies } from '../common/types/IPost';
import fetchJson, { EApiEndpoints } from '../common/utils/fetcher';
import styles from '../styles/pages/index.module.scss';
import UserfrontAuthenticationContext from '../common/context/UserfrontAuthenticationContext';
import { Authentication } from '../common/components/users/Authentication';

export async function getServerSideProps() {
  const [posts] = await Promise.all([
    fetchJson('GET', EApiEndpoints.POSTS)
  ]);
  return {
    props: {
      posts,
      fallback: 'blocking'
    }
  };
}

export default function Home({ posts } : { posts: IPostWithReplies[] }) {
  const router = useRouter();
  const userfrontAuthentication = useContext(UserfrontAuthenticationContext);
  return (
    <div className={styles.container}>

      <main className={styles.main}>
        <h1 className="title">
          Welcome to <a href="https://nextjs.org">Next.js with MongoDB!</a>
        </h1>

        {'userId' in userfrontAuthentication ? (
          <>
            <h2 className="subtitle">Posts</h2>
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
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>

    </div>
  )
}
