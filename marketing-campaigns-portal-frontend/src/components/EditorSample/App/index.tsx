import React, { useState, useEffect } from 'react';

import { Alert, Stack, useTheme } from '@mui/material';
// import { Box } from '@mui/material';
import { useInspectorDrawerOpen, useSamplesDrawerOpen } from '../documents/editor/EditorContext';

import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from './InspectorDrawer';
import
 SamplesDrawer
//  { SAMPLES_DRAWER_WIDTH } 
 from './SamplesDrawer';
import TemplatePanel from './TemplatePanel';
// import BlocksDrawer from './BlockDrawer/BlockDrawer';
import { Template } from '../../../types/template';
import { useParams } from 'react-router-dom';
import { getTemplateById, } from "../../../redux/slices/templateSlice";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useSelector } from "react-redux" ;
import { RootState } from "../../../redux/store";
import { resetDocument } from '../documents/editor/EditorContext';

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
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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
      // content: { message: template?.content.message || '' },
      content: {
        root: {
          id: 'root',
          type: 'EmailLayout',
          data: { childrenIds: ['TextBlock'] },
        },
        blocks: {
          root: {
            type: 'EmailLayout',
            data: { childrenIds: ['TextBlock'] },
          },
          TextBlock: {
            type: 'TextBlock',
            data: {
              text: 'Welcome to our newsletter!',
            },
          },
        },
      },
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
  //edit part
  const dispatch = useAppDispatch();
  // Replace 'templateData' with the actual property name from your TemplateState that holds the template object
    const templateFromApi = useSelector((state: RootState) => state.template.selectedTemplate as Template || null);

    const resetState = () => {
      setTemplateDetails({
        _id: '',
        name: '',
        subject: '',
        type: 'Email',
        category: 'Promotional',
        tags: [],
        senderId: '',
        campaign: '',
        includeOptOut: false,
        content: {
          root: {
            id: 'root',
            type: 'EmailLayout',
            data: { childrenIds: ['TextBlock'] },
          },
          blocks: {
            root: {
              type: 'EmailLayout',
              data: { childrenIds: ['TextBlock'] },
            },
            TextBlock: {
              type: 'TextBlock',
              data: {
                text: 'Welcome to our newsletter!',
              },
            },
          },
        },
        layout: 'Custom',
        createdAt: '',
        lastModified: '',
        favorite: false,
        isDeleted: false,
        version: 1,
      });
      resetDocument({
        root: {
          type: 'EmailLayout',
          data: {
            childrenIds: [],
          },
        },        
      });
    };

  const { id } = useParams<{id: string}>();
  // const id = '68220f25c305eea6017e4104';
  console.log('id', id);
  useEffect(() => {
      if (!id) resetState();
    }, [id]);
  useEffect(() => {
      if (!id) resetState();
    }, []);
    
  useEffect(() => {
      const CheckData = async() =>{       
        if (id) {
          await dispatch(getTemplateById(id) as any);
          
          setIsEditMode(true);
        } 
      }
      CheckData();
    }, [id, dispatch]);

    function isValidEmailBuilderJson(content: any) {
      return (
        content &&
        typeof content === 'object' &&
        content.root &&
        typeof content.root === 'object' &&
        typeof content.root.type === 'string'
      );
    }
    
    useEffect(() => {
      if (templateFromApi && isEditMode) {
        setTemplateDetails((prev) => ({
          ...prev,
          ...templateFromApi,
          tags: templateFromApi.tags ?? [],
        }));
    
        if (isValidEmailBuilderJson(templateFromApi.content)) {
          resetDocument(templateFromApi.content);
        } else {
          console.warn("Invalid or incomplete template JSON", templateFromApi.content);
          // fallback empty template
          resetDocument({
            root: {
              type: 'EmailLayout',
              data: {
                childrenIds: [],
              },
            },        
          });
        }
      }
    }, [templateFromApi]);
    


  // useEffect(() => {
  //   if (templateFromApi) {
  //     const FetchData = async() =>{
  //       console.log('templateFromApi', templateFromApi)
  //       setTemplateDetails(prev => ({
  //         ...prev,
  //         ...templateFromApi,
  //         tags: templateFromApi.tags ?? [],
  //       }));
  //       await resetDocument(templateFromApi.content);
  //     }
  //     FetchData();
  //   }
  // }, [templateFromApi]);


  return (
    <>
    {/* // Box  
    // sx={{ '& *': { fontSize:'18px', fontFamily:'Manrope', fontWeight:'bold'} }} */}
    {/* <Box sx={{height: '88px', width:'100%'}}>
    </Box> */}

      <InspectorDrawer />
      
      <SamplesDrawer templateDetails={templateDetails} setTemplateDetails={setTemplateDetails} error={error}/>
      
      <Stack
        sx={{
          marginRight: inspectorDrawerOpen ? `${INSPECTOR_DRAWER_WIDTH}px` : 0,
          marginLeft: samplesDrawerOpen ? `${SAMPLES_DRAWER_WIDTH}px` : 0,
          transition: [marginLeftTransition, marginRightTransition].join(', '),
        }}
      >
        <TemplatePanel templateDetails={templateDetails} isEdit={isEditMode} setError={setError} setIsEditMode={setIsEditMode}/>        
        {/* <BlocksDrawer/> */}
      </Stack>
    </>
  );
}
