import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  ContentState,
  convertFromHTML,
  EditorState,
  convertToRaw,
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorProps } from 'react-draft-wysiwyg';
import { UPLOAD_FILE } from '../../graphql/mutations/singleUpload';
import { useApolloClient, useMutation } from '@apollo/client';

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false },
);

interface IRichText
  extends Pick<EditorProps, 'wrapperStyle' | 'editorStyle' | 'toolbarStyle'> {
  onChange: (html: string) => void;
  defaultValue?: string;
  clearField?: boolean;
  onImageUploaded: (url: string) => void;
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
  const [uploadImage] = useMutation<{ singleUpload: string }>(UPLOAD_FILE);
  /* const UploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('upload', file);
    const response = await fetch('/api/images', {
      method: 'POST',
      body: formData,
    });
    const url = await response.text();
    onImageUploaded(url);
    return url;
  }; */
  const apolloClient = useApolloClient();
  const translateDefaultValue = (v?: string) => {
    if (typeof v === 'string') {
      const blocksFromHTML = convertFromHTML(v);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      );
      return EditorState.createWithContent(state);
    }
    return undefined;
  };
  const [editorState, setEditorState] = useState<EditorState>();
  const clearEditorState = () =>
    setEditorState(
      es =>
        es &&
        EditorState.push(
          es,
          ContentState.createFromText(''),
          'change-block-data',
        ),
    );
  useEffect(() => clearField && clearEditorState(), [clearField]);
  useEffect(() => {
    setEditorState(translateDefaultValue(defaultValue || ''));
  }, [defaultValue]);
  const uploadImageCallBack = async (file: File) => {
    const imgData: string | false = await new Promise(resolve =>
      uploadImage({
        variables: { file },
        onCompleted: ({ singleUpload }) => {
          if (singleUpload.startsWith('http')) {
            onImageUploaded(singleUpload);
            resolve(singleUpload);
          } else {
            console.error(singleUpload);
            resolve(false);
          }
        },
      }).then(() => apolloClient.resetStore()),
    );
    if (imgData) {
      return {
        data: {
          link: imgData,
        },
      };
    }
  };
  return (
    <>
      <Editor
        wrapperStyle={wrapperStyle}
        editorStyle={editorStyle}
        toolbarStyle={toolbarStyle}
        editorState={editorState}
        onEditorStateChange={es => {
          setEditorState(es);
          onChange(draftToHtml(convertToRaw(es.getCurrentContent())));
        }}
        toolbar={{
          options: [
            'inline',
            'blockType',
            'fontSize',
            'fontFamily',
            'list',
            'textAlign',
            'colorPicker',
            'link',
            'embedded',
            'emoji',
            'image',
            'history',
          ],
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
            alt: { present: false, mandatory: false },
          },
        }}
      />
    </>
  );
};

export default RichText;
