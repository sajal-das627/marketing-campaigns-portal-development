import React, { useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import apiClient from "../api/apiClient";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get("/campaigns").then((res) => setCampaigns(res.data));
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">📢 Campaigns</Typography>
      {campaigns.map((campaign) => (
        <Paper key={campaign._id} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6">{campaign.name}</Typography>
          <Typography>Type: {campaign.type}</Typography>
          <Typography>Status: {campaign.status}</Typography>
          <Button variant="contained" color="primary" sx={{ marginTop: 1 }}>
            View Details
          </Button>
        </Paper>
      ))}
    </Box>
  );
};

export default Campaigns;
