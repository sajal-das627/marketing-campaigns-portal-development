import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { useEditorSave } from './hooks/useEditorSave';

type EditorSaveButtonProps = ButtonProps;

export const EditorSaveButton: React.FC<EditorSaveButtonProps> = (props) => {
  const { handleSave, loading } = useEditorSave();
  console.log('EditorSaveButton', { loading });
  console.log('EditorSaveButton', window.editorRef);

  return (
    <Button onClick={handleSave} disabled={loading} {...props}>
      {loading ? 'Saving...' : 'Save Design'}
    </Button>
  );
};
