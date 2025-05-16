import  { useEffect, useState } from "react";
import { Box, List, ListItem, ListItemText, Typography, Button } from "@mui/material";
import  { getFilters, applyFilter } from "../../api/apiClient";

const SavedFilters = () => {
  const [filters, setFilters] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

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

  const handleApplyFilter = async (filterId: string) => {
    try {
      const response = await applyFilter(filterId);
      setSelectedUsers(response.data);
    } catch (error) {
      console.error("Error applying filter", error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5">📂 Saved Filters</Typography>
      <List>
        {filters.map((filter) => (
          <ListItem key={filter._id} sx={{ borderBottom: "1px solid #ddd" }}>
            <ListItemText primary={filter.name} />
            <Button variant="outlined" onClick={() => handleApplyFilter(filter._id)}>Apply</Button>
          </ListItem>
        ))}
      </List>

      {selectedUsers.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">👥 Matched Users</Typography>
          <List>
            {selectedUsers.map((user) => (
              <ListItem key={user._id}>
                <ListItemText primary={`${user.firstName} ${user.lastName}`} secondary={user.email} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default SavedFilters;
