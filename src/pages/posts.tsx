import React from 'react';
import { useRouter } from 'next/dist/client/router';
import AddPost from '../common/components/posts/AddPost';
import { GetServerSideProps } from 'next';
import { RequireAuthentication } from '../common/components/users/RequireAuthentication';
import {
  IUserProjection,
  serealizeUser,
  deserealizeUser,
} from '../common/models/users/user';
import { GET_POSTS } from '../common/graphql/queries/posts';
import { initApolloClient } from '../common/services/apollo';
import { cookie, ICookieOptions } from '../common/graphql/helpers/withCookies';
import { isAuthenticated } from '../common/graphql/context';
import { ineffectuaDb } from '../common/utils/mongodb';
import PostMasonry from '../common/components/posts/PostMasonry';
import { IPost } from '../common/models/posts/post';

export const getServerSideProps: GetServerSideProps = async ctx => {
  const c = (name: string, value: string, options: ICookieOptions) =>
    cookie(ctx.res, name, value, options);
  const user = isAuthenticated(ctx.req);
  const context = { db: ineffectuaDb, cookie: c, user };
  const client = initApolloClient();
  const {
    data: { getPosts: posts },
  } = await client.query<{ getPosts: IPost[] }>({
    query: GET_POSTS,
    variables: { inReplyTo: null },
    context,
  });
  return {
    props: {
      posts: posts || [],
      serialzedUser: serealizeUser(user),
      // this hydrates the clientside Apollo cache
      apolloStaticCache: client.cache.extract(),
      fallback: 'blocking',
      revalidate: 1,
    },
  };
};

export function Home({
  posts,
  serialzedUser,
}: {
  posts: IPost[];
  serialzedUser: string;
}) {
  const router = useRouter();
  const user: IUserProjection | false = deserealizeUser(serialzedUser);
  return (
    <RequireAuthentication user={user}>
      <AddPost
        onPost={() => {
          router.replace(router.asPath);
        }}
        addNewPostOnly={true}
      />
      <PostMasonry
        posts={posts}
        onDelete={() => router.replace(router.asPath)}
      />
    </RequireAuthentication>
  );
}

export default Home;
