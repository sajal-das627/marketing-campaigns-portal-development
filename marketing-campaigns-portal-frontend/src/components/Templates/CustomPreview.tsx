// src/components/Templates/CustomPreview.tsx
import React from 'react';
import { Reader } from '@usewaypoint/email-builder';
import { Box } from '@mui/material';

type CustomPreviewProps = {
  /** full JSON document from your API */
  doc?: any;
  /** raw HTML string from your API */
  html?: string;
  /** the root block ID in your doc */
  rootBlockId?: string;
};

export default function CustomPreview({
  doc,
  html,
  rootBlockId = 'root',
}: CustomPreviewProps) {
  // 1) If you have a JSON doc, use the Reader
  if (doc) {
    return (
      <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <Reader document={doc} rootBlockId={rootBlockId} />
      </Box>
    );
  }
  // 2) Otherwise, if you only have HTML, just dangerouslySetInnerHTML
  if (html) {
    return (
      <Box
        sx={{ width: '100%', height: '100%', overflow: 'auto', p: 2 }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  // 3) Nothing to show
  return <Box>— No preview available —</Box>;
}
