import React from 'react';
import { IPostWithReplies } from '../../../types/IPost';
import { Parser } from 'html-to-react';
import fetchJson from '../../../utils/fetcher';
import { UpdateResult } from 'mongodb';

export const Post: React.FC<{
  post: IPostWithReplies,
  onWillChange?: () => void,
  onChange?: () => void
}> = ({
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
  return (
  <div id={`post_${post._id}`}>
    <time>{post.created}</time>
    <div>
      {post.body && new Parser().parse(post.body)}
    </div>
    <button onClick={e => {
      e.preventDefault();
      e.stopPropagation();
      onDelete()
    }} type="button">delete</button>
  </div>
)
  };

export default Post;
