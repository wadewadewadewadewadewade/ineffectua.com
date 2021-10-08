import React, { useState } from 'react';
import { IPost } from '../../models/posts/post';
import RichText from '../RichText/RichText';
import fetchJson from '../../utils/fetcher';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';

interface IFormData {
  body: string;
}

interface IAddPost {
  onWillPost?: () => void
  onPost?: () => void
}

export const AddPost: React.FC<IAddPost> = ({
  onWillPost,
  onPost
}) => {
  const [body, setBody] = useState<string>();
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
    onPost && onPost();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Add Post
          </Typography>
          <RichText
            onChange={html => setBody(html)}
            clearField={isLoading}
          />
        </CardContent>
        <CardActions>
          <Button type="submit" variant="contained">submit</Button>
        </CardActions>
      </Card>
    </form>
  )
};

export default AddPost;
