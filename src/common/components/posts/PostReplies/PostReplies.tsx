import React from 'react';
import { IPostWithReplies } from '../../../types/IPost';

export const PostReplies: React.FC<Pick<IPostWithReplies, 'replies'>> = ({ replies }) => replies ? (
    <ul>
      {replies.map(reply => <li>{reply.body}</li>)}
    </ul>
  ) : null;

  export default PostReplies;