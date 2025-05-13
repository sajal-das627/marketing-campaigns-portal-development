import React, { useState } from 'react';

import { Stack, useTheme } from '@mui/material';
// import { Box } from '@mui/material';
import { useInspectorDrawerOpen, useSamplesDrawerOpen } from '../documents/editor/EditorContext';

import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from './InspectorDrawer';
import
 SamplesDrawer
//  { SAMPLES_DRAWER_WIDTH } 
 from './SamplesDrawer';
import TemplatePanel from './TemplatePanel';
// import BlocksDrawer from './BlockDrawer/BlockDrawer';
import EditTemplateMain from './BlockDrawer/EditTemplateMain'
import { Template } from 'types/template';
const SAMPLES_DRAWER_WIDTH = 240;

function useDrawerTransition(cssProperty: 'margin-left' | 'margin-right', open: boolean) {
  const { transitions } = useTheme();
  return transitions.create(cssProperty, {
    easing: !open ? transitions.easing.sharp : transitions.easing.easeOut,
    duration: !open ? transitions.duration.leavingScreen : transitions.duration.enteringScreen,
  });
}

interface SamplateDrawerProps {
  template?: Template;
  campaigns?: string[];
}

interface TemplateEditorProps {
  template?: Template;
}

export default function App({template}: TemplateEditorProps) {
  const [open, setOpen] = useState<Boolean>(true);
  const inspectorDrawerOpen = useInspectorDrawerOpen();
  const samplesDrawerOpen = useSamplesDrawerOpen();
  // const [template, setTemplate] = useState<Template>();
  const [templateDetails, setTemplateDetails] = useState<Template>({
      _id: template?._id || '',
      name: template?.name || '',
      subject: template?.subject || '',
      type: template?.type || 'Email',
      category: template?.category || 'Promotional',
      tags: template?.tags || [],
      senderId: template?.senderId || '',
      campaign: template?.campaign || '',
      includeOptOut: template?.includeOptOut ?? false,
      content: { message: template?.content.message || '' },
      layout: template?.layout || 'Custom',
      createdAt: template?.createdAt || '',
      lastModified: template?.lastModified || '',
      favorite: template?.favorite ?? false,
      isDeleted: template?.isDeleted ?? false,
      version: template?.version ?? 1,
    });
  
  const marginLeftTransition = useDrawerTransition('margin-left', samplesDrawerOpen);
  const marginRightTransition = useDrawerTransition('margin-right', inspectorDrawerOpen);
  const handleClose = () =>{
    setOpen(false);
  }
  return (
    <>
    {/* // Box  
    // sx={{ '& *': { fontSize:'18px', fontFamily:'Manrope', fontWeight:'bold'} }} */}
    {/* <Box sx={{height: '88px', width:'100%'}}>

    </Box> */}
      <InspectorDrawer />
      
       <SamplesDrawer templateDetails={templateDetails} setTemplateDetails={setTemplateDetails} />
       {/* {open && <EditTemplateMain onClose={handleClose}/>} */}
      
      <Stack
        sx={{
          marginRight: inspectorDrawerOpen ? `${INSPECTOR_DRAWER_WIDTH}px` : 0,
          marginLeft: samplesDrawerOpen ? `${SAMPLES_DRAWER_WIDTH}px` : 0,
          transition: [marginLeftTransition, marginRightTransition].join(', '),
        }}
      >
        <TemplatePanel templateDetails={templateDetails}/>        
        {/* <BlocksDrawer/> */}
      </Stack>
    </>
  );
}
