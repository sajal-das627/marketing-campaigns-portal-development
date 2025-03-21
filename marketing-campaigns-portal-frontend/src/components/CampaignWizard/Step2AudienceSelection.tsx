import React, { useEffect, useState } from "react";
import { Box, Button, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import  { getFilters, applyFilter } from "../../api/apiClient";

const Step2AudienceSelection= ({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) => {
  const [filters, setFilters] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [matchedUsers, setMatchedUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await getFilters();
        setFilters(response.data);
      } catch (error) {
        console.error("Error fetching filters", error);
      }
    };
    fetchFilters();
  }, []);

  const handleApplyFilter = async () => {
    if (!selectedFilter) return;
    try {
      const response = await applyFilter(selectedFilter);
      setMatchedUsers(response.data);
    } catch (error) {
      console.error("Error applying filter", error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">🎯 Select Audience Filter</Typography>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Select a Filter</InputLabel>
        <Select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
          {filters.map((filter) => (
            <MenuItem key={filter._id} value={filter._id}>{filter.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleApplyFilter} disabled={!selectedFilter}>
        Apply Filter
      </Button>

      {matchedUsers.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">👥 Matched Users</Typography>
          <ul>
            {matchedUsers.map((user) => (
              <li key={user._id}>{user.firstName} {user.lastName} ({user.email})</li>
            ))}
          </ul>
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={onBack}>Back</Button>
        <Button variant="contained" sx={{ ml: 2 }} onClick={() => onNext({ audienceFilter: selectedFilter })} disabled={!selectedFilter}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Step2AudienceSelection;
