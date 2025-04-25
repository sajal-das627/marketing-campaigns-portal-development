import React, { useMemo } from 'react';

import { renderToStaticMarkup } from '@usewaypoint/email-builder';

import { useDocument } from '../../documents/editor/EditorContext';

import HighlightedCodePanel from './helper/HighlightedCodePanel';

export default function HtmlPanel() {
  const document = useDocument();
  const code = useMemo(() => renderToStaticMarkup(document, { rootBlockId: 'root' }), [document]);
  return <HighlightedCodePanel type="html" value={code} />;
}


// import TwoWayHtmlPanel from '../BlockDrawer/TwoWayHtmlPanel';

// import AceEditor from 'react-ace';
// import 'ace-builds/src-noconflict/mode-html';
// import 'ace-builds/src-noconflict/theme-github';  // pick any free theme
// import React, { useState, useEffect } from 'react';
// // import AceEditor from 'react-ace';
// import { renderToStaticMarkup, TReaderDocument } from '@usewaypoint/email-builder';

// type HtmlPanelProps = { document: TReaderDocument };

// export default function HtmlPanel({ document }: HtmlPanelProps) {
//   const [html, setHtml] = useState('');

//   useEffect(() => {
//     setHtml(renderToStaticMarkup(document, { rootBlockId: 'root' }));
//   }, [document]);

//   return (
//     <div style={{ display: 'flex', height: '100%' }}>
//       {/* Left: Ace code editor */}
//       <AceEditor
//         mode="html"
//         theme="github"
//         width="50%"
//         height="100%"
//         value={html}
//         onChange={setHtml}
//         setOptions={{
//           wrap: true,
//           useWorker: false
//         }}
//       />
//       {/* Right: Preview */}
//       {/* <div
//         style={{ flex: 1, padding: 12, borderLeft: '1px solid #ddd', overflow: 'auto' }}
//         dangerouslySetInnerHTML={{ __html: html }}
//       /> */}
//         <TwoWayHtmlPanel htmlBlockId="root" />

//     </div>
//   )
// }


//new
// In your HtmlPanel.tsx or wherever:
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/mode/xml/xml';      // for HTML/XML syntax highlighting
// import React, { useState, useEffect } from 'react';
// import { Controlled as CodeMirror } from 'react-codemirror2';
// import { renderToStaticMarkup, TReaderDocument } from '@usewaypoint/email-builder';

// type HtmlPanelProps = { document: TReaderDocument };

// export default function HtmlPanel({ document }: HtmlPanelProps) {
//   const [html, setHtml] = useState('');

//   // Whenever the JSON doc changes, regen the HTML
//   useEffect(() => {
//     setHtml(renderToStaticMarkup(document, { rootBlockId: 'root' }));
//   }, [document]);

//   return (
//     <div style={{ display: 'flex', height: '100%' }}>
//       {/* Left: Code editor */}
//       <CodeMirror
//         value={html}
//         options={{
//           mode: 'xml',
//           lineNumbers: true,
//           lineWrapping: true,
//         }}
//         onBeforeChange={(editor, data, value) => {
//           setHtml(value);
//         }}
//       />
//       {/* Right: Live preview */}
//       <div
//         style={{ flex: 1, padding: 12, borderLeft: '1px solid #ddd', overflow: 'auto', minWidth:'200px' }}
//         dangerouslySetInnerHTML={{ __html: html }}
//       />
//     </div>
//   )
// }



// old
// HtmlPanel.jsx
// import React, { useEffect } from 'react';
// import { Grid, TextField, Typography,
//   Button,
//  } from '@mui/material';
// import { renderToStaticMarkup } from '@usewaypoint/email-builder';
// import {
//   useDocument,
//   useHtmlCode,
//   useIsHtmlManual,
//   setHtmlCodeAuto,
//   setHtmlCodeManual,
//   setDocument,
// } from '../../documents/editor/EditorContext';
// import EditorBlock from '../../documents/editor/EditorBlock';
// import type { TEditorBlock } from '../../documents/editor/core';
// import parseHtmlToDocument from '../BlockDrawer/DomParsetHtmlToDoc';

// type HtmlBlock = Extract<TEditorBlock, { type: 'Html' }>;

// export default function HtmlPanel() {
//   const design       = useDocument();
//   const htmlCode     = useHtmlCode();
//   const isHtmlManual = useIsHtmlManual();

//   // auto‐sync: whenever your document changes, regenerate HTML (unless user is editing manually)
//   useEffect(() => {
//     if (!isHtmlManual) {
//       const out = renderToStaticMarkup(design, { rootBlockId: 'root' });
//       setHtmlCodeAuto(out);
//     }
//   }, [design, isHtmlManual]);

//   // manual‐sync: when htmlCode changes via TextField, push it back into the block tree
//   useEffect(() => {
//     if (!isHtmlManual) return;
//     if (design.root.type !== 'Html') return;

