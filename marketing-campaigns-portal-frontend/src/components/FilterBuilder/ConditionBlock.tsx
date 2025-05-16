import { Paper, Typography } from "@mui/material";
import { useDrag } from "react-dnd";
import { forwardRef } from "react";

const ConditionBlock = forwardRef<HTMLDivElement, { condition: any }>(({ condition }, ref) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CONDITION",
    item: { condition },
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
      sx={{ padding: 2, backgroundColor: isDragging ? "#e0f7fa" : "#ffffff" }}
    >
      <Typography variant="body1">
        {condition.field} {condition.operator} {condition.value}
      </Typography>
    </Paper>
  );
});

export default ConditionBlock;
