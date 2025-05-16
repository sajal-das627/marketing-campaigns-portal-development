import React from "react";
import { Dialog, Typography, IconButton, Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

type SMSPreviewProps = {
  open: boolean;
  handleClose: () => void;
  handleConfirm?: () => void;
  name?: string;
  subject?: string;
  message?: string;
  includeOptOut?: boolean;
};

const SMSPreview: React.FC<SMSPreviewProps> = ({ open, handleClose, handleConfirm, name, subject, message, includeOptOut }) => {

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Typography sx={{ color: 'white' }}>{name || '-'}</Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon sx={{ color: 'white' }} />
        </IconButton>
      </Box>

      <Box sx={{ minHeight: '350px', p: 2 }}>
        {message || '-'}<br />
        {includeOptOut ? '"Reply STOP to Unsubscribe"' : ''}
      </Box>
    </Dialog>
  );
};

export default SMSPreview;
