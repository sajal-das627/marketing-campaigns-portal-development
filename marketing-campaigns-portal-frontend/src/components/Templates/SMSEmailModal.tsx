import 
// React,
 { useState } from 'react'
import ChooseTemplateModal from './ChooseTemplateModal'
import {useNavigate } from 'react-router-dom';
interface Props {
  templateId: string;
}

const CreateTemplate = () => {
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(true);
    const [selectedTemplateModal, setSelectedTemplateModal] = useState<"email" | "sms">("email");
   
    const handleSelect = (template: "email" | "sms") => {
      setSelectedTemplateModal(template);
    };
    const navigate = useNavigate();
  
    const handleConfirm = () => {
      console.log("Confirmed template:", selectedTemplateModal);
      if(selectedTemplateModal === "email"){
        navigate('/email-templates');
        // navigate('/build-template');
      }
      else if(selectedTemplateModal === "sms"){
        navigate('/build-sms');
      }
      else{
        console.log('Type Not Found');
      }
      setIsTemplateModalOpen(false);
    };
    console.log("template:", selectedTemplateModal);
  
    return <ChooseTemplateModal open={isTemplateModalOpen} onClose={()=>setIsTemplateModalOpen(false)}
      selectedTemplate={selectedTemplateModal}
      onSelect={handleSelect}
      onConfirm={handleConfirm}
      />
  }

export default CreateTemplate;