import React, { useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";

const Step4Scheduling= ({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) => {
  const [schedule, setSchedule] = useState("");

  return (
    <Box>
      <Typography variant="h6">📅 Set Campaign Schedule</Typography>
      <TextField
        label="Schedule Date & Time"
        type="datetime-local"
        value={schedule}
        onChange={(e) => setSchedule(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
        InputLabelProps={{ shrink: true }}
      />

      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button variant="contained" sx={{ ml: 2 }} onClick={() => onNext({ schedule })} disabled={!schedule}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Step4Scheduling;
