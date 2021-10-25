import React, { useContext, useRef, useState } from 'react';
import RichText from '../RichText/RichText';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PostMasonry from './PostMasonry';
import {
  Box,
  Button,
  Typography,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Toolbar,
  Fade,
  CircularProgress,
} from '@mui/material';
import { IPostWithReplies } from '../../types/IPost';
import ExpandMore from '../ExpandMore';
import AuthenticationContext from '../../context/AuthenticationContext';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_POST } from '../../graphql/mutations/addPost';
import { IPost } from '../../models/posts/post';
import { GET_POSTS } from '../../graphql/queries/posts';

interface IFormData {
  body: string;
}

interface IAddPost {
  addNewPostOnly?: boolean;
  replies?: IPostWithReplies[];
  inReplyTo?: IPostWithReplies['_id'];
  onWillPost?: () => void;
  onPost?: (newPost: IPostWithReplies) => void;
}

export const AddPost: React.FC<IAddPost> = props => {
  const {
    addNewPostOnly,
    inReplyTo,
    onWillPost,
    onPost,
    replies: passedReplies,
  } = props;
  const userContext = useContext(AuthenticationContext);
  const isUserLoading = userContext === true;
  const [body, setBody] = useState<string>();
  const [replies, setReplies] = useState(passedReplies || []);
  const [showReplies, setShowReplies] = useState(
    (passedReplies && passedReplies.length > 0) || !addNewPostOnly,
  );
  const [addPost, { loading: addPostLoading }] = useMutation<{
    addPost: IPost | string;
  }>(ADD_POST, {
    refetchQueries: [{ query: GET_POSTS, variables: { inReplyTo } }],
    onCompleted: ({ addPost }) => {
      if (!onPost && typeof addPost !== 'string') {
        setReplies(prevState => [addPost, ...prevState]);
      }
    },
  });
  console.log(
    { passedReplies, inReplyTo, replies },
    !!passedReplies || !inReplyTo,
  );
  const { loading: repliesLoading } = useQuery<{
    getPosts: IPost[] | undefined;
  }>(GET_POSTS, {
    variables: {
      inReplyTo,
    },
    skip: !!passedReplies || !inReplyTo,
    onCompleted: ({ getPosts }) => !passedReplies && setReplies(getPosts),
  });
  const loading = addPostLoading || repliesLoading;
  const imagesRef = useRef<string[]>([]);
  const handleSubmit: (
    method: (data: IFormData) => void,
  ) => React.FormEventHandler<HTMLFormElement> = method => {
    return e => {
      e.preventDefault();
      e.stopPropagation();
      method({ body });
    };
  };
  const onSubmit = async (data: IFormData) => {
    // ignore submissions with no body
    if (!data.body || data.body.length < 1) {
      return;
    }
    onWillPost && onWillPost();
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
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(imagesToRemove),
        });
      }
    }
    // then post
    addPost({
      variables: { ...data, ...(inReplyTo ? { inReplyTo } : {}) },
      onCompleted: ({ addPost: addPostResponse }) => {
        if (typeof addPostResponse !== 'string' && props.replies) {
          // if replies are passed in, update that list here because onPost won't update that
          onPost && onPost(addPostResponse);
          setShowReplies(true);
        }
      },
    });
  };
  if (isUserLoading) {
    return null;
  }
  return (
    <Card sx={{ overflow: 'visible', width: '100%' }}>
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
              zIndex: 93,
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography gutterBottom variant='h5' component='div'>
            Add Post
          </Typography>
          <RichText
            onChange={html => setBody(html)}
            clearField={loading}
            onImageUploaded={imageUrl =>
              Array.isArray(imagesRef.current)
                ? imagesRef.current.push(imageUrl)
                : (imagesRef.current = [imageUrl])
            }
          />
        </form>
      </CardContent>
      <CardActions>
        <Toolbar
          sx={{ flexGrow: 1, paddingLeft: 1, paddingRight: 1 }}
          disableGutters
        >
          <Button
            disabled={loading}
            variant='contained'
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onSubmit({ body });
            }}
          >
            Post
          </Button>
          <Box sx={{ display: 'flex', flexGrow: 1 }}></Box>
          {!addNewPostOnly && (
            <ExpandMore
              expand={showReplies}
              onClick={() => setShowReplies(prevState => !prevState)}
              aria-expanded={showReplies}
              aria-label='see replies'
            >
              <ExpandMoreIcon />
            </ExpandMore>
          )}
        </Toolbar>
      </CardActions>
      {!addNewPostOnly && (
        <Collapse
          in={showReplies}
          timeout='auto'
          sx={{ paddingLeft: 1, paddingRight: 1 }}
        >
          {showReplies && (
            <PostMasonry
              posts={replies || []}
              onDelete={_id => {
                setReplies(prevState =>
                  prevState.filter(post => post._id !== _id),
                );
              }}
            />
          )}
        </Collapse>
      )}
    </Card>
  );
};

export default AddPost;
