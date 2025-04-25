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

import { Box, Button, Divider, Drawer, Link, Stack, Typography } from '@mui/material';

import { useSamplesDrawerOpen } from '../../documents/editor/EditorContext';

import SidebarButton from './SidebarButton';
import logo from './waypoint.svg';

export const SAMPLES_DRAWER_WIDTH = 240;

export default function SamplesDrawer() {
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
        <Stack spacing={2} sx={{ '& .MuiButtonBase-root': { width: '100%', justifyContent: 'flex-start' } }}>
          <Typography variant="h6" component="h1" sx={{ p: 0.75 }}>
            EmailBuilder.js
          </Typography>

          <Stack alignItems="flex-start">
            <SidebarButton href="#">Empty</SidebarButton>
            <SidebarButton href="#sample/welcome">Welcome email</SidebarButton>
            <SidebarButton href="#sample/one-time-password">One-time passcode (OTP)</SidebarButton>
            <SidebarButton href="#sample/reset-password">Reset password</SidebarButton>
            <SidebarButton href="#sample/order-ecomerce">E-commerce receipt</SidebarButton>
            <SidebarButton href="#sample/subscription-receipt">Subscription receipt</SidebarButton>
            <SidebarButton href="#sample/reservation-reminder">Reservation reminder</SidebarButton>
            <SidebarButton href="#sample/post-metrics-report">Post metrics</SidebarButton>
            <SidebarButton href="#sample/respond-to-message">Respond to inquiry</SidebarButton>
          </Stack>

          <Divider />

          <Stack>
            <Button size="small" href="https://www.usewaypoint.com/open-source/emailbuilderjs" target="_blank">
              Learn more
            </Button>
            <Button size="small" href="https://github.com/usewaypoint/email-builder-js" target="_blank">
              View on GitHub
            </Button>
            
          </Stack>
        </Stack>
        <Stack spacing={2} px={0.75} py={3}>
          <Link href="https://usewaypoint.com?utm_source=emailbuilderjs" target="_blank" sx={{ lineHeight: 1 }}>
            <Box component="img" src={logo} width={32} />
          </Link>
          <Box>
            <Typography variant="overline" gutterBottom>
              Looking to send emails?
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Waypoint is an end-to-end email API with a &apos;pro&apos; version of this template builder with dynamic
              variables, loops, conditionals, drag and drop, layouts, and more.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ justifyContent: 'center' }}
            href="https://usewaypoint.com?utm_source=emailbuilderjs"
            target="_blank"
          >
            Learn more
          </Button>
                
        </Stack>
      </Stack>
    </Drawer>
  );
}
