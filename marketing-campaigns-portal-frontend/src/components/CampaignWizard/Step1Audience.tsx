import React, {useEffect, useState} from "react";
import { Grid2 as Grid, Card, IconButton, CardActionArea, CardContent, Box, Typography, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Types } from "mongoose";
import { Audience, CampaignData } from "../../types/campaign";
import FilterModal from './FilterModal'

import { fetchFiltersData } from "../../redux/slices/filterSlice"
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/hooks"

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
  campaignData: CampaignData;
  setAudienceName: React.Dispatch<React.SetStateAction<string>>;
}

const AudienceSelector: React.FC<AudienceSelectorProps> = ({ handleChange, campaignData, setAudienceName}) => {

  const [isfilterModalOpen, setIsfilterModalOpen] = useState<boolean>(false);
  useEffect(()=>{
    if(campaignData.audience){
      const selectedAudience = audienceOptions.find(
        (audience)=> audience.id?.toString() === campaignData.audience?.toString()
      );
      if (selectedAudience) {
        setAudienceName(selectedAudience.name);
      }
    }
  })

  const dispatch = useAppDispatch();
  const filterState = useSelector((state: RootState) => state.filter)
  useEffect(()=>{
    dispatch(fetchFiltersData("67ea7895b30eff640929f379"));
    console.log()
  }, [dispatch]);
  
  const handleClose = () =>{
    setIsfilterModalOpen(false)
  }

  const isSelected = (selectVal: number | string | Types.ObjectId) => {
      return campaignData.audience === selectVal ? '2px solid #007BFF' : '1px solid #ddd';
    };

  const handleFilterModal=()=>{
    setIsfilterModalOpen(true);
  }

  return (
    
    <Box sx={{ boxSizing: 'border-box' }}>
      {JSON.stringify(filterState.data, null, 2)}
        <Box display="flex"
        sx={{
            justifyContent: { md: "space-between", xs: "flex-start" },
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", sm: "flex-start", md: "center" }
        }} mt={2} mb={2}>
        <Box>
            <Typography variant="h6">Select Audience Filter</Typography>
            <Typography sx={{ color: "#626262", }}>Choose from saved filters or create new filter.</Typography>
        </Box>
        <Button variant="contained" sx={{ bgcolor: '#0057D9', color: '#fff', fontSize: { xs: '12px', sm: '14px' }, p: 1, ":hover": { bgcolor: '#2068d5' } }}> +&nbsp;Create&nbsp;New&nbsp;Filter  </Button>
        </Box>

    <Grid container spacing={2}>
      {audienceOptions.map((audience) => (
        <Grid size={{ xs: 12 }} key={audience.id?.toString()}>
          <Card
            variant="outlined"
            sx={{ border: isSelected(audience.id.toString()) }}
            onClick={() =>{
              handleChange({
                target: { name: "audience", value: audience.id?.toString() },
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
                  <IconButton 
                  onClick={(e) => {
                    e.stopPropagation();  
                    handleFilterModal();
                  }} ><VisibilityIcon />
                  </IconButton>
                    
                  <span>View</span>
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
    {filterState.data && (
  <FilterModal 
    open={isfilterModalOpen} 
    onClose={handleClose}
    name={filterState.data.name ?? ""} 
    description={filterState.data.description ?? ""} 
    tags={filterState.data.tags?? ""}  // Ensure it's an array if needed
    createdOn={filterState.data.createdOn ?? ""} 
    audience={filterState.data.audienceCount ?? 0}  
  />
)}
  

    </Box>
  );
};

export default AudienceSelector;
