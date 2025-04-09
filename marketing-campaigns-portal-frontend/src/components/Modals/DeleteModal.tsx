import React, { useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon  from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CancelIcon from '@mui/icons-material/Cancel';

interface AllModalProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  title?: string;
  message?: string;
  btntxt?: string;
  icon?: DynamicIconProps;
  color?: string;
}

const iconMap = {
  delete: DeleteIcon,
  success: CheckCircleOutlineIcon,
  error: ErrorOutlineIcon,
  cancel: CancelIcon,
};

interface DynamicIconProps {
  type: 'delete' | 'success' | 'error' | 'cancel';
  // Optional
  sx?: object;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ type, sx = {} }) => {
  const IconComponent = iconMap[type];
    // const IconComponent = icon ? iconMap[icon.type] : null;
  const [clr, setClr] = React.useState("#F83738");
  useEffect(() => {
    switch (type) {
      case 'delete':
        setClr("#F83738");
        break;
      case 'success':
        setClr("#4CAF50");
        break;
      case 'error':
        setClr("#F44336");
        break;
      case 'cancel':
        setClr("#FF9800");
        break;
      default:
        setClr("#F83738");
    }
  },[type])
  // common style object
  const iconStyle = {
    fontSize: '30px',
    color: 'white',
    bgcolor: clr,
    borderRadius: '25px',
    p: 0.7,
    ...sx,
  };
  return <IconComponent sx={iconStyle} />;
};



const AllModal: React.FC<AllModalProps> = ({ open, handleClose, handleConfirm, title, message, btntxt, icon, color }) => {
  


  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{display:"flex", alignItems:'center',fontWeight:"semi-bold"}}>

      {/* <DeleteIcon sx={{ fontSize: '30px', color: 'white', bgcolor: '#F83738', borderRadius: '25px',p:0.7,  }} /> */}
          
          <DynamicIcon type={icon?.type || 'delete'}/>&nbsp;

          {title || "Confirm Delete"}</DialogTitle>
      <DialogContent>
        <Typography sx={{color: '#A3AABC', fontSize:'12px'}}>{message || "Are you sure you want to delete this item?"}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleConfirm} color={color as "inherit" | "error" | "primary" | "secondary" | "success" | "info" | "warning" || "error"} variant="contained">{btntxt || 'Delete'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AllModal;
