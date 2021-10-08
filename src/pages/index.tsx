import { List, ListItem } from '@mui/material';
import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import AddPost from '../common/components/posts/AddPost';
import Post from '../common/components/posts/post/Post';
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
  const [postChanging, setPostChanging] = useState(false);
  const [postsChanging, setPostsChanging] = useState(false);
  return (
    <div className={styles.container}>

      <main className={styles.main}>
        <h1 className="title">
          Welcome to <a href="https://nextjs.org">Next.js with MongoDB!</a>
        </h1>

        <h2 className="subtitle">Posts</h2>
        
        <div className={styles.screenContainer}>
          <div className={styles.screen} style={{ display: postsChanging ? 'block' : 'none'}}></div>
          <AddPost
            onWillPost={() => setPostsChanging(true)}
            onPost={() => {
              setPostsChanging(false);
              router.replace(router.asPath);
            }}
          />
          <div className={styles.screenContainer}>
            <div className={styles.screen} style={{ display: postChanging ? 'block' : 'none'}}>
              {/* screen for loading stuff */}
            </div>
            <List aria-label="posts">
              {posts.map((post, index) => (
                <ListItem
                  key={post._id ? (post._id as unknown) as string : `post_${index}`}
                >
                  <Post
                    post={post}
                    onWillChange={() => setPostChanging(true)}
                    onChange={() => {
                      setPostChanging(false);
                      router.replace(router.asPath);
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        </div>
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
