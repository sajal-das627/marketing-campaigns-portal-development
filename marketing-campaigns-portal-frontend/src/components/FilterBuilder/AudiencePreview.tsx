import 
// React,
 { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const AudiencePreview = ({ filters }: { filters: any[] }) => {
  const [audienceCount, setAudienceCount] = useState(0);

  useEffect(() => {
    const baseCount = 5000; 
    const adjustedCount = Math.max(100, baseCount - filters.length * 500); 
    setAudienceCount(adjustedCount);
  }, [filters]);

  return (
    <Box sx={{ marginTop: 4, padding: 2, backgroundColor: "#f0f4c3" }}>
      <Typography variant="h6">👥 Real-Time Audience Preview</Typography>
      <Typography variant="body1">Estimated Audience Size: {audienceCount} people</Typography>
    </Box>
  );
};

export default AudiencePreview;
