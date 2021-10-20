import React, { useMemo } from 'react';
import Masonry from '@mui/lab/Masonry';
import MasonryItem from '@mui/lab/MasonryItem';
import { useTheme } from '@mui/system';
import { IPostWithReplies } from '../../types/IPost';
import Post, { IPostProps } from './post/Post';
import { useMediaQuery } from '@mui/material';

interface IPostMasonry {
  posts: IPostWithReplies[];
  onDelete?: IPostProps['onDelete'];
}

export const PostMasonry: React.FC<IPostMasonry> = ({ posts, onDelete }) => {
  const theme = useTheme();
  const postsLength = posts.length;

  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const isMd = useMediaQuery(theme.breakpoints.down('lg'));
  const isLg = useMediaQuery(theme.breakpoints.down('xl'));
  const isXl = !(isXs || isSm || isMd || isLg);

  const breakpointCols = useMemo(() => {
    if (isXs || postsLength === 1) {
      return 1;
    } else if (isSm) {
      return 1;
    } else if (isMd || posts.length === 2) {
      return 2;
    } else if (isLg || posts.length === 3) {
      return 3;
    } else if (isXl) {
      return 4;
    }
  }, [isXs, isSm, isMd, isLg, isXl, postsLength]);

  return (
    <Masonry columns={breakpointCols} spacing={1} aria-label='posts'>
      {posts.map((post, index) => (
        <MasonryItem
          key={post._id ? (post._id as unknown as string) : `post_${index}`}
        >
          <Post post={post} onDelete={onDelete} />
        </MasonryItem>
      ))}
    </Masonry>
  );
};

export default PostMasonry;
