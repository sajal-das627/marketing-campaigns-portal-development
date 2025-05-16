import { Paper, Typography } from "@mui/material";
import { useDrag } from "react-dnd";
import { forwardRef } from "react";

const OperatorBlock = forwardRef<HTMLDivElement, { operator: string }>(({ operator }, ref) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "OPERATOR",
    item: { operator },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Paper
      ref={(node) => {
        drag(node); 
        if (typeof ref === "function") ref(node);
      }}
      component="div"
      sx={{
        padding: 2,
        backgroundColor: isDragging ? "#e0f7fa" : "#ffffff",
        border: "1px solid #ccc",
      }}
    >
      <Typography variant="body1">{operator}</Typography>
    </Paper>
  );
});

export default OperatorBlock;
