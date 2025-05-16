import 
// React,
 { useState, useEffect }
  from 'react';

import { Stack, useTheme } from '@mui/material';
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
import CryptoJS from 'crypto-js';

const SAMPLES_DRAWER_WIDTH = 240;

function useDrawerTransition(cssProperty: 'margin-left' | 'margin-right', open: boolean) {
  const { transitions } = useTheme();
  return transitions.create(cssProperty, {
    easing: !open ? transitions.easing.sharp : transitions.easing.easeOut,
    duration: !open ? transitions.duration.leavingScreen : transitions.duration.enteringScreen,
  });
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
  const [templateDetails, setTemplateDetails] = useState<Template>({
      _id: template?._id || '',
      name: template?.name || '',
      subject: template?.subject || '',
      type: template?.type || 'Email',
      category: template?.category || '',
      tags: template?.tags || [],
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
    });
  
  const marginLeftTransition = useDrawerTransition('margin-left', samplesDrawerOpen);
  const marginRightTransition = useDrawerTransition('margin-right', inspectorDrawerOpen);
  const handleClose = () =>{
    setOpen(false);
  }
  
  const dispatch = useAppDispatch();
  
    const templateFromApi = useSelector((state: RootState) => state.template.selectedTemplate as Template || null);

    const resetState = () => {
      setTemplateDetails({
        _id: '',
        name: '',
        subject: '',
        type: 'Email',
        category: '',
        tags: [],
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

  const { id : encryptedId } = useParams();
  const [id, setId] = useState<string | null>(null);
  const secretKey =  (process.env.REACT_APP_ENCRYPT_SECRET_KEY as string);
  
  useEffect(() => {
    if (encryptedId) {
      try { 
        const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), secretKey);
        const decryptedId = bytes.toString(CryptoJS.enc.Utf8);
        setId(decryptedId);
        console.log("Decrypted ID:", decryptedId);
      } catch (error) {
        console.error("Failed to decrypt ID:", error);
        setId(null);
      }
    }
  }, [encryptedId, secretKey]);
  console.log('id', id);
  useEffect(() => {
      if (!id) resetState();
    }, [id]);
    
    useEffect(() => {
      if (id) {
        dispatch(getTemplateById(id) as any).then((action: any) => {
          const tpl = action.payload as Template;
          if (tpl) {
            setIsEditMode(true);
            setTemplateDetails({
              ...tpl,
              tags: tpl.tags ?? [],
            });
            resetDocument(tpl.content);
          }
        });
      }
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
    
  return (
    <>
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
