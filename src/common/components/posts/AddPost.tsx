import React, { useRef, useState } from 'react';
import RichText from '../RichText/RichText';
import fetchJson, { EApiEndpoints } from '../../utils/fetcher';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PostMasonry from './PostMasonry';
import { Box, Button, Typography, Card, CardActions, CardContent, Collapse, Toolbar, Fade, CircularProgress } from '@mui/material';
import { IPostWithReplies } from '../../types/IPost';
import ExpandMore from '../ExpandMore';
import { useUser } from '@auth0/nextjs-auth0';

interface IFormData {
  body: string;
}

interface IAddPost {
  replies?: IPostWithReplies[]
  onWillPost?: () => void
  onPost?: (newPost: IPostWithReplies) => void
}

export const AddPost: React.FC<IAddPost> = ({
  replies,
  onWillPost,
  onPost
}) => {
  const { user, error, isLoading: isUserLoading } = useUser();
  const [body, setBody] = useState<string>();
  const [showReplies, setShowReplies] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const imagesRef = useRef<string[]>([]);
  const handleSubmit: (method: (data: IFormData) => void) => React.FormEventHandler<HTMLFormElement> = method => {
    return e => {
      e.preventDefault();
      e.stopPropagation();
      method({ body });
    }
  }
  const onSubmit = async (data: IFormData) => {
    // ignore submissions with no body
    if (!data.body || data.body.length < 1) {
      return;
    }
    onWillPost && onWillPost();
    setIsLoading(true);
    // remove unused images
    if (Array.isArray(imagesRef.current)) {
      const imagesToRemove = [];
      imagesRef.current.forEach(imageUrl => {
        if (!data.body.includes(imageUrl)) {
          imagesToRemove.push(imageUrl);
        }
      });
      if (imagesToRemove.length > 0) {
        await fetch('/api/images', {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(imagesToRemove)
        })
      }
    }
    // then post
    const newPost: IPostWithReplies = await fetchJson('POST', EApiEndpoints.POSTS, undefined, JSON.stringify(data), {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    });
    setIsLoading(false);
    setShowReplies(true);
    onPost && onPost(newPost);
  };
  if (isUserLoading) {
    return null;
  }
  if (error) {
    console.error(error)
    throw error;
  }
  return (
    <Card sx={{ overflow: 'visible' }}>
      <CardContent sx={{ position: 'relative' }}>
        <Fade
          in={isLoading}
          style={{
            transitionDelay: isLoading ? '800ms' : '0ms',
          }}
          unmountOnExit
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 3, top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.125)' }}>
            <CircularProgress />
          </Box>
        </Fade>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography gutterBottom variant="h5" component="div">
            Add Post
          </Typography>
          <RichText
            onChange={html => setBody(html)}
            clearField={isLoading}
            onImageUploaded={imageUrl =>
              Array.isArray(imagesRef.current)
                ? imagesRef.current.push(imageUrl)
                : imagesRef.current = [imageUrl]
            }
          />
        </form>
      </CardContent>
      <CardActions>
        <Toolbar sx={{ flexGrow: 1, paddingLeft: 1, paddingRight: 1 }} disableGutters>
          <Button
            disabled={isLoading}
            variant="contained"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onSubmit({ body });
            }}
          >
            Post
          </Button>
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
        <PostMasonry posts={replies || []} />
      </Collapse>
    </Card>
  )
};

export default AddPost;
