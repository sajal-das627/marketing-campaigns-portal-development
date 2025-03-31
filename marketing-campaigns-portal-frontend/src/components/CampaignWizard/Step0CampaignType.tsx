

import React from 'react'
import { Grid2 as Grid, Card, CardActionArea, CardContent, Box, Typography, TextField,  } from "@mui/material";
import { CampaignData } from 'types/campaign';
import { styled } from '@mui/material/styles';

interface Step0CampaignTypeProps{
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  campaignData: CampaignData;
}
const SpacedBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const Step0CampaignType: React.FC<Step0CampaignTypeProps> = ({ handleChange, campaignData }) => {

  const isSelected = (selectVal: string) => campaignData.type === selectVal  ? '2px solid #007BFF' : '1px solid #ddd';
  return (
    
    <Box>
    <Typography variant="h6">Campaign Name</Typography>
    <SpacedBox>
      <TextField
        fullWidth
        name='name'
        variant="outlined"
        label="Enter Campaign Name"
        value={campaignData.name}
        onChange={handleChange}
        required
      />
    </SpacedBox>
    <Typography variant="h6">Select Campaign Type</Typography>
    <SpacedBox>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Card
            variant="outlined"
            sx={{ border: isSelected("Criteria Based") }}
            onClick={() => handleChange({ target: { name: "type", value: "Criteria Based" } } as any)}>
            <CardActionArea>
              <CardContent sx={{ display: 'flex' }}>
                <Box component="img" src="/icons/criteriaBased_Campaign.png" alt="Real Time Campaign Icon" sx={{ width: 50, height: 50, mr: { xs: 1, md: 2 }, flexShrink: 0 }} />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    Criteria-Based Campaign
                  </Typography>
                  <Typography variant="body2" color='#626262'>
                    Target specific audience segments based on defined criteria
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card
            variant="outlined"
            sx={{ border: isSelected("Real Time") }}
            onClick={() => handleChange({ target: { name: "type", value: "Real Time" } } as any)}>
            <CardActionArea>
              <CardContent sx={{ display: 'flex' }}>
                <Box component="img" src="/icons/realTime_Campaign.png" alt="Real Time Campaign Icon" sx={{ width: 50, height: 50, mr: { xs: 1, md: 2 }, flexShrink: 0 }} />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    Real-Time Triggered Campaign
                  </Typography>
                  <Typography variant="body2" color='#626262'>
                    Target specific audience segments based on real-time events
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card
            variant="outlined"
            sx={{ border: isSelected("Scheduled") }}
            onClick={() => handleChange({ target: { name: "type", value: "Scheduled" } } as any)}>
            <CardActionArea>
              <CardContent sx={{ display: 'flex' }}>
                <Box component="img" src="/icons/scheduled_Campaign.png" alt="Real Time Campaign Icon" sx={{ width: 50, height: 50, mr: { xs: 1, md: 2 }, flexShrink: 0 }} />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    Scheduled Campaign
                  </Typography>
                  <Typography variant="body2" color='#626262'>
                    Launch campaigns at specific dates and times
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </SpacedBox>
  </Box>
  )
}

export default Step0CampaignType