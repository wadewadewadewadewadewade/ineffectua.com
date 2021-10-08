import React, { useState } from 'react';
import { IPost } from '../../models/posts/post';
import RichText from '../RichText/RichText';
import fetchJson from '../../utils/fetcher';

interface IFormData {
  body: string;
}

export const AddPost: React.FC<{
  onWillPost?: () => void
  onPost?: () => void
}> = ({
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
      <RichText onChange={html => setBody(html)} clearField={isLoading} />
      <button type="submit">submit</button>
    </form>
  )
};

export default AddPost;
