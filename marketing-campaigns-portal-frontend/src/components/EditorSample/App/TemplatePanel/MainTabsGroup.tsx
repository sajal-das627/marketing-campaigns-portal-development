import React from 'react';

import { CodeOutlined, DataObjectOutlined, EditOutlined, PreviewOutlined } from '@mui/icons-material';
import { Card, Tab, Tabs, Tooltip } from '@mui/material';

import { setSelectedMainTab, useSelectedMainTab } from '../../documents/editor/EditorContext';
import UndoRedo from '../BlockDrawer/undoRedo';

export default function MainTabsGroup() {
  const selectedMainTab = useSelectedMainTab();
  console.log('selectedMainTab',selectedMainTab)
  const handleChange = (_: unknown, v: unknown) => {
    switch (v) {
      case 'json':
      case 'preview':
      case 'editor':
      case 'html':
        setSelectedMainTab(v);
        return;
      default:
        setSelectedMainTab('editor');
    }
  };

  return (
    <Tabs value={selectedMainTab} onChange={handleChange}>
      <Tab
        value=""
        label={
          // <Tooltip title="">
            <Card sx={{p:0.7, borderRadius:'6px',  boxShadow:'0px 1px 0px 2px #00000040'}}>
            <UndoRedo />
            </Card>
           
          // </Tooltip>
        }
      />
      <Tab
        value="editor"
        label={
          <Tooltip title="Edit">
            <Card sx={{p:0.7, borderRadius:'6px', boxShadow:'0px 1px 0px 1.5px #00000040'}}>
            <EditOutlined fontSize="small" sx={{fontSize:'26px', color:'#6D6976'}}/>
            </Card>
           
          </Tooltip>
        }
      />
      <Tab
        value="preview"
        label={
          <Tooltip title="Preview">
            <Card sx={{p:0.7, borderRadius:'6px',  boxShadow:'0px 1px 0px 1.5px #00000040'}}>
            <PreviewOutlined fontSize="small" sx={{fontSize:'26px', color:'#6D6976'}} />
            </Card>
          </Tooltip>
        }
      />
      <Tab
        value="html"
        label={
          <Tooltip title="HTML output">
            <Card sx={{p:0.7, borderRadius:'6px',  boxShadow:'0px 1px 0px 1.5px #00000040'}}>
            <CodeOutlined fontSize="small" sx={{fontSize:'26px', color:'#6D6976',}}/>            
            </Card>
            
          </Tooltip>
        }
      />
      <Tab
        value="json"
        label={
          <Tooltip title="JSON output">
              <Card sx={{p:0.7, borderRadius:'6px',  boxShadow:'0px 1px 0px 1.5px #00000040'}}>
            <DataObjectOutlined fontSize="small" sx={{fontSize:'26px', color:'#6D6976'}}/>
            </Card>
          </Tooltip>
        }
      />
    </Tabs>
  );
}
