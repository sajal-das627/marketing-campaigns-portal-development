import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  name: string;
  description: string;
  tags: string;
  createdOn: string;
  audience: number;
  summary: [string] | string | null;
}

const SaveFilterModal: React.FC<FilterModalProps> = ({
  open, onClose,
}) => {
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      aria-labelledby="filter-modal-title"
      sx={{
        borderRadius: "10px",
        "& .MuiPaper-root": {
          // width: '100%',
          // height: '100%',
        },
        "& .MuiDialog-paper": { width: "80vw", maxWidth: "none", height: "80vh", maxHeight: "none" },
      }}
    >
      {/* Modal Header */}
      <Box sx={{ bgcolor: '#0057D9', width: '100%', height: 35, display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ color: "white", ml: 2, mt: 0.5 }}>Save Filter</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
      </Box>
      
      <DialogTitle id="filter-modal-title" sx={{ fontSize: '24px', fontWeight: 'semi-bold' }}>
        Filter Details
      </DialogTitle>

      <DialogContent>
        <Typography variant="h6" sx={{ mt: 3, mb: 1, fontSize: '24px', fontWeight: 'semi-bold' }}>
          Filter Summary
        </Typography>
        <Box sx={{ mb: 2, bgcolor: "#DAE9FF", p: 0.5, fontSize: '14px' }}>
          <Typography sx={{ color: "#0057D9", }}>
            "The audience will include "
          </Typography>
        </Box>
      </DialogContent>

      {/* Modal Footer/Actions */}
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveFilterModal;