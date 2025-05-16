import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Box, Card, Typography } from "@mui/material";

const AudiencePreview = () => {
  const { estimatedAudience, loading } = useSelector((state: RootState) => state.filter);

  return (
    <Card sx={{ p: 2, width: 300 }}>
      <Typography variant="h6">Filter Summary</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, color: "#A3AABC" }}>
        Preview your audience
      </Typography>
      <Typography variant="body1" sx={{ mb: 0, fontWeight: 600 }}>
        Estimated Audience
      </Typography>
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <Typography variant="h4" sx={{ fontWeight: 600, marginRight: "4px" }}>
          {loading ? "..." : estimatedAudience}
        </Typography>
        <Typography sx={{ color: "#A3AABC" }}>people</Typography>
      </Box>
    </Card>
  );
};

export default AudiencePreview;
