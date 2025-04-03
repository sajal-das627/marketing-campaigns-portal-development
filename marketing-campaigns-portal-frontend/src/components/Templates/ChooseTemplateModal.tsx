import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid2 as Grid,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface TemplateModalProps {
  open: boolean;
  onClose: () => void;
  selectedTemplate: "email" | "sms";
  onSelect: (template: "email" | "sms") => void;
  onConfirm: () => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  open,
  onClose,
  selectedTemplate,
  onSelect,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="template-modal-title"
      sx={{
        "& .MuiPaper-root": {
          width: "450px",
          height: "350px", 
          borderRadius: "10px",
      
        },
      }}
    >
      <Box sx={{ bgcolor: '#0057D9', width:'100%', height: 35, display:'flex', justifyContent:'space-between'}}> 
        <Typography sx={{color: "white", ml:2, mt:0.5}}>Choose a Template  Type</Typography> 
          <IconButton onClick={onClose}>
            <CloseIcon sx={{color:"white"}} />
          </IconButton>
      </Box>
      <DialogTitle id="template-modal-title" sx={{ textAlign: "center" }}>
        {/* Select Template */}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} justifyContent="center">
          {/* Email Template Box */}
          <Grid size={{xs:6}} >
            <Box
              onClick={() => onSelect("email")}
              sx={{
                border:
                  selectedTemplate === "email"
                    ? "2px solid #0057D9"
                    : "2px solid #ECEEF6",
                borderRadius: "8px",
                transition: "border 0.3s",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "hidden",
                height: '200px',                
                alignContent: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box
                component="img"
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "80px",
                  objectFit: "contain",
                  mt: 5,
                }}
                src="/icons/email-template.png"
                alt="Email Template"
              />
              <Typography  align="center" sx={{ padding: 1, bgcolor: selectedTemplate === "email" ? "#0057D9": "#ECEEF6",
                 color: selectedTemplate === "email"?'white': '#6D6976',  width: '100%', mt: 0.5}}>
                Email Template
              </Typography>
            </Box>
          </Grid>
          {/* SMS Template Box */}
          <Grid size={{xs:6}} >
            <Box
              onClick={() => onSelect("sms")}
              sx={{
                border:
                  selectedTemplate === "sms"
                    ? "2px solid #0057D9"
                    : "2px solid #ECEEF6",
                borderRadius: "8px",
                transition: "border 0.3s",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                alignItems: 'center',
                height: '200px',
                alignContent: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box
                component="img"
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "80px",
                  objectFit: "contain",
                  mt: 5,
                }}
                src="/icons/sms-template.png"
                alt="SMS Template"
              />
              <Typography  align="center" sx={{ padding: 1, bgcolor: selectedTemplate === "sms" ? "#0057D9": "#ECEEF6",
                color: selectedTemplate === "sms"?'white': '#6D6976', width: '100%', mt: 0.5}}>
              SMS Template
              </Typography>
            </Box>
          </Grid>
        </Grid>
        </DialogContent>
        {/* Confirm Button */}
        <DialogActions>
          <Button variant="contained" onClick={onConfirm} sx={{bgcolor: "#EBEBEB", color:'#6D6976'}}>
            Back
          </Button>
          <Button variant="contained" onClick={onConfirm} sx={{bgcolor: "#0057D9", color: 'white'}}>
            Confirm Selection
          </Button>
        </DialogActions>
      
    </Dialog>
  );
};

export default TemplateModal;
