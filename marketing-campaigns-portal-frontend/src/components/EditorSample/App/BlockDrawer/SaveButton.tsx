import React, {useState} from "react";
import {Button, ButtonGroup, Menu, MenuItem} from '@mui/material';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useDocument } from '../../documents/editor/EditorContext';
import { Template } from 'types/template';
import { useAppDispatch } from "../../../../redux/hooks";
import { createTemplateThunk, updateTemplate } from "../../../../redux/slices/templateSlice";
interface TemplateEditorProps {
  TemplateDetails : Template;
  isEdit: boolean;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  
}

export default function SaveButton ({TemplateDetails, isEdit, setError}: TemplateEditorProps){

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const options = [
    {
      label: 'Save Template & Exit',
      onClick: () => {
        // handleSave();
        console.log('🔥 Saving & Exiting');
        // Your logic here
      },
    },
    {
      label: 'Save as New Template',
      onClick: () => {
        console.log('💾 Saving as New');
        // Your logic here
      },
    },
    {
      label: 'Close the Editor',
      onClick: () => {
        console.log('❌ Closing Editor');
        // Your logic here
      },
    },
  ];
  

  const document = useDocument();
    
  // const handleSave = () => { 
  //   const html = renderToStaticMarkup(document, { rootBlockId: 'root' });
  //   console.log('html', html);
  //   saveTemplate({
  //     name: "Welcome Email",
  //     html: html,
  //     design: document,
  //   });
  // };

  // const saveTemplate = async (payload: { name: string; html: string; design: object }) => {
  const saveTemplate = async () => {
    setTimeout(()=>{
      setError(null);
    }, 7000)
    if (!TemplateDetails.name || !/^[a-zA-Z0-9\s]{3,50}$/.test(TemplateDetails.name)) {
      setError("Template name should be 3-50 characters and contain only letters, numbers, and spaces.");
      return;
    }  
    if (!TemplateDetails.category) {
      setError("Category is Required");
      return;
    }  
    if (!TemplateDetails?.content?.data?.childrenIds || TemplateDetails.content.data.childrenIds.length === 0) {
      setError("Template Design is Required");
      return;
    }  
    if (/^copy/i.test(TemplateDetails?.name.trim())) {
      setError("Name Cannot Start from 'Copy'");
      return;
    } 

    try {
      if(isEdit){
        await dispatch(updateTemplate({ id: TemplateDetails._id, data: TemplateDetails }) as any);
      }
      else{
        await dispatch(createTemplateThunk(TemplateDetails));
      }
      setOpen(true);
      console.log('form Submitted', TemplateDetails);
    } catch (err) {
      console.error('Save failed:', err);
    }
       
  };

    return(
      <>
        <Button variant="contained" color='primary'
        onClick={saveTemplate}
        > {isEdit ? 'Update' : 'Save'}</Button>

        {/* <ButtonGroup variant="contained" >
        <Button onClick={() => (options[0].onClick())} sx={{bgcolor:'#0057D9', borderRadius:'6px'}}>Save As</Button>
        <Button
          size="small"
          onClick={handleMenuClick} sx={{bgcolor:'#0057D9', borderRadius:'6px'}}

        >
          <ArrowDropDownIcon />
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {options.map((option) => (
            <MenuItem 
                key={option.label} 
                onClick={() =>{
                    option.onClick();
                    handleMenuClose();
            }}>{option.label}
            </MenuItem>
          ))}
        </Menu>
      </ButtonGroup> */}

      </>
    )
}