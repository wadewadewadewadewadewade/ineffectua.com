import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ContentState, convertFromHTML, EditorState, convertToRaw, EditorChangeType } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorProps } from 'react-draft-wysiwyg';

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

export const RichText: React.FC<{
  onChange: (html: string) => void;
  defaultValue?: string;
  clearField?: boolean
}> = ({
  onChange,
  defaultValue,
  clearField
}) => {
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
    EditorState.push(
      es,
      ContentState.createFromText(''),
      'change-block-data'
    )
  );
  useEffect(() => clearField && clearEditorState(), [clearField]);
  useEffect(() => {
    setEditorState(translateDefaultValue(defaultValue || ''));
  }, [defaultValue])
  return (
    <>
      <Editor
        editorState={editorState}
        onEditorStateChange={es => {
          setEditorState(es);
          onChange(draftToHtml(convertToRaw(es.getCurrentContent())))
        }}
      />
    </>
  )
}

export default RichText;
