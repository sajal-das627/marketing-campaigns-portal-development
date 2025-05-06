// import React from 'react';
// import {
//   Drawer,
//   Stack,
//   Typography,
//   Button,
//   TextField,
//   InputAdornment,
//   Box,
// } from '@mui/material';

// import {
//   // editorStateStore,
//   useDocument,
//   setDocument,
// } from '../../documents/editor/EditorContext';
// import type { TEditorBlock } from '../../documents/editor/core';
// import EditIcon from '@mui/icons-material/Edit';

// // import ImageIcon from '@mui/icons-material/Image';
// // import SpaceBarIcon from '@mui/icons-material/SpaceBar';
// // import VideocamIcon from '@mui/icons-material/Videocam';
// // import CodeIcon from '@mui/icons-material/Code';
// // import LanguageIcon from '@mui/icons-material/Language'; //globe
// // import LinearScaleIcon from '@mui/icons-material/LinearScale';
// // import WifiIcon from '@mui/icons-material/Wifi';

// import ImageIcon from '@mui/icons-material/Image';
// import TextFieldsIcon from '@mui/icons-material/TextFields';
// import TitleIcon from '@mui/icons-material/Title';
// import CodeIcon from '@mui/icons-material/Code';
// import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
// import SpaceBarIcon from '@mui/icons-material/SpaceBar';
// import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
// import SmartButtonIcon from '@mui/icons-material/SmartButton';
// import { IconButton } from '@mui/material';


// // interface TEditorBlock {
// //   type: BlockType;
// //   data: {
// //     props: any;
// //     style?: {
// //       padding?: {
// //         top: number;
// //         bottom: number;
// //         left: number;
// //         right: number;
// //       };
// //       textAlign?: "left" | "center" | "right" | null;
// //     };
// //   };
// // }

// export const BLOCK_TYPE_ICONS: Record<BlockType, React.ReactNode> = {
//   Heading: <TitleIcon fontSize="small" />,
//   Text: <TextFieldsIcon fontSize="small" />,
//   Button: <SmartButtonIcon fontSize="small" />,
//   Image: <ImageIcon fontSize="small" />,
//   Html: <CodeIcon fontSize="small" />,
//   Avatar: <InsertEmoticonIcon fontSize="small" />,
//   Spacer: <SpaceBarIcon fontSize="small" />,
//   Divider: <HorizontalRuleIcon fontSize="small" />,
// };

// const BLOCK_TYPES = [
//   'Heading',
//   'Text',
//   'Button',
//   'Image',
//   'Html',
//   'Avatar',
//   'Spacer',
//   'Divider',
// ] as const;
// type BlockType = typeof BLOCK_TYPES[number];

// export default function BlocksDrawer() {
//   const document = useDocument();

//   const insertBlock = (type: BlockType) => {
//     const id = crypto.randomUUID();

//     const defaults: Record<BlockType, any> = {
//       Heading: { text: 'New Heading', align: 'left' },
//       Text:    { text: 'Lorem ipsum…', align: 'left' },
//       Button:  { text: 'Button', url: '#' },
//       Image:   { url: 'https://placehold.co/400x200', alt: '' },
//       Html:    { html: '<p>HTML snippet</p>' },
//       Avatar:  { src: 'https://placehold.co/100',   alt: 'Avatar' },
//       Spacer:  { size: 20 },
//       Divider: {},
//     };
//     const PADDING = { top: 16, bottom: 16, left: 24, right: 24 };

//     const newBlock: TEditorBlock = {
//       type,
//       data: {
//         props: defaults[type],
//         ...(defaults[type] && {
//           style: {
//             padding: { ...PADDING },
//             textAlign: null,
//           },
//         }),
//       },
//     };

//     // 1) add the block
//     setDocument({ [id]: newBlock });

//     // 2) append it to your root layout
//     const root = document.root;
//     if (root.type === 'EmailLayout') {
//       const prevIds = root.data.childrenIds;
//       setDocument({
//         root: {
//           ...root,
//           data: {
//             ...root.data,
//             childrenIds: [...prevIds ||[], id],
//           },
//         },
//       });
//     }
//   };

//   return (
//     <Drawer variant="permanent" anchor="left" open>
//       <Stack spacing={2} p={2} width={240}>
//         <Box sx={{display:"flex", alignItems:"center" }}>
//       <TextField
//             variant="outlined"
//             placeholder="New Template"
//             size="small"            
//             // value={search}
//             // onChange={}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                 </InputAdornment>
//               ),
//             }} 
//             sx={{ width: 200, backgroundColor: "#f5f5f5", mr:1 }}
//           />
//           <IconButton>
//             <EditIcon/>
//           </IconButton>
//           </Box>

//         <Typography variant="h6">Blocks</Typography>
//         {BLOCK_TYPES.map((type) => (
//           <Button
//             key={type}
//             variant="outlined"
//             size="small"
//             onClick={() => insertBlock(type)}
//             startIcon={BLOCK_TYPE_ICONS[type]}
//             sx={{
//               fontSize:'18px', p:1,  border:'2px solid #ECEEF6', 
//               textAlign:'left !important', justifyContent:'left',//boxShadow:'1px 1px 1px 1px',
//             }}>
//             {type}
//           </Button>
//         ))}
//       </Stack>
//     </Drawer>
//   );
// }


import React from 'react';
import EditIcon from '@mui/icons-material/Edit';

