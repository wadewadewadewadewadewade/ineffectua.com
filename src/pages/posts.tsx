import React from 'react';
import { useRouter } from 'next/dist/client/router';
import AddPost from '../common/components/posts/AddPost';
import { IPostWithReplies } from '../common/types/IPost';
import { GetServerSideProps } from 'next';
import { RequireAuthentication } from '../common/components/users/RequireAuthentication';
import { getStaticApolloClient } from '../common/utils/apollo-client';
import { IUserProjection } from '../common/models/users/user';
import { withApollo } from '@apollo/client/react/hoc';
import { GET_CURRENT_USER } from '../common/graphql/queries/currentUser';
import { GET_POSTS } from '../common/graphql/queries/posts';

export const getServerSideProps: GetServerSideProps = async () => {
  const client = await getStaticApolloClient();
  const {
    data: { currentUser },
  } = await client.query({
    query: GET_CURRENT_USER,
  });
  const {
    data: { posts },
  } = await client.query({
    query: GET_POSTS,
  });

  return {
    props: {
      posts,
      user: currentUser,
      // this hydrates the clientside Apollo cache in the `withApollo` HOC
      apolloStaticCache: client.cache.extract(),
      fallback: 'blocking',
      revalidate: 1,
    },
  };
};

export function Home({
  posts,
  user,
}: {
  posts: IPostWithReplies[];
  user: IUserProjection | false;
}) {
  const router = useRouter();
  return (
    <RequireAuthentication user={user}>
      <AddPost
        onPost={() => {
          router.replace(router.asPath);
        }}
        replies={posts}
      />
    </RequireAuthentication>
  );
}

export default withApollo(Home);
