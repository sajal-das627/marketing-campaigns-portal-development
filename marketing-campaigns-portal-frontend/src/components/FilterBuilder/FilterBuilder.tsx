import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import  { createFilter } from "../../api/apiClient";
import ConditionBlock from "./ConditionBlock";
import OperatorBlock from "./OperatorBlock";
import AudiencePreview from "./AudiencePreview";

const FilterBuilder = () => {
  const [filterName, setFilterName] = useState("");
  const [filters, setFilters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addCondition = (condition: any) => setFilters((prev) => [...prev, condition]);
  const addOperator = (operator: string) => setFilters((prev) => [...prev, { type: "operator", operator }]);

  const handleSaveFilter = async () => {
    if (!filterName) return alert("Filter name is required!");
    setLoading(true);
    try {
      await createFilter({ name: filterName, conditions: filters });
      alert("🎉 Filter saved successfully!");
      setFilters([]); // Reset conditions after saving
    } catch (error) {
      alert("❌ Error saving filter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">🧩 Audience Filter Builder</Typography>

      <TextField
        label="Filter Name"
        fullWidth
        sx={{ mt: 2 }}
        value={filterName}
        onChange={(e) => setFilterName(e.target.value)}
      />

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button variant="contained" onClick={() => addCondition({ field: "Age", operator: ">", value: 18 })}>
          + Add Age Condition
        </Button>
        <Button variant="contained" onClick={() => addCondition({ field: "Location", operator: "=", value: "New York" })}>
          + Add Location Condition
        </Button>
        <Button variant="outlined" onClick={() => addOperator("AND")}>AND</Button>
        <Button variant="outlined" onClick={() => addOperator("OR")}>OR</Button>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3 }}>
        {filters.map((item, index) =>
          item.type === "operator" ? (
            <OperatorBlock key={index} operator={item.operator} />
          ) : (
            <ConditionBlock key={index} condition={item} />
          )
        )}
      </Box>

      <AudiencePreview filters={filters} />

      <Button variant="contained" color="success" sx={{ mt: 3 }} onClick={handleSaveFilter} disabled={loading}>
        {loading ? "Saving..." : "Save Filter"}
      </Button>
    </Box>
  );
};

export default FilterBuilder;
