import React, { useEffect, useState } from 'react';
import { Reader } from '@usewaypoint/email-builder';
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


// Assuming this is your reader component


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
    setDoc(null); // Unset the values here
    setHtml(null); // Also unset html if needed
  };

  // if (!open) return null; // Don't render if the modal isn't open

  if (!doc || !doc[rootBlockId]) {
    return <Box>— No preview available —</Box>;
  }
  

  // Common Dialog setup
  const dialogContent = (
    <Dialog
      open={!!open}
      onClose={closeModal}
      fullWidth
      // maxWidth="sm"
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

  // 2) Otherwise, if you only have HTML, just dangerouslySetInnerHTML
  // if (html) {
  //   return (
  //     <>
  //     <Box
  //       sx={{ width: '300px', height: '300px', overflow: 'none', p: 2, m:2 }}
  //       dangerouslySetInnerHTML={{ __html: html }}
  //     />     
  //     </>
      
  //   );
  // }
  
  // 3) Nothing to show
  // return <Box>— No preview available —</Box>;
//}
 