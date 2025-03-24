import React, {useState} from "react";
import { Grid2 as Grid, Card, CardActionArea, CardContent, Box, Typography, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Types } from "mongoose";
import { Audience } from "../../types/campaign";
// Define the type for our audience demo data

// Demo data array with multiple audiences
const audienceOptions: Audience[] = [
  {
    id: new Types.ObjectId("65f8e3c5a9b7d1a8f4e12345"),
    name: "High Value Customers",
    description: "Target specific audience segments based on defined criteria",
    icon: "/icons/criteriaBased_Campaign.png",
  },
  {
    id: new Types.ObjectId("65f8e3c5a9b7d1a8f4e12346"),
    name: "Low Engagement Users",
    description: "Reach out to users with lower engagement for reactivation",
    icon: "/icons/realTime_Campaign.png",
  },
  {
    id: new Types.ObjectId("65f8e3c5a9b7d1a8f4e12347"),
    name: "New Sign-ups",
    description: "Engage newly registered users with a welcome campaign",
    icon: "/icons/scheduled_Campaign.png",
  },
];

interface AudienceSelectorProps {
  handleChange: (event: any) => void;
//   isSelected: (audienceName: string) => string;
}

const AudienceSelector: React.FC<AudienceSelectorProps> = ({ handleChange }) => {
    const [audienceName, setAudienceName] = useState('');

    //************use another state to display audience and 
const isSelected = (selectVal: string) =>  audienceName === selectVal ? '2px solid #007BFF' : '1px solid #ddd';

  return (
    
    <Box sx={{ boxSizing: 'border-box' }}>
        <Box display="flex"
        sx={{
            justifyContent: { md: "space-between", xs: "flex-start" },
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", sm: "flex-start", md: "center" }
        }}
        mt={2}
        mb={2}>
        <Box>
            <Typography variant="h6">Select Audience Filter</Typography>
            <Typography sx={{ color: "#626262", }}>Choose from saved filters or create new filter.</Typography>
        </Box>
        <Button variant="contained" sx={{ bgcolor: '#0057D9', color: '#fff', fontSize: { xs: '12px', sm: '14px' }, p: 1, ":hover": { bgcolor: '#2068d5' } }}> +&nbsp;Create&nbsp;Campaign  </Button>
        </Box>

    <Grid container spacing={2}>
      {audienceOptions.map((audience) => (
        <Grid size={{ xs: 12 }} key={audience.id.toString()}>
          <Card
            variant="outlined"
            sx={{ border: isSelected(audience.name) }}
            onClick={() =>{
              handleChange({
                target: { name: "audience", value: audience.id },
              } as any);
              setAudienceName(audience.name);   
            }}
          >
            <CardActionArea>
              <CardContent sx={{ display: "flex" }}>
                <Box
                  component="img"
                  src={audience.icon}
                  alt={`${audience.name} Icon`}
                  sx={{ width: 50, height: 50, mr: { xs: 1, md: 2 }, flexShrink: 0 }}
                />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {audience.name}
                  </Typography>
                  <Typography variant="body2" color="#626262">
                    {audience.description}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "auto",
                    color: "#495057",
                    fontSize: "14px",
                    borderLeft: "2px solid #ECEEF6",
                    paddingLeft: "8px",
                  }}
                >
                    <VisibilityIcon />
                  <span>View</span>
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>

    </Box>
  );
};

export default AudienceSelector;
