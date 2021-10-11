import React, { useState } from 'react';
import { IPostWithReplies } from '../../../types/IPost';
import { Parser } from 'html-to-react';
import fetchJson from '../../../utils/fetcher';
import { Box, Button, Card, CardActions, CardContent, Collapse, CircularProgress, Fade, Toolbar, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddPost from '../AddPost';
import ExpandMore from '../../ExpandMore';
import { styled } from '@mui/material/styles';

const StyledTypography = styled(Typography)(() => ({
  'img': {
    maxWidth: '100%'
  }
}));

export interface IPostProps {
  post: IPostWithReplies,
}

export const Post: React.FC<IPostProps> = ({
  post,
}) => {
  const [replies, updateReplies] = useState<IPostWithReplies[]>(post.replies);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showReplies, setShowReplies] = useState(false);
  const onDelete = async () => {
    setIsLoading(true);
    await fetchJson(`/api/posts/${post._id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    });
    setIsLoading(false);
  };
  return post.body ? (
    <Card id={`post_${post._id}`}>
      <CardContent sx={{ position: 'relative' }}>
        <Fade
          in={isLoading}
          style={{
            transitionDelay: isLoading ? '800ms' : '0ms',
          }}
          unmountOnExit
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 2, top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.125)' }}>
            <CircularProgress />
          </Box>
        </Fade>
        <Typography color="text.secondary" gutterBottom component="time">
          {post.created}
        </Typography>
        <StyledTypography gutterBottom>
          {new Parser().parse(post.body)}
        </StyledTypography>
      </CardContent>
      <CardActions>
        <Toolbar sx={{ flexGrow: 1, paddingLeft: 1, paddingRight: 1 }} disableGutters>
          {showReplies && (
            <Button
              disabled={isLoading}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              type="button"
            >
              delete
            </Button>
          )}
          <Box sx={{ display: 'flex', flexGrow: 1 }}></Box>
          <ExpandMore
            expand={showReplies}
            onClick={() => setShowReplies(prevState => !prevState)}
            aria-expanded={showReplies}
            aria-label="see replies"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Toolbar>
      </CardActions>
      <Collapse in={showReplies} timeout="auto" sx={{ paddingLeft: 1, paddingRight: 1 }}>
        <AddPost
          onPost={newPost => updateReplies([newPost, ...replies])}
          replies={replies}
        />
      </Collapse>
    </Card>
  ) : null
};

export default Post;
