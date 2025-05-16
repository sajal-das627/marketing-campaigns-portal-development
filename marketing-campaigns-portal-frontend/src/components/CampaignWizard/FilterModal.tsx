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

const FilterModal: React.FC<FilterModalProps> = ({ open, onClose, name, description, tags, createdOn, audience, summary,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      
      <Box sx={{ bgcolor: '#0057D9', width: '100%', height: 35, display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ color: "white", ml: 2, mt: 0.5 }}>{name}&nbsp;Filter</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
      </Box>
      <DialogTitle id="filter-modal-title" sx={{ fontSize: '24px', fontWeight: 'semi-bold' }}>
        Filter Details
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "150px auto",
            gap: "8px",
            maxWidth: "500px",
          }}
        >
          <Typography sx={{ color: '#A3AABC' }}>Name -</Typography>
          <Typography>{name}</Typography>

          <Typography sx={{ color: '#A3AABC' }}>Description -</Typography>
          <Typography>{description}</Typography>

          <Typography sx={{ color: '#A3AABC' }}>Tags -</Typography>
          <Typography>{tags.toString().split(",").join(", ")}</Typography>

          <Typography sx={{ color: '#A3AABC' }}>Created On -</Typography>
          <Typography>{createdOn.split('T').join(' at ').slice(0, 23)}</Typography>
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 1, fontSize: '24px', fontWeight: 'semi-bold' }}>
          Filter Summary
        </Typography>
        <Box sx={{ mb: 2, bgcolor: "#DAE9FF", p: 0.5, fontSize: '14px' }}>
          <Typography sx={{ color: "#0057D9", }}>
            "The audience will include {summary}"
          </Typography>
        </Box>

        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "150px auto",
              gap: "8px",
              maxWidth: "500px",
            }}
          >
            <Typography variant="body1" sx={{ color: '#A3AABC' }}>
              Audience -&nbsp;
            </Typography>
            <Typography >
              {audience}
            </Typography>
          </Box>
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

export default FilterModal;