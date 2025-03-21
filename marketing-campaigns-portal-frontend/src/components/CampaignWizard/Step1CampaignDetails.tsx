import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import useNotification from "../../hooks/useNotification";

const Step1CampaignDetails = ({ onNext }: { onNext: (data: any) => void }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const { notifyError } = useNotification();

  const handleNext = () => {
    if (name.trim() === "") {
      setError(true);
      notifyError("Campaign name is required!");
      return;
    }
    onNext({ name });
  };

  return (
    <Box>
      <Typography variant="h6">📋 Enter Campaign Details</Typography>
      <TextField
        label="Campaign Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        error={error}
        helperText={error ? "Campaign name cannot be empty" : ""}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleNext}>
        Next
      </Button>
    </Box>
  );
};

export default Step1CampaignDetails;
