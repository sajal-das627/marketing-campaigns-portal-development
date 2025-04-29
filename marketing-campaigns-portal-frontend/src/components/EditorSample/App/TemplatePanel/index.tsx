import React from 'react';

import { MonitorOutlined, PhoneIphoneOutlined } from '@mui/icons-material';
import { Box, Card, Stack, SxProps, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { Reader } from '@usewaypoint/email-builder';

import EditorBlock from '../../documents/editor/EditorBlock';
import {
  setSelectedScreenSize,
  useDocument,
  useSelectedMainTab,
  useSelectedScreenSize,
  useSetDocument ,
  useHtmlCode,
} from '../../documents/editor/EditorContext';
import ToggleInspectorPanelButton from '../InspectorDrawer/ToggleInspectorPanelButton';
import ToggleSamplesPanelButton from '../SamplesDrawer/ToggleSamplesPanelButton';

import DownloadJson from './DownloadJson';
import HtmlPanel from './HtmlPanel';
import ImportJson from './ImportJson';
import JsonPanel from './JsonPanel';
import MainTabsGroup from './MainTabsGroup';
import ShareButton from './ShareButton';
import SaveButton from '../BlockDrawer/SaveButton';
// import EmailLayoutEditor from '../../documents/blocks/EmailLayout/EmailLayoutEditor';
import { TEditorBlock } from '../../documents/editor/core';

type HtmlBlock = Extract<TEditorBlock, { type: 'Html' }>;

export default function TemplatePanel() {
  const document = useDocument();
  const selectedMainTab = useSelectedMainTab();
  const selectedScreenSize = useSelectedScreenSize();
  const htmlCode = useHtmlCode();
  const setDocument = useSetDocument();
  React.useEffect(() => {
    // 1) Don’t even try to patch unless it really *is* an Html block
    if (document.root.type !== 'Html') return;
    // 2) Now TS knows `document.root` is the Html variant
    const htmlBlock = document.root as HtmlBlock;
    // 3) Patch only the .data.props.html field
    setDocument({
      root: {
        ...htmlBlock,
        data: {
          ...htmlBlock.data,              // keep childrenIds + style
          props: {
            ...(htmlBlock.data.props ?? {}), // keep any other HtmlProps
            contents: htmlCode,              // overwrite the HTML
          },
        },
      },
    });
  }, [htmlCode, document.root, setDocument]);

  let mainBoxSx: SxProps = {
    height: '100%',
  };
  if (selectedScreenSize === 'mobile') {
    mainBoxSx = {
      ...mainBoxSx,
      margin: '32px auto',
      width: 370,
      height: 800,
      boxShadow:
        'rgba(33, 36, 67, 0.04) 0px 10px 20px, rgba(33, 36, 67, 0.04) 0px 2px 6px, rgba(33, 36, 67, 0.04) 0px 0px 1px',
    };
  }
  const handleScreenSizeChange = (_: unknown, value: unknown) => {
    switch (value) {
      case 'mobile':
      case 'desktop':
        setSelectedScreenSize(value);
        return;
      default:
        setSelectedScreenSize('desktop');
    }
  };
  const renderMainPanel = () => {
    switch (selectedMainTab) {
      case 'editor':
        return (
          <Box sx={mainBoxSx}>
            {/* editor-only */}
            <EditorBlock id="root" />
          </Box>
        );  
      case 'preview':
        return (
          <Box sx={mainBoxSx}>
            {/* full “Reader” preview */}
            <Reader document={document} rootBlockId="root" />
          </Box>
        );
      case 'html':
        return (
          <Box sx={mainBoxSx} display="flex" flexDirection="column">
            {/* your HTML source editor */}
            <HtmlPanel />
  
            {/* live editor matching that code */}
            <Box
              sx={{
                flex: 1,
                mt: 2,
                border: '1px solid #ddd',
                borderRadius: 1,
                overflow: 'auto',
              }}
              key={`html-preview-${htmlCode}`}
            >
              <EditorBlock id="root" />
            </Box>
          </Box>
        );  
      case 'json':
        return <JsonPanel />;
    }
  }; 
  return (
    <>
      <Stack
        sx={{
          height: 99,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: '#F7F9FF',          // backgroundColor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 'appBar',
          px: 1,
        }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <ToggleSamplesPanelButton />
        <Stack px={2} direction="row" gap={2} width="100%" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2}>
          <MainTabsGroup />
          </Stack>
          <Stack direction="row" spacing={2}>
            <DownloadJson />
            <ImportJson />
            <Card sx={{p:0.7, borderRadius:'6px',  boxShadow:'0px 1px 0px 2px #00000040'}}>
            <ToggleButtonGroup value={selectedScreenSize} exclusive size="small" onChange={handleScreenSizeChange} sx={{border:'none'}}>
              <ToggleButton value="desktop"  sx={{border:'none'}}>
                <Tooltip title="Desktop view">
                  <MonitorOutlined fontSize="small" sx={{fontSize:'26px'}}/>
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="mobile"  sx={{border:'none'}}>
                <Tooltip title="Mobile view">
                  <PhoneIphoneOutlined fontSize="small"  sx={{fontSize:'26px'}}/>
                </Tooltip>
                </ToggleButton>
                </ToggleButtonGroup>
            </Card>
            <ShareButton />
            <SaveButton />
          </Stack>
        </Stack>
        <ToggleInspectorPanelButton /> 
      </Stack>
      <Box sx={{ height: 'calc(100vh - 49px)', overflow: 'auto', minWidth: 370, color: "#000", bgcolor:'#000' }}>{renderMainPanel()}</Box>
    </>
  );
}
