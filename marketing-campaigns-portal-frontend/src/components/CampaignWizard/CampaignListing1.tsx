import React, { useState, useMemo } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  List,
  ListItem,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  TextFieldProps ,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { DateRangePicker, DateRange } from "@mui/x-date-pickers-pro";

// Define Task type with createdAt field
interface Task {
  id: number;
  name: string;
  status: "On Going" | "Expired" | "Completed";
  type: "Criteria Based" | "Real Time" | "Scheduled";
  createdAt: string; // ISO date string
}

// Sample task data with createdAt dates.
const tasks: Task[] = [
  {
    id: 1,
    name: "Task One",
    status: "On Going",
    type: "Real Time",
    createdAt: "2025-03-24T10:30:00Z",
  },
  {
    id: 2,
    name: "Task Two",
    status: "Completed",
    type: "Scheduled",
    createdAt: "2025-03-23T09:15:00Z",
  },
  {
    id: 3,
    name: "Task Three",
    status: "Expired",
    type: "Criteria Based",
    createdAt: "2025-03-22T14:45:00Z",
  },
  {
    id: 4,
    name: "Task Four",
    status: "On Going",
    type: "Scheduled",
    createdAt: "2025-03-24T12:00:00Z",
  },
  {
    id: 5,
    name: "Task Five",
    status: "Completed",
    type: "Real Time",
    createdAt: "2025-03-21T08:00:00Z",
  },
];

const SearchFilter: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Newest");

  // DateRange state: [startDate, endDate]
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  // Dropdown change handlers
  const handleStatusChange = (event: SelectChangeEvent) =>
    setStatusFilter(event.target.value);
  const handleTypeChange = (event: SelectChangeEvent) =>
    setTypeFilter(event.target.value);
  const handleSortChange = (event: SelectChangeEvent) =>
    setSortBy(event.target.value);

  // Filter and sort tasks using useMemo for optimal performance.
  const filteredTasks = useMemo(() => {
    let result = tasks.filter((task) => {
      // Search Filter
      const matchesQuery = task.name.toLowerCase().includes(query.toLowerCase());

      // Status Filter
      const matchesStatus =
        statusFilter === "All" ? true : task.status === statusFilter;

      // Type Filter
      const matchesType =
        typeFilter === "All" ? true : task.type === typeFilter;

      // Date Range Filter
      const taskDate = new Date(task.createdAt);
      let matchesDate = true;
      const [startDate, endDate] = dateRange;
      if (startDate && endDate) {
        // Check if taskDate is between startDate and endDate (inclusive)
        matchesDate =
          taskDate >= startDate &&
          taskDate <= new Date(endDate.getTime() + 24 * 60 * 60 * 1000 - 1);
      }

      // Combine all filters with AND logic
      return matchesQuery && matchesStatus && matchesType && matchesDate;
    });

    // Sorting logic
    switch (sortBy) {
      case "Newest":
        result = result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "Oldest":
        result = result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "Name (A to Z)":
        result = result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Name (Z to A)":
        result = result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    return result;
  }, [query, statusFilter, typeFilter, sortBy, dateRange]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h5" gutterBottom>
            Advanced Task Filter, Sort & Date Range
          </Typography>

          {/* Search Input */}
          <TextField
            label="Search..."
            variant="outlined"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Status Filter */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="On Going">On Going</MenuItem>
              <MenuItem value="Expired">Expired</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>

          {/* Type Filter */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={handleTypeChange}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Criteria Based">Criteria Based</MenuItem>
              <MenuItem value="Real Time">Real Time</MenuItem>
              <MenuItem value="Scheduled">Scheduled</MenuItem>
            </Select>
          </FormControl>

          {/* Sort By Dropdown */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} label="Sort By" onChange={handleSortChange}>
              <MenuItem value="Newest">Newest</MenuItem>
              <MenuItem value="Oldest">Oldest</MenuItem>
              <MenuItem value="Name (A to Z)">Name (A to Z)</MenuItem>
              <MenuItem value="Name (Z to A)">Name (Z to A)</MenuItem>
            </Select>
          </FormControl>

          {/* Date Range Picker */}
          <Box sx={{ mb: 2 }}>
          <DateRangePicker
            value={dateRange}
            onChange={(newValue) => setDateRange(newValue)}
            slotProps={{
              textField: {
                size: 'small',
                variant: 'outlined',
                // If you want a label, you can assign one here.
                // label: 'Date Range'
              }
            }}
          />
          </Box>

          {/* Task List */}
          <List>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <ListItem key={task.id}>
                  <div>
                    <strong>{task.name}</strong> <br />
                    <small>Status: {task.status}</small> <br />
                    <small>Type: {task.type}</small> <br />
                    <small>
                      Created At:{" "}
                      {new Date(task.createdAt).toLocaleString()}
                    </small>
                  </div>
                </ListItem>
              ))
            ) : (
              <Typography color="textSecondary">
                No results found
              </Typography>
            )}
          </List>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default SearchFilter;
