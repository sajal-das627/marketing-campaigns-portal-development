import React, { useState } from 'react';

import { Stack, useTheme } from '@mui/material';
// import { Box } from '@mui/material';
import { useInspectorDrawerOpen, useSamplesDrawerOpen } from '../documents/editor/EditorContext';

import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from './InspectorDrawer';
// import
//  SamplesDrawer
// //  { SAMPLES_DRAWER_WIDTH } 
//  from './SamplesDrawer';
import TemplatePanel from './TemplatePanel';
import BlocksDrawer from './BlockDrawer/BlockDrawer';
import EditTemplateMain from './BlockDrawer/EditTemplateMain'
const SAMPLES_DRAWER_WIDTH = 240;

function useDrawerTransition(cssProperty: 'margin-left' | 'margin-right', open: boolean) {
  const { transitions } = useTheme();
  return transitions.create(cssProperty, {
    easing: !open ? transitions.easing.sharp : transitions.easing.easeOut,
    duration: !open ? transitions.duration.leavingScreen : transitions.duration.enteringScreen,
  });
}

export default function App() {
  const [open, setOpen] = useState<Boolean>(true);
  const inspectorDrawerOpen = useInspectorDrawerOpen();
  const samplesDrawerOpen = useSamplesDrawerOpen();
  
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
      
       {/* <SamplesDrawer /> */}
       {open && <EditTemplateMain onClose={handleClose}/>}
      
      <Stack
        sx={{
          marginRight: inspectorDrawerOpen ? `${INSPECTOR_DRAWER_WIDTH}px` : 0,
          marginLeft: samplesDrawerOpen ? `${SAMPLES_DRAWER_WIDTH}px` : 0,
          transition: [marginLeftTransition, marginRightTransition].join(', '),
        }}
      >
        <TemplatePanel />        
        <BlocksDrawer/>
      </Stack>
    </>
  );
}