//     const htmlBlock = design.root as HtmlBlock;
//     setDocument({
//       root: {
//         ...htmlBlock,
//         data: {
//           ...htmlBlock.data,
//           props: {
//             ...(htmlBlock.data.props ?? {}),
//             contents: htmlCode,
//           },
//         },
//       },
//     });
//   }, [htmlCode, isHtmlManual, design.root]);

//   const applyHtmlToBlocks = () => {
//     const newConfig = parseHtmlToDocument(htmlCode);
//     setDocument(newConfig);
//   };

//   return (
//     <Grid container spacing={2} sx={{ height: '100%' }}>
//       <Grid size={{xs:12}}>
//         <Button variant="contained" onClick={applyHtmlToBlocks}>
//           Apply HTML to Blocks
//         </Button>
//       </Grid>

//       <Grid size={{xs:6}} sx={{ height: '100%' }}>
//         <Typography variant="subtitle1" gutterBottom>
//           Editable HTML
//         </Typography>
//         <TextField
//           value={htmlCode}
//           onChange={(e) => setHtmlCodeManual(e.target.value)}
//           multiline
//           fullWidth
//           minRows={20}
//           variant="outlined"
//           sx={{
//             fontFamily: 'monospace',
//             fontSize: 13,
//             height: 'calc(100% - 32px)',
//             '& .MuiInputBase-root': { height: '100%' },
//           }}
//         />
//       </Grid>

//       <Grid size={{xs:6}} sx={{ height: '100%', overflow: 'auto' }}>
//         <Typography variant="subtitle1" gutterBottom>
//           Live Preview
//         </Typography>
//         <EditorBlock
//           id="root"
//           dangerouslySetInnerHTML={{ __html: htmlCode }}
//         />
//       </Grid>

      
//     </Grid>
//   );
// }


//tomorrow
// HtmlPanel.jsx
// import React, { useEffect } from 'react';
// import { Grid, TextField, Typography,
//   Button,
//  } from '@mui/material';
// import { renderToStaticMarkup } from '@usewaypoint/email-builder';
// import {
//   useDocument,
//   useHtmlCode,
//   useIsHtmlManual,
//   setHtmlCodeAuto,
//   setHtmlCodeManual,
//   // setDocument,
//   useSetDocument
// } from '../../documents/editor/EditorContext';
// import EditorBlock from '../../documents/editor/EditorBlock';
// import type { TEditorBlock } from '../../documents/editor/core';
// import {parseHtmlToDocument} from '../BlockDrawer/removeThemLater/DomParsetHtmlToDoc';

// type HtmlBlock = Extract<TEditorBlock, { type: 'Html' }>;

// export default function HtmlPanel() {
//   const design       = useDocument();
//   const htmlCode     = useHtmlCode();
//   const isHtmlManual = useIsHtmlManual();
//   const setDocument = useSetDocument();      // ← grab the updater

//   // auto‐sync: whenever your document changes, regenerate HTML (unless user is editing manually)
//   useEffect(() => {
//     if (!isHtmlManual) {
//       const out = renderToStaticMarkup(design, { rootBlockId: 'root' });
//       setHtmlCodeAuto(out);
//     }
//   }, [design, isHtmlManual]);

//   // manual‐sync: when htmlCode changes via TextField, push it back into the block tree
//   useEffect(() => {
//     if (!isHtmlManual) return;
//     if (design.root.type !== 'Html') return;

//     const htmlBlock = design.root as HtmlBlock;
//     setDocument({
//       root: {
//         ...htmlBlock,
//         data: {
//           ...htmlBlock.data,
//           props: {
//             ...(htmlBlock.data.props ?? {}),
//             contents: htmlCode,
//           },
//         },
//       },
//     });
//   }, [htmlCode, isHtmlManual, design.root]);

//   const applyHtmlToBlocks = () => {
//     const newConfig = parseHtmlToDocument(htmlCode);
//     setDocument(newConfig);
//   };

//   return (
//     <Grid container spacing={2} sx={{ height: '100%' }}>
//       <Grid size={{xs:12}}>
//         <Button variant="contained" onClick={applyHtmlToBlocks}>
//           Apply HTML to Blocks
//         </Button>
//       </Grid>

//       <Grid size={{xs:6}} sx={{ height: '100%' }}>
//         <Typography variant="subtitle1" gutterBottom>
//           Editable HTML
//         </Typography>
//         <TextField
//           value={htmlCode}
//           onChange={(e) => setHtmlCodeManual(e.target.value)}
//           multiline
//           fullWidth
//           minRows={20}
//           variant="outlined"
//           sx={{
//             fontFamily: 'monospace',
//             fontSize: 13,
//             height: 'calc(100% - 32px)',
//             '& .MuiInputBase-root': { height: '100%' },
//           }}
//         />
//       </Grid>

//       <Grid size={{xs:6}} sx={{ height: '100%', overflow: 'auto' }}>
//         <Typography variant="subtitle1" gutterBottom>
//           Live Preview
//         </Typography>
//         <EditorBlock
//           id="root"
//           dangerouslySetInnerHTML={{ __html: htmlCode }}
//         />
//       </Grid>

      
//     </Grid>
//   );
// }
