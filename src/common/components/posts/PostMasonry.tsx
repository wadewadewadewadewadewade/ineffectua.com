import React, { useMemo } from 'react';
import Masonry from '@mui/lab/Masonry';
import MasonryItem from '@mui/lab/MasonryItem';
import { useTheme } from '@mui/system';
import { IPostWithReplies } from '../../types/IPost';
import Post from './post/Post';
import { useMediaQuery } from '@mui/material';

interface IPostMasonry {
  posts: IPostWithReplies[],
}

export const PostMasonry: React.FC<IPostMasonry> = ({
  posts
}) => {
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const isMd = useMediaQuery(theme.breakpoints.down('lg'));
  const isLg = useMediaQuery(theme.breakpoints.down('xl'));
  const isXl = !(isXs || isSm || isMd || isLg);

  const breakpointCols = useMemo(() => {
    if (isXs) {
      return 1;
    } else if (isSm) {
      return 1;
    } else if (isMd) {
      return 2;
    } else if (isLg) {
      return 3;
    } else if (isXl) {
      return 4;
    }
  }, [isXs, isSm, isMd, isLg, isXl]);

  return (
    <Masonry
      columns={breakpointCols}
      spacing={1}
      aria-label="posts"
    >
       {posts.map((post, index) => (
          <MasonryItem
            key={post._id ? (post._id as unknown) as string : `post_${index}`}
          >
            <Post post={post} />
          </MasonryItem>
        ))}
    </Masonry>
  );
}

export default PostMasonry;
