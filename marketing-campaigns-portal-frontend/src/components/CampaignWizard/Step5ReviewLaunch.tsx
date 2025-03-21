import React from "react";
import { Box, Button, Typography, List, ListItem } from "@mui/material";
import apiClient from "../../api/apiClient";
import useNotification from "../../hooks/useNotification";

const Step5ReviewLaunch = ({ data, onBack }: { data: any; onBack: () => void }) => {
    const { notifySuccess, notifyError } = useNotification();
  
    const handleLaunch = async () => {
      try {
        await apiClient.post("/campaigns", data);
        notifySuccess("🚀 Campaign Launched Successfully!");
      } catch (error) {
        notifyError("❌ Failed to launch the campaign.");
      }
    };
  
    return (
      <Box>
        <Typography variant="h6">✅ Review & Launch</Typography>
        <List>
          <ListItem>📋 Name: {data.name}</ListItem>
          <ListItem>🎯 Audience Filter: {data.audienceFilter}</ListItem>
          <ListItem>✉️ Template: {data.template}</ListItem>
          <ListItem>📅 Schedule: {data.schedule}</ListItem>
        </List>
  
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={onBack}>Back</Button>
          <Button variant="contained" color="success" sx={{ ml: 2 }} onClick={handleLaunch}>
            Launch Campaign
          </Button>
        </Box>
      </Box>
    );
  };
  
  export default Step5ReviewLaunch;