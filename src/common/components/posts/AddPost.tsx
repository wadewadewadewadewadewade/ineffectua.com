import React, { useState } from 'react';
import { IPost } from '../../models/posts/post';
import RichText from '../RichText/RichText';
import fetchJson from '../../utils/fetcher';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PostMasonry from './PostMasonry';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { Button, Typography, Card, CardActions, CardContent, Collapse, IconButtonProps, Badge } from '@mui/material';
import styles from './AddPost.module.scss';
import { IPostWithReplies } from '../../types/IPost';

const ExpandMore = styled((props: { expand: boolean } & IconButtonProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface IFormData {
  body: string;
}

interface IAddPost {
  replies?: IPostWithReplies[]
  onWillPost?: () => void
  onPost?: () => void
}

export const AddPost: React.FC<IAddPost> = ({
  replies,
  onWillPost,
  onPost
}) => {
  const [body, setBody] = useState<string>();
  const [showReplies, setShowReplies] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSubmit: (method: (data: IFormData) => void) => React.FormEventHandler<HTMLFormElement> = method => {
    return e => {
      e.preventDefault();
      e.stopPropagation();
      method({ body });
    }
  }
  const onSubmit = async (data: IFormData) => {
    const updatedData: IPost = {
      ...data,
      created: new Date(Date.now()).toLocaleString('en-US')
    }
    onWillPost && onWillPost();
    setIsLoading(true);
    const newPost = await fetchJson('/api/posts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    });
    setIsLoading(false);
    setShowReplies(true);
    onPost && onPost();
  };
  return (
    <Card>
      <CardContent>
        <div className={styles.screenContainer}>
          <div className={styles.screen} style={{ display: isLoading ? 'block' : 'none'}}></div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography gutterBottom variant="h5" component="div">
              Add Post
            </Typography>
            <RichText
              onChange={html => setBody(html)}
              clearField={isLoading}
            />
          </form>
        </div>
      </CardContent>
      <CardActions>
        <Button onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onSubmit({ body });
        }}>
          Post
        </Button>
        <Badge badgeContent={(replies || []).length} color="primary">
          <ExpandMore
            expand={showReplies}
            onClick={() => setShowReplies(prevState => !prevState)}
            aria-expanded={showReplies}
            aria-label="see replies"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </Badge>
      </CardActions>
      <Collapse in={showReplies} timeout="auto" sx={{ paddingLeft: 1, paddingRight: 1 }}>
        <PostMasonry posts={replies || []} />
      </Collapse>
    </Card>
  )
};

export default AddPost;
