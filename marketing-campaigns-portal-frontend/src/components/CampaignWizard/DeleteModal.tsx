import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

interface DeleteModalProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  title?: string;
  message?: string;
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ open, handleClose, handleConfirm, title, message }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{display:"flex", fontWeight:"semi-bold"}}>
          <DeleteIcon sx={{ fontSize: '30px', color: 'white', bgcolor: '#F83738', borderRadius: '25px',p:0.7,  }} />&nbsp;
          {title || "Confirm Delete"}</DialogTitle>
      <DialogContent>
        <Typography>{message || "Are you sure you want to delete this item?"}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleConfirm} color="error" variant="contained">Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