import { Box, Button, Drawer, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';

import { useSamplesDrawerOpen } from '../../documents/editor/EditorContext';

import ImageIcon from '@mui/icons-material/Image';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import TitleIcon from '@mui/icons-material/Title';
import CodeIcon from '@mui/icons-material/Code';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import ViewModuleIcon from '@mui/icons-material/ViewModule'; // ColumnsContainer
import CropSquareIcon from '@mui/icons-material/CropSquare'; // Container
import type { TEditorBlock } from '../../documents/editor/core';

import {
  // editorStateStore,
  useDocument,
  setDocument,
} from '../../documents/editor/EditorContext';
export const SAMPLES_DRAWER_WIDTH = 240;
type BlockType = typeof BLOCK_TYPES[number];


export const BLOCK_TYPE_ICONS: Record<BlockType, React.ReactNode> = {
  Heading: <TitleIcon fontSize="small" />,
  Text: <TextFieldsIcon fontSize="small" />,
  Button: <SmartButtonIcon fontSize="small" />,
  Image: <ImageIcon fontSize="small" />,
  Html: <CodeIcon fontSize="small" />,
  Avatar: <InsertEmoticonIcon fontSize="small" />,
  Spacer: <SpaceBarIcon fontSize="small" />,
  Divider: <HorizontalRuleIcon fontSize="small" />,  
  Container: <CropSquareIcon fontSize="small" />,
  ColumnsContainer: <ViewModuleIcon fontSize="small" />,
};

const BLOCK_TYPES = [
  'Heading',
  'Text',
  'Button',
  'Image',
  'Html',
  'Avatar',
  'Spacer',
  'Divider',  
  'Container',
  'ColumnsContainer',
  // 'Video',  'Timer', 'Menu', 'Social', 'RSS',
] as const;

export default function SamplesDrawer() {
   const document = useDocument();
  
    const insertBlock = (type: BlockType) => {
      const id = crypto.randomUUID();
  
      const defaults: Record<BlockType, any> = {
        Heading: { text: 'New Heading', align: 'left' },
        Text:    { text: 'Lorem ipsum…', align: 'left' },
        Button:  { text: 'Button', url: '#' },
        Image:   { url: 'https://placehold.co/400x200', alt: '' },
        Html:    { html: '<p>HTML snippet</p>' },
        Avatar:  { src: 'https://placehold.co/100',   alt: 'Avatar' },
        Spacer:  { size: 20 },
        Divider: {},
        Container: { childrenIds: [], padding: 16 },
        ColumnsContainer: {
          columns: [
            { childrenIds: [], padding: 16, gap:20 },
            { childrenIds: [], padding: 16, gap:20 },
            { childrenIds: [], padding: 16, gap:20 },
  
          ],
        },      // Video:   { url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4', autoplay: false },
        // Timer:   { duration: 60, style: 'circle' },
        // Menu:    { items: ['Home', 'About', 'Contact'], orientation: 'horizontal' },
        // Social:  { platforms: ['facebook', 'twitter'], align: 'center' },
        // RSS:     { feedUrl: 'https://example.com/rss.xml' },
      
      };
      const PADDING = { top: 16, bottom: 16, left: 24, right: 24 };
  
      const newBlock: TEditorBlock = {
        type,
        data: {
          props: defaults[type],
          ...(defaults[type] && {
            style: {
              padding: { ...PADDING },
              textAlign: null,
            },
          }),
        },
      };
  
      // 1) add the block
      setDocument({ [id]: newBlock });
  
      // 2) append it to your root layout
      const root = document.root;
      if (root.type === 'EmailLayout') {
        const prevIds = root.data.childrenIds;
        setDocument({
          root: {
            ...root,
            data: {
              ...root.data,
              childrenIds: [...prevIds ||[], id],
            },
          },
        });
      }
    };
  const samplesDrawerOpen = useSamplesDrawerOpen();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={samplesDrawerOpen}
      sx={{
        width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
      }}
    >
      <Stack spacing={3} py={1} px={2} width={SAMPLES_DRAWER_WIDTH} justifyContent="space-between" height="100%">
       
                <Box sx={{display:"flex", alignItems:"center", gap:2 }}>
              <TextField
                    variant="outlined"
                    placeholder="New Template Name"
                    size="small"            
                    // value={search}
                    // onChange={}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                      ),
                    }} 
                    sx={{ width: 200, backgroundColor: "#f5f5f5", mr:1 }}
                  />
                  <IconButton>
                    <EditIcon/>
                  </IconButton>
                  
                  </Box>
                  
              <TextField
                    variant="outlined"
                    placeholder="Category"
                    size="small"            
                    // value={search}
                    // onChange={}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                      ),
                    }} 
                    sx={{ width: 200, backgroundColor: "#f5f5f5", mr:1 }}
                  />
              <TextField
                    variant="outlined"
                    placeholder="Tags"
                    size="small"            
                    // value={search}
                    // onChange={}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                      ),
                    }} 
                    sx={{ width: 200, backgroundColor: "#f5f5f5", mr:1 }}
                  />
        
                <Typography variant="h6">Blocks</Typography>
                {BLOCK_TYPES.map((type) => (
                  <Button
                    key={type}
                    variant="outlined"
                    size="small"
                    onClick={() => insertBlock(type)}
                    startIcon={BLOCK_TYPE_ICONS[type]}
                    sx={{
                      color: '#000',
                      fontSize:'18px', p:1,  border:'2px solid #ECEEF6', 
                      textAlign:'left !important', justifyContent:'left',//boxShadow:'1px 1px 1px 1px',
                    }}>
                    {type}
        
                    
                    {/* {html && (
                      <div
                        dangerouslySetInnerHTML={{ __html: html }}
                        style={{ fontSize: '14px', opacity: 0.6 }}
                      />
                    )}   */}
                  </Button>
                ))}
            
      </Stack>
    </Drawer>
  );
}
