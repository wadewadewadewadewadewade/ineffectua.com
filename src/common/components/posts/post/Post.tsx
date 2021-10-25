import React, { useState } from 'react';
import { IPostWithReplies } from '../../../types/IPost';
import { Parser } from 'html-to-react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  CircularProgress,
  Fade,
  Toolbar,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddPost from '../AddPost';
import ExpandMore from '../../ExpandMore';
import { styled } from '@mui/material/styles';
import { DELETE_POST } from '../../../graphql/mutations/deletePost';
import { useMutation } from '@apollo/client';
import { TDeletePostResponse } from '../../../graphql/resolvers/mutations/deletePost';

const StyledTypography = styled(Typography)(() => ({
  img: {
    maxWidth: '100%',
  },
}));

export interface IPostProps {
  post: IPostWithReplies;
  onDelete?: (_id: IPostWithReplies['_id']) => void;
}

export const Post: React.FC<IPostProps> = ({ post, onDelete }) => {
  const [deletePost, { loading }] = useMutation<{
    deletePost: TDeletePostResponse;
  }>(DELETE_POST, {
    variables: { _id: post._id },
    onCompleted: ({ deletePost }) => {
      typeof deletePost !== 'string' && onDelete && onDelete(post._id);
    },
  });
  const [showReplies, setShowReplies] = useState(false);
  return post.body ? (
    <Card id={`post_${post._id}`}>
      <CardContent sx={{ position: 'relative' }}>
        <Fade
          in={loading}
          style={{
            transitionDelay: loading ? '800ms' : '0ms',
          }}
          unmountOnExit
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              zIndex: 2,
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.125)',
            }}
          >
            <CircularProgress />
          </Box>
        </Fade>
        <Typography color='text.secondary' gutterBottom component='time'>
          {typeof post.createdAt === 'string'
            ? new Date(parseInt(post.createdAt, 10)).toLocaleString('en-US')
            : typeof post.createdAt === 'number'
            ? new Date(post.createdAt).toLocaleString('en-US')
            : post.createdAt.toLocaleString('en-US')}
        </Typography>
        <StyledTypography as='div'>
          {new Parser().parse(post.body)}
        </StyledTypography>
      </CardContent>
      <CardActions>
        <Toolbar
          sx={{ flexGrow: 1, paddingLeft: 1, paddingRight: 1 }}
          disableGutters
        >
          {showReplies && (
            <Button
              disabled={loading}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                deletePost();
              }}
              type='button'
            >
              delete
            </Button>
          )}
          <Box sx={{ display: 'flex', flexGrow: 1 }}></Box>
          <ExpandMore
            expand={showReplies}
            onClick={() => setShowReplies(prevState => !prevState)}
            aria-expanded={showReplies}
            aria-label='see replies'
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Toolbar>
      </CardActions>
      <Collapse
        in={showReplies}
        timeout='auto'
        sx={{ paddingLeft: 1, paddingRight: 1 }}
      >
        <AddPost inReplyTo={post._id} />
      </Collapse>
    </Card>
  ) : null;
};

export default Post;
