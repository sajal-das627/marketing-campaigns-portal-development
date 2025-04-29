import 
// React,
 { useState } from 'react'
import ChooseTemplateModal from './ChooseTemplateModal'
import { Container, Box, Typography } from '@mui/material'
import {useNavigate } from 'react-router-dom';

const CreateTemplate = () => {
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(true);
    const [selectedTemplate, setSelectedTemplate] = useState<"email" | "sms">("email");
    const handleSelect = (template: "email" | "sms") => {
      setSelectedTemplate(template);
    };
    const navigate = useNavigate();
  
    const handleConfirm = () => {
      console.log("Confirmed template:", selectedTemplate);
      if(selectedTemplate === "email"){
        navigate('/build-template');
      }
      else if(selectedTemplate === "sms"){
        navigate('/build-sms');
      }
      else{
        console.log('Type Not Found');
      }
      setIsTemplateModalOpen(false);
    };
    console.log("template:", selectedTemplate);
  return (
    <Container>
      <Box sx={{
            p: 3, bgcolor: '#F8F9FE', maxWidth: '100%', overflow: 'hidden',
            // '& *': { color: '#495057' }
          }}>
            
            <Box
              display="flex"
              flexDirection={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h4" component="h1" marginBottom={{ xs: 1 }} >
              Create Template
              </Typography>
              </Box>
              </Box>

    <ChooseTemplateModal open={isTemplateModalOpen} onClose={()=>setIsTemplateModalOpen(false)}
      selectedTemplate={selectedTemplate}
      onSelect={handleSelect}
      onConfirm={handleConfirm}
      />
    </Container>
  )
}

export default CreateTemplate;