import React from 'react';
import { useRouter } from 'next/dist/client/router';
import AddPost from '../common/components/posts/AddPost';
import { IPostWithReplies } from '../common/types/IPost';
import fetchJson, { EApiEndpoints } from '../common/utils/fetcher';
import { GetServerSideProps } from 'next';
import { TVerifyUserResponse } from './api/auth';
import { RequireAuthentication } from '../common/components/users/RequireAuthentication';

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
