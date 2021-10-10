import React from 'react';
import { IPostWithReplies } from '../../../types/IPost';
import { Parser } from 'html-to-react';
import fetchJson from '../../../utils/fetcher';
import { UpdateResult } from 'mongodb';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';

export interface IPostProps {
  post: IPostWithReplies,
  onWillChange?: () => void,
  onChange?: () => void
}

export const Post: React.FC<IPostProps> = ({
  post,
  onWillChange,
  onChange
}) => {
  const onDelete = async () => {
    onWillChange && onWillChange();
    const result: UpdateResult = await fetchJson(`/api/posts/${post._id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    });
    onChange && onChange()
  };
  return post.body ? (
    <Card id={`post_${post._id}`}>
      <CardContent>
        <Typography color="text.secondary" gutterBottom component="time">
          {post.created}
        </Typography>
        <Typography gutterBottom component="div">
          {new Parser().parse(post.body)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onDelete()
          }}
          type="button"
        >
          delete
        </Button>
      </CardActions>
    </Card>
  ) : null
};

export default Post;
