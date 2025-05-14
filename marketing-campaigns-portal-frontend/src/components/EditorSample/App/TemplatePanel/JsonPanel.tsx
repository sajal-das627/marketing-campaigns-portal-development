import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { useDocument } from '../../documents/editor/EditorContext';

import HighlightedCodePanel from './helper/HighlightedCodePanel';

export default function JsonPanel() {
  const document = useDocument();
  const code = useMemo(() => JSON.stringify(document, null, '  '), [document]);
  return (
    <Box sx={{'&*':{color:'white'}}}>
      <HighlightedCodePanel type="json" value={code}/>
    </Box>
  )
}
