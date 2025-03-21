import React from "react";
import { Container, Typography, Box, Tabs, Tab, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, Select, MenuItem, InputAdornment, IconButton, Menu } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const filters = [
  { name: "Young High-Spenders", tags: "High Value, Frequent Buyers", description: "This filter targets users aged 18-29 with high spending activity" },
  { name: "et blanditiis iate", tags: "High Value, Frequent Buyers", description: "Ex temporibus repudiandae recusandae." },
  { name: "quo ipsa quidem", tags: "High Value, Frequent Buyers", description: "Ipsa et quo quia." },
  { name: "tempore dolore esse", tags: "High Value, Frequent Buyers", description: "Et vel eos voluptates distinctio pariatur." }
];

const ManageFilters = () => {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Manage Filters
      </Typography>
      <Typography sx={{ marginBottom: "20px" }} variant="body2" color="textSecondary" gutterBottom>
        Save your current fiters for quick access and rouse. Revisit and edit draft filters anytime to refino your criteria. This fosture keeps your filters organized and within reach, streamining your workflow in one convenient place
      </Typography>

      <Box bgcolor="white" boxShadow={2} borderRadius={2} padding={2}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab sx={{ fontWeight: "600" }} label="Saved Filters" />
          <Tab sx={{ fontWeight: "600" }} label="Drafts" />
        </Tabs>

        <Box display="flex" justifyContent="space-between" alignItems="center" padding={2} bgcolor="white">

          <TextField
            variant="outlined"
            placeholder="Search Filters"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250, backgroundColor: "#f5f5f5" }}
          />

          <Select
            displayEmpty
            defaultValue=""
            variant="outlined"
            size="small"
            IconComponent={ExpandMoreIcon}
            sx={{ width: 120, backgroundColor: "#f5f5f5" }}
          >
            <MenuItem value="">Sort by</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="date">Date</MenuItem>
          </Select>
        </Box>


        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><Checkbox /></TableCell>
                <TableCell>FILTER NAME</TableCell>
                <TableCell>TAGS</TableCell>
                <TableCell>DESCRIPTION</TableCell>
                <TableCell>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filters.map((filter, index) => (
                <TableRow key={index}>
                  <TableCell><Checkbox /></TableCell>
                  <TableCell style={{ color: "#4170ba", fontWeight: "600" }}>{filter.name}</TableCell>
                  <TableCell style={{ fontWeight: "600" }}>{filter.tags}</TableCell>
                  <TableCell style={{ fontWeight: "600" }}>{filter.description}</TableCell>
                  <TableCell style={{ display: 'flex' }}>
                    <Button variant="contained" color="success" size="small" style={{ marginRight: 8 }}>Apply</Button>
                    <Button variant="contained" color="warning" size="small">Duplicate</Button>
                    <IconButton onClick={handleClick}>
                      <MoreVertIcon />
                    </IconButton>

                    <Menu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      <MenuItem onClick={handleClose}>Edit</MenuItem>
                      <MenuItem onClick={handleClose}>Delete</MenuItem>
                    </Menu>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ManageFilters;
