import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Divider,
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
}

const FilterModal: React.FC<FilterModalProps> = ({ open, onClose, 
  name, 
  description, tags, createdOn, audience 
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="filter-modal-title"
      sx={{borderRadius: "10px"}}
    >
      {/* Modal Header */}
      <Box sx={{ bgcolor: '#0057D9', width:'100%', height: 30, display:'flex', justifyContent:'space-between'}}> 
        <Typography sx={{color: "white", ml:2,}}>{name}&nbsp;Filter</Typography> 
        <IconButton onClick={onClose}>
                <CloseIcon sx={{color:"white"}} />
                </IconButton>
      </Box>
      <DialogTitle id="filter-modal-title" >
        
      </DialogTitle>

      {/* Modal Content */}
      <DialogContent>
        {/* Filter Details Section */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Filter Details
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            Name:&nbsp;{name}
          </Typography>
          <Typography variant="body1">
            Description:&nbsp;{description}
          </Typography>
          <Typography variant="body1">
            Tags:&nbsp;{tags}
          </Typography>
          <Typography variant="body1">
            Created On:&nbsp;{createdOn}
          </Typography>
        </Box>
        <Divider />

        {/* Filter Summary Section */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Filter Summary
        </Typography>
        <Box sx={{ mb: 2,  bgcolor:"#DAE9FF",p:0.5 }}>
        <Typography sx={{color: "#0057D9",}}>
  The audience will include people over 18 who either made a purchase
  over $100 or are located in Dallas.</Typography>
                 
        </Box>
         
        <Typography variant="body1">
            <strong>Audience:</strong>{audience}
          </Typography>
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
