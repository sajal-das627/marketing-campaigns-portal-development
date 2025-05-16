
import {
  editorStateStore,
} from '../../documents/editor/EditorContext';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { IconButton, Stack, Tooltip } from '@mui/material';

export default function UndoRedo (){
    
 const undo    = editorStateStore((s) => s.undo);
 const redo    = editorStateStore((s) => s.redo);
 const canUndo = editorStateStore((s) => s.canUndo());
 const canRedo = editorStateStore((s) => s.canRedo());

return(
  <Stack direction="row" spacing={1}>
    <Tooltip title="Undo">
      <span>
        <IconButton onClick={undo} disabled={!canUndo}>
          <UndoIcon />
        </IconButton>
      </span>
    </Tooltip>
    <Tooltip title="Redo">
      <span>
        <IconButton onClick={redo} disabled={!canRedo}>
          <RedoIcon />
        </IconButton>
      </span>
    </Tooltip>
  </Stack>
)};
