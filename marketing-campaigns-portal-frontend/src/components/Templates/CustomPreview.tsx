import React, { useEffect, useState } from 'react';
import { Reader } from '@usewaypoint/email-builder';
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type CustomPreviewProps = {
  doc?: any;
  html?: string;
  open?: boolean;
  handleClose?: () => void;
  rootBlockId?: string;
};

export default function CustomPreview({
  doc: initialDoc,
  open,
  html: initialHtml,
  handleClose,
  rootBlockId = 'root',
}: CustomPreviewProps) {
  const [doc, setDoc] = useState<any>(initialDoc);
  const [html, setHtml] = useState<any>(initialHtml);

  useEffect(() => {
    setDoc(initialDoc);
    setHtml(initialHtml);
  }, [initialDoc, initialHtml]);

  const closeModal = () => {
    if (handleClose) {
      handleClose();
    }
    setDoc(null); 
    setHtml(null); 
  };

  if (!doc || !doc[rootBlockId]) {
    return <Box>— No preview available —</Box>;
  }
  
  const dialogContent = (
    <Dialog
      open={!!open}
      onClose={closeModal}
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          width: '80vw',
          maxWidth: '500px',
          maxHeight: '100vh',
          borderRadius: '10px',
        },
      }}
    >
      <Box
        sx={{
          bgcolor: '#0057D9',
          width: '100%',
          height: 35,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Typography sx={{ color: 'white' }}>Template Preview</Typography>
        <IconButton onClick={closeModal}>
          <CloseIcon sx={{ color: 'white' }} />
        </IconButton>
      </Box>

      <DialogContent dividers>
      {doc && typeof doc === 'object' && doc[rootBlockId] ? (
        <Reader document={doc} rootBlockId={rootBlockId} />
      ) : (
        <Typography variant="body2" color="textSecondary">
          — Invalid document structure —
        </Typography>
      )}
        {/* important */}
        {/* <Box sx={{ width: '100%', maxHeight: '60vh', overflow: 'auto' }}>
          {html ? (
            <Box
              sx={{ width: '300px', height: '300px', overflow: 'none', p: 2, m: 2 }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <Reader document={doc} rootBlockId={rootBlockId} />
          )}
        </Box> */}
      </DialogContent>

      <DialogActions>
        <Button onClick={closeModal} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  return dialogContent;
}
