  import React, { useState, useRef } from 'react';
  import { Box, TextField, Button, Typography, Card } from '@mui/material';
  
  const SMSBuilder: React.FC = () => {
    const [template, setTemplate] = useState<string>('Hi {{name}}, ');
    const [recipientName, setRecipientName] = useState<string>('');
    const [preview, setPreview] = useState<string>('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
  
    const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTemplate(e.target.value);
    };
  
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRecipientName(e.target.value);
    };
  
    const insertNamePlaceholder = () => {
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = template.slice(0, start);
        const after = template.slice(end);
        const placeholder = '{{name}}';
        const newTemplate = before + placeholder + after;
        setTemplate(newTemplate);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
          textarea.focus();
        }, 0);
      }
    };
  
    const generatePreview = () => {
      const result = template.replace(/{{\s*name\s*}}/g, recipientName || 'Customer');
      setPreview(result);
    };
  
    return (
        <Box sx={{
              p: 3, bgcolor: '#F8F9FE', maxWidth: '100%', overflow: 'hidden',
              // '& *': { color: '#495057' }
            }}>
                      <Typography variant="h4" component="h1" marginBottom={{ xs: 1 }} >
                      SMS Builder</Typography>
        
        <Card >
      <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        
        <TextField
          label="Template"
          multiline
          minRows={4}
          value={template}
          onChange={handleTemplateChange}
          inputRef={textareaRef}
        />
        <Button variant="contained" onClick={insertNamePlaceholder}>
          Insert Name Placeholder
        </Button>
        <TextField
          label="Recipient Name"
          value={recipientName}
          onChange={handleNameChange}
        />
        <Button variant="contained" onClick={generatePreview}>
          Preview SMS
        </Button>
        {preview && (
          <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
            <Typography variant="subtitle1">Preview</Typography>
            <Typography>{preview}</Typography>
          </Box>
        )}
      </Box>
      </Card>
      </Box>
    );
  };
  
  export default SMSBuilder;
  