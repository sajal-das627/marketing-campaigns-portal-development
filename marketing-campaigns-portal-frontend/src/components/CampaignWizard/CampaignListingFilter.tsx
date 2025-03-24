import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface FilterProps {
    onSearch: (searchTerm: string) => void;
    onStatusChange: (status: string) => void;
    onTypeChange: (type: string) => void;
    onDateRangeChange: (range: string) => void;
    onSortChange: (sortBy: string) => void;
  }

const FilterBar: React.FC<FilterProps> = ({
  onSearch,
  onStatusChange,
  onTypeChange,
  onDateRangeChange,
  onSortChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [campaignType, setCampaignType] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [sortBy, setSortBy] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    onSearch(searchTerm);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    setStatus(value);
    onStatusChange(value);
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    setCampaignType(value);
    onTypeChange(value);
  };

  const handleDateRangeChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    setDateRange(value);
    onDateRangeChange(value);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    setSortBy(value);
    onSortChange(value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
        backgroundColor: '#F9F9F9',
        padding: '10px 20px',
        borderRadius: '10px',
      }}
    >
      {/* Search Input */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search for campaigns here..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ backgroundColor: '#FFFFFF', borderRadius: '5px' }}
        />
        <IconButton
          onClick={handleSearchSubmit}
          sx={{ ml: 1 }}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </Box>

      {/* Status Filter */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={status}
          label="Status"
          onChange={handleStatusChange}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="On Going">On Going</MenuItem>
          <MenuItem value="Expired">Expired</MenuItem>
        </Select>
      </FormControl>

      {/* Type Filter */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={campaignType}
          label="Type"
          onChange={handleTypeChange}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="Real-time">Real-time</MenuItem>
          <MenuItem value="Scheduled">Scheduled</MenuItem>
          <MenuItem value="Criteria-Based">Criteria-Based</MenuItem>
        </Select>
      </FormControl>

      {/* Date Range Filter */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Date Range</InputLabel>
        <Select
          value={dateRange}
          label="Date Range"
          onChange={handleDateRangeChange}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
          <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
          <MenuItem value="Last 6 Months">Last 6 Months</MenuItem>
        </Select>
      </FormControl>

      {/* Sort By Filter */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          label="Sort By"
          onChange={handleSortChange}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="Date Published">Date Published</MenuItem>
          <MenuItem value="Open Rate">Open Rate</MenuItem>
          <MenuItem value="CTR">CTR</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterBar;
