import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ContentState, convertFromHTML, EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorProps } from 'react-draft-wysiwyg';
import { makeStyles } from '@mui/styles';

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

export const richTextStyles = makeStyles({
  images: {
    'img': {
      maxWidth: '100%'
    }
  }
})
interface IRichText extends Pick<EditorProps, 'wrapperStyle' | 'editorStyle' | 'toolbarStyle'> {
  onChange: (html: string) => void;
  defaultValue?: string;
  clearField?: boolean;
  onImageUploaded: (url: string) => void
}

export const RichText: React.FC<IRichText> = ({
  wrapperStyle,
  editorStyle,
  toolbarStyle,
  onChange,
  defaultValue,
  clearField,
  onImageUploaded,
}) => {
  const UploadImage = async (file: File): Promise<string> => {
    const formData  = new FormData();
    formData.append('upload', file)
    const response = await fetch('/api/images', {
      method: 'POST',
      body: formData
    });
    const url = await response.text();
    onImageUploaded(url);
    return url;
  }

  const translateDefaultValue = (v?: string) => {
    if (typeof v === 'string') {
      const blocksFromHTML = convertFromHTML(v);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      return EditorState.createWithContent(state);
    }
    return undefined;
  };
  const [editorState, setEditorState] = useState<EditorState>();
  const clearEditorState = () => setEditorState(es =>
    es && EditorState.push(
      es,
      ContentState.createFromText(''),
      'change-block-data'
    )
  );
  useEffect(() => clearField && clearEditorState(), [clearField]);
  useEffect(() => {
    setEditorState(translateDefaultValue(defaultValue || ''));
  }, [defaultValue]);
  const uploadImageCallBack = async (file: File) => {
    const imgData = await UploadImage(file);
    return Promise.resolve({ data: { 
      link: imgData
    }});
  }
  const classes = richTextStyles();
  return (
    <div className={classes.images}>
      <Editor
        wrapperStyle={wrapperStyle}
        editorStyle={editorStyle}
        toolbarStyle={toolbarStyle}
        editorState={editorState}
        onEditorStateChange={es => {
          setEditorState(es);
          onChange(draftToHtml(convertToRaw(es.getCurrentContent())))
        }}
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'history'],
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
          image: { 
            urlEnabled: true,
            uploadEnabled: true,
            uploadCallback: uploadImageCallBack, 
            previewImage: true,
            alt: { present: false, mandatory: false } 
          },
        }}
      />
    </div>
  )
}

export default RichText;
