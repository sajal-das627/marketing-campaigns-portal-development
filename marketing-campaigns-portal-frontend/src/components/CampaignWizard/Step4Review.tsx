import React from 'react'
import { Types } from 'mongoose';
import { 
    Box,
    Typography,
    Grid2 as Grid,
    Card,
    CardContent,

 } from '@mui/material'
import { CampaignData } from 'types/campaign';

interface Step4ReviewProps {
    campaignData: CampaignData;
}

const Step4Review: React.FC<Step4ReviewProps> = ({ campaignData })=>{
  return (
    <Box>                 
          <Typography variant="h6" fontWeight={'500'} >Campaign Overview</Typography>
          <Typography sx={{color: "#626262", mb: 1, fontSize:'14px'}}>Review your campaign before launch.</Typography>                
            <Box>
                <Card sx={{borderRadius: 1, p: 2, mt: 2, boxShadow: 0, bgcolor:'#F8F9FA'}}>
                    <CardContent>
                    <Typography variant="h5" fontWeight={'500'} gutterBottom>Campaign Details</Typography>

                        <Grid container spacing={3}>
                            <Grid size={5}>
                                <Typography sx={{color:'#ABABAB'}}>Campaign Name</Typography>
                                <Typography>{campaignData.name}</Typography>
                            </Grid>
                            <Grid size={7}>
                                <Typography sx={{color:'#ABABAB'}}>Campaign Type</Typography>
                                <Typography>{campaignData.type} Campaign</Typography>
                            </Grid>

                            <Grid size={5}>
                                <Typography sx={{color:'#ABABAB'}}>Selected Audience</Typography>
                                <Typography>{String(campaignData.audience)}</Typography>
                            </Grid>
                            <Grid size={7}>
                                <Typography sx={{color:'#ABABAB'}}>Template</Typography>
                                <Typography> {String(campaignData.template)}</Typography>
                            </Grid>

                            <Grid size={5}>
                                <Typography sx={{color:'#ABABAB'}}>Schedule</Typography>
                                <Typography>{campaignData.schedule.frequency} at {String(campaignData.schedule.time)} starting from {String(campaignData.schedule.startDate).slice(0,15)}</Typography>
                            </Grid>
                            
                        </Grid>
                    </CardContent>
                </Card>
          </Box>
    </Box>
  )
}

export default Step4Review