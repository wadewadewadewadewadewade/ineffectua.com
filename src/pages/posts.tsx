import React from 'react';
import { useRouter } from 'next/dist/client/router';
import AddPost from '../common/components/posts/AddPost';
import { IPostWithReplies } from '../common/types/IPost';
import { GetServerSideProps } from 'next';
import { RequireAuthentication } from '../common/components/users/RequireAuthentication';
import {
  deserealizeUser,
  IUserProjection,
  serealizeUser,
} from '../common/models/users/user';
import { GET_POSTS } from '../common/graphql/queries/posts';
import { initApolloClient } from '../common/services/apollo';
import { cookie, ICookieOptions } from '../common/graphql/helpers/withCookies';
import { isAuthenticated } from '../common/graphql/context';
import { ineffectuaDb } from '../common/utils/mongodb';

export const getServerSideProps: GetServerSideProps = async ctx => {
  const c = (name: string, value: string, options: ICookieOptions) =>
    cookie(ctx.res.setHeader, name, value, options);
  const user = isAuthenticated(ctx.req);
  const context = { db: ineffectuaDb, cookie: c, user };
  const client = initApolloClient({});
  const {
    data: { posts },
  } = await client.query({
    query: GET_POSTS,
    context,
  });
  console.log({ posts, user });
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
  posts: IPostWithReplies[];
  serialzedUser: string;
}) {
  const router = useRouter();
  const user: IUserProjection | false = deserealizeUser(serialzedUser);
  console.log({ user });
  return (
    <>
      <RequireAuthentication user={user}>
        <AddPost
          onPost={() => {
            router.replace(router.asPath);
          }}
          replies={posts}
        />
      </RequireAuthentication>
    </>
  );
}

export default Home;
