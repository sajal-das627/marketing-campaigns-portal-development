import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  open,
  onClose,
  title = 'Success',
  message = '"Young High-Spenders" Filter Saved Successfully',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="success-dialog-title"
      aria-describedby="success-dialog-description"
    >
      <DialogTitle id="success-dialog-title" sx={{ display: 'flex', alignItems: 'center' }}>
        <CheckCircleIcon  sx={{ marginRight: 1, color:"#0057D9", fontSize:"34px" }} />
        <Typography variant="h6" sx={{fontWeight:"semi-bold"}}>{title}</Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="success-dialog-description" sx={{color: '#A3AABC', fontSize:'12px'}}>
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
      <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onClose} variant="contained"  sx={{bgcolor:"#0057D9"}}>
          Ok
        </Button>        
      </DialogActions>
    </Dialog>
  );
};

export default SuccessModal;
