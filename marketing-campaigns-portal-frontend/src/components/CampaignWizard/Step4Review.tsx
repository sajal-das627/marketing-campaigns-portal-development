import React from 'react'
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
    audienceName: String;
    templateData: { name: String; type: String };
}

const Step4Review: React.FC<Step4ReviewProps> = ({ campaignData, audienceName, templateData }) => {
    return (
        <Box>
            <Typography variant="h6" fontWeight={'500'} >Campaign Overview</Typography>
            <Typography sx={{ color: "#626262", mb: 1, fontSize: '14px' }}>Review your campaign before launch.</Typography>
            <Box>
                <Card sx={{ borderRadius: 1, p: 2, mt: 2, boxShadow: 0, bgcolor: '#F8F9FA' }}>
                    <CardContent>
                        <Typography variant="h5" fontWeight={'500'} gutterBottom>Campaign Details</Typography>

                        <Grid container spacing={3}>
                            <Grid size={5}>
                                <Typography sx={{ color: '#ABABAB' }}>Campaign Name</Typography>
                                <Typography>{campaignData.name}</Typography>
                            </Grid>
                            <Grid size={7}>
                                <Typography sx={{ color: '#ABABAB' }}>Campaign Type</Typography>
                                <Typography>{campaignData.type} Campaign</Typography>
                            </Grid>
                            <Grid size={5}>
                                <Typography sx={{ color: '#ABABAB' }}>Selected Audience</Typography>
                                <Typography>{audienceName}</Typography>
                            </Grid>
                            <Grid size={7}>
                                <Typography sx={{ color: '#ABABAB' }}>Template</Typography>
                                <Typography> {templateData.type + " - " + templateData.name}</Typography>
                            </Grid>
                            {campaignData.schedule && campaignData.type !== "Real Time" && (
                                <Grid size={5}>
                                    <Typography sx={{ color: '#ABABAB' }}>Schedule</Typography>
                                    <Typography>{campaignData.schedule?.frequency} At &nbsp;
                                        {String(campaignData.schedule?.time)}, starts on {String(campaignData.schedule?.startDate).slice(0, 10)}.<br />

                                    </Typography>
                                    {campaignData.schedule?.endDate ? (<Typography> Ends on {String(campaignData.schedule?.endDate).slice(0, 10)}</Typography>) : <></>
                                    }
                                </Grid>
                            )}

                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    )
}

export default Step4Review