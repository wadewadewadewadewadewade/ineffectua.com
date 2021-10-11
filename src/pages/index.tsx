import React from 'react';
import { useRouter } from 'next/dist/client/router';
import AddPost from '../common/components/posts/AddPost';
import { IPostWithReplies } from '../common/types/IPost';
import fetchJson from '../common/utils/fetcher';
import styles from '../styles/pages/index.module.scss';

export async function getServerSideProps() {
  const [posts] = await Promise.all([
    fetchJson(`http://localhost:3000/api/posts`)
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
  return (
    <div className={styles.container}>

      <main className={styles.main}>
        <h1 className="title">
          Welcome to <a href="https://nextjs.org">Next.js with MongoDB!</a>
        </h1>

        <h2 className="subtitle">Posts</h2>
        <AddPost
          onPost={() => {
            router.replace(router.asPath);
          }}
          replies={posts}
        />
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
