import React, {
  // useState, 
  useEffect} from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Types } from "mongoose";
import {
  IconButton,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Button,
  // Paper,
  Container,
  Grid2 as Grid,
} from "@mui/material";
import { CampaignData, Template } from '../../types/campaign';
interface Step2TemplatesProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  campaignData: CampaignData;
  templateData: {name: string; type: string};
  setTemplateData:React.Dispatch<React.SetStateAction<{name: string; type: string}>>;
}
// Dummy template data with required properties
const templates: Template[] = [
  {
    id: new Types.ObjectId("65f8e3c5a9b7d1a8f4e12348"),
    type: "Email",
    created_at: "2021-10-01",
    title: "Welcome Email Template",
    description: "A warm welcome email template.",
    image: "/images/welcome-template.png",
  },
  {
    id: new Types.ObjectId("65f8e3c5a9b7d1a8f4e12349"),
    type: "Email",
    created_at: "2021-10-01",
    title: "AI Promotional Template",
    description: "An AI-powered marketing email.",
    image: "/images/ai-promotional-template.png",
  },
  {
    id: new Types.ObjectId("65f8e3c5a9b7d1a8f4e1234a"),
    type: "Email",
    created_at: "2021-10-01",
    title: "Happy Birthday Template",
    description: "A birthday email template.",
    image: "/images/happy-birthday-template.png",
  },
  {
    id: new Types.ObjectId("65f8e3c5a9b7d1a8f4e1234b"),
    type: "SMS",
    created_at: "2021-10-01",
    title: "Order Confirmation SMS",
    description: "A confirmation SMS template.",
    image: "/images/happy-birthday-template.png",
  },
  {
    id: new Types.ObjectId("65f8e3c5a9b7d1a8f4e1234c"),
    type: "SMS",
    created_at: "2021-10-01",
    title: "Order Confirmation SMS",
    description: "A confirmation SMS template.",
    image: "/images/welcome-template.png",
  },
  {
    id: new Types.ObjectId("65f8e3c5a9b7d1a8f4e1234d"),
    type: "Push Notifications",
    created_at: "2021-10-01",
    title: "AI Push Notification Template",
    description: "An AI-powered marketing email.",
    image: "/images/welcome-template.png",
  },
];



const Step2Templates: React.FC<Step2TemplatesProps> = ({ handleChange, campaignData, templateData, setTemplateData }) => {

  // Filter templates based on the selected type
  const filteredTemplates = templates.filter((template) => template.type === templateData.type);

  const isSelected = (selectVal: string | Types.ObjectId) => {
    return campaignData.template === selectVal ? '2px solid #007BFF' : '1px solid #ddd';
  };

  useEffect(() => {
    if (campaignData.template) {
      const selectedAudience = templates.find(
        (template) => template.id?.toString() === campaignData.template?.toString()
      );  
      if (selectedAudience) {
        setTemplateData((prev) => {
          if (prev.name === selectedAudience.title && prev.type === selectedAudience.type) {
            return prev;
          }
          return {
            name: selectedAudience.title,
            type: selectedAudience.type,
          };
        });
      } else {
        console.warn("No matching template found for campaignData.template");
      }
    }
  }, [campaignData.template]);

  
  return (
    <Box sx={{ boxSizing: 'border-box' }}>
      <Box
        display="flex"
        sx={{
          justifyContent: { md: "space-between", xs: "flex-start" },
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", sm: "flex-start", md: "center" }
        }} mt={2} mb={2} >
        <Box>
          <Typography variant="h6" >Select  Template</Typography>
          <Typography sx={{ color: "#626262" }}>Choose from saved templates or create new template.</Typography>
        </Box>
        <Button variant="contained"
                  sx={{ bgcolor: '#0057D9', color: '#fff', fontSize: { xs: '12px', sm: '14px' }, p: 1, mt:{xs:1, md:0}, ":hover": { bgcolor: '#2068d5' } }}> 
                  +&nbsp;Create&nbsp;New&nbsp;Template</Button>
            </Box>
      <Typography variant="h6">Choose Template</Typography>

      <Container maxWidth="md" sx={{ p: 2 }}>
        {/* Notification Type Selector */}
        <Grid container spacing={2} border={2} borderColor="#ECEEF6" sx={{ border: '2px solid #ECEEF6', borderRadius: 1, p: 1, }}>
          <Grid size={{ xs: 12, md: 3 }} sx={{ borderRight: { xs: 'none', md: '2px solid #ECEEF6' }, borderColor: "#ECEEF6", pr: 2 }}>
            <Typography sx={{ borderBottom: '2px solid #ECEEF6', mb: 1, p: 1 }}>TYPE</Typography>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <RadioGroup

                value={templateData.type}
                onChange={(e) => setTemplateData((prev) => ({
                  ...prev, type: e.target.value as "Email" | "SMS" | "Push Notifications",
                })
                )}
              >
                <FormControlLabel value="Email" control={<Radio />} label="Email" />
                <FormControlLabel value="SMS" control={<Radio />} label="SMS" />
                <FormControlLabel value="Push Notifications" control={<Radio />} label="Push Notifications" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            {/* Display only filtered templates */}
            <Typography sx={{ borderBottom: '2px solid #ECEEF6', mb: 1.5, p: 1 }}>TEMPLATE</Typography>
            {filteredTemplates.map((template) => (
              <Card key={template.id.toString()}
                onClick={() => {
                  handleChange({ target: { name: "template", value: template.id.toString() } } as any);
                  setTemplateData({name: template.title, type: template.type})
                }}

                sx={{
                  border: isSelected(template.id.toString()),
                  display: "flex", mb: 2, p: 1, bgcolor: '#FAF9F9', shadow: 0, borderRadius: 1,
                  boxShadow: 'none'
                }}>
                <CardMedia
                  component="img"
                  sx={{ width: { xs: 80, sm: 120 }, height: { xs: 80, sm: 120 }, color: '#626262', objectFit: 'cover', flexShrink: '0' }}
                  image={template.image}
                  alt={template.title}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: { sx: 'none', md: 'center' }, alignItems: { sx: 'none', md: 'center' } }}>
                    <Typography variant="h6" sx={{ fontSize: { xs: '14px', sm: '15px', md: '18px' } }} >{template.title}&nbsp; </Typography>
                    <Typography component="span" sx={{ fontSize: { xs: '10px', sm: '12px', md: '12px', lg: '14px' }, color: '#ABABAB' }}>Created on {template.created_at}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "#626262" }}>{template.description}</Typography>

                  <Typography sx={{ alignItems: "baseline", color: "#495057", fontSize: { xs: '12px', sm: '14px' }, }}>
                    <IconButton  onClick={(e) => {
                        e.stopPropagation();  
                      
                      }} ><VisibilityIcon /></IconButton>View Template</Typography>

                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Step2Templates;
