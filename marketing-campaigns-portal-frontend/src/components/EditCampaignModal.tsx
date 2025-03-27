import React, { useState, useEffect } from "react";
import { Modal, TextField, Button, MenuItem, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateCampaign } from "../redux/slices/campaignSlice";
import { useAppDispatch } from "../redux/hooks"; // ✅ Correct import
import { CampaignData as Campaign } from "types/campaign";



// ✅ Define Props Type Interface
interface EditCampaignModalProps {
    open: boolean;
    handleClose: () => void;
    campaign: Campaign | null;
  }

const EditCampaignModal: React.FC<EditCampaignModalProps> = ({ open, handleClose, campaign }) => {
    const dispatch = useAppDispatch(); // ✅ Ensures correct types
  
  // ✅ Ensure initial state handles null
  const [formData, setFormData] = useState({
    name: campaign?.name || "",
    type:  "Criteria Based",
    status: campaign?.status || "Active",
  });

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        type: campaign.type,
        status: campaign.status,
      });
    }
  }, [campaign]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (campaign) {
      dispatch(updateCampaign({ campaignId: campaign._id, updatedData: formData })).unwrap(); // ✅ Ensures proper type
      handleClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ p: 3, bgcolor: "white", width: "50%", mx: "auto", mt: "10%" }}>
        <TextField
          name="name"
          label="Campaign Name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          select
          name="type"
          label="Type"
          value={formData.type}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
        >
          <MenuItem value="Criteria-Based">Criteria Based</MenuItem>
          <MenuItem value="Real-Time Triggered">Real Time</MenuItem>
          <MenuItem value="Scheduled">Scheduled</MenuItem>
        </TextField>
        <TextField
          select
          name="status"
          label="Status"
          value={formData.status}
          onChange={handleChange}
          fullWidth
          sx={{ mt: 2 }}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Paused">Paused</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>
        <Button sx={{ mt: 2 }} variant="contained" onClick={handleSubmit}>
          Update
        </Button>
      </Box>
    </Modal>
  );
};

export default EditCampaignModal;
