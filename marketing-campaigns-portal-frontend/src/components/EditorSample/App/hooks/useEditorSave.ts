import { useState } from 'react';
import axios from 'axios';

interface EditorRef {
  exportDesign: () => Promise<object>;
  exportHtml: () => Promise<string>;
}

declare global {
  interface Window {
    editorRef: EditorRef | null;
  }
}

export const useEditorSave = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSave = async (): Promise<void> => {
    if (!window.editorRef) {
      alert('Editor is not ready yet');
      return;
    }

    setLoading(true);
    try {
      const design = await window.editorRef.exportDesign();
      const html = await window.editorRef.exportHtml();

      await axios.post('http://localhost:5000/api/emailDesign/save', {
        name: 'My Welcome Email',
        design,
        html,
      });

      alert('Design saved successfully ✅');
    } catch (error) {
      console.error('Failed to save design:', error);
      alert('Failed to save ❌');
    } finally {
      setLoading(false);
    }
  };

  return { handleSave, loading };
};
