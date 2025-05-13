import React, {useState} from "react";
import {Button, ButtonGroup, Menu, MenuItem} from '@mui/material';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useDocument } from '../../documents/editor/EditorContext';
import { Template } from 'types/template';
import { useAppDispatch } from "../../../../redux/hooks";
import { createTemplateThunk } from "../../../../redux/slices/templateSlice";
interface TemplateEditorProps {
  TemplateDetails : Template;
}

export default function SaveButton ({TemplateDetails}: TemplateEditorProps){

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const dispatch = useAppDispatch();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

//   const handleSelect = (option: string) => {
//     console.log("Selected:", option);
//     setAnchorEl(null);
//     // Add logic for each action
//   };

  const options = [
    {
      label: 'Save Template & Exit',
      onClick: () => {
        handleSave();
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
    
  const handleSave = () => {
    
    const html = renderToStaticMarkup(document, { rootBlockId: 'root' });
    console.log('html', html);
    saveTemplate({
      name: "Welcome Email",
      html: html,
      design: document,
    });
  };

  const saveTemplate = async (payload: { name: string; html: string; design: object }) => {
    
      try {
        // setForm((prev) => ({...prev, name: 'New Template2'}));
        await dispatch(createTemplateThunk(TemplateDetails));
        alert('Saved successfully!');
        console.log('form Submitted', TemplateDetails);
    } catch (err) {
      console.error('Save failed:', err);
    }
       
    // try {
    //   await fetch('http://localhost:4000/api/templates', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(payload), // ✅ Just use payload, it's already correct
    //   });
    //   alert('Saved successfully!');
    // } catch (err) {
    //   console.error('Save failed:', err);
    // }
  };

    return(
        <ButtonGroup variant="contained" >
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
      </ButtonGroup>
    )
}