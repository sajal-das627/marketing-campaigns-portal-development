import React, { useEffect, useState } from "react";
import { Grid2 as Grid, Card, IconButton, CardActionArea, CardContent, Box, Typography, Button, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Types } from "mongoose";
import { CampaignData } from "../../types/campaign";
import FilterModal from './FilterModal';
import { generateStatement } from '../../utils/generateStatement'
import { fetchFilters } from "../../redux/slices/filterSlice"
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";

interface AudienceSelectorProps {
  handleChange: (event: any) => void;
  campaignData: CampaignData;
  audienceName: string;
  setAudienceName: React.Dispatch<React.SetStateAction<string>>;
}

const AudienceSelector: React.FC<AudienceSelectorProps> = ({ handleChange, campaignData, audienceName, setAudienceName }) => {

  const [isfilterModalId, setIsfilterModalId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // New state for debounced search
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { filters, currentPage, totalPages,
  } = useSelector(
    (state: RootState) => state.filter
  );

  useEffect(() => {
    dispatch(fetchFilters({ page, search: debouncedSearch,  }));
  }, [dispatch, page, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (campaignData.audience) {
      const selectedAudience = filters.find(
        (audience) => audience._id?.toString() === campaignData.audience?.toString()
      );
      if (selectedAudience) {
        setAudienceName(selectedAudience.name);
      }
    }
  })

  useEffect(() => {
    dispatch(fetchFilters({ page: 1, search: "", sortBy: "createdOn", order: "desc", /*isDraft: false*/ }));
  }, [dispatch]);

  const isSelected = (selectVal: number | string | Types.ObjectId) => {
    return campaignData.audience === selectVal ? '2px solid #007BFF' : '1px solid #ddd';
  };
  const handleFilterModal = (audienceId: string) => {
    setIsfilterModalId(audienceId);
  };
  const handleClose = () => {
    setIsfilterModalId(null);
  };

  return (
    <Box sx={{ boxSizing: 'border-box' }}>
      <Box display="flex"
        sx={{
          justifyContent: { md: "space-between", xs: "flex-start" },
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", sm: "flex-start", md: "center" }
        }} mt={2} mb={2}>
        <Box>
          <Typography variant="h6">Select Audience Filter</Typography>
          <Typography sx={{ color: "#626262", }}>Choose from saved filters or create new filter.</Typography>
        </Box>
        <Button variant="contained" onClick={() => navigate("/create-filters")}
          sx={{ bgcolor: '#0057D9', color: '#fff', fontSize: { xs: '12px', sm: '14px' }, p: 1, mt: { xs: 1, md: 0 }, ":hover": { bgcolor: '#2068d5' } }}>
          +&nbsp;Create&nbsp;New&nbsp;Filter</Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          placeholder="Search Filters"
          size="small"
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 250, backgroundColor: "#f5f5f5", mb: 2 }}
        />

        <Card sx={{ display: "flex", m: 1, p: 1, pl: 2, pr: 2 }}>
          <Box>
            <Typography sx={{ color: '#2068D5' }}>Selected Audience</Typography>

            <Typography variant="body1" fontWeight="bold" sx={{ m: 0.5, }}>
              {audienceName}
            </Typography>
          </Box>
        </Card>
      </Box>
      {filters.map((audience) => {
        const summary = generateStatement(
          [{
            ...audience,
            conditions: audience.conditions
          }],
          audience.logicalOperator
        );
        console.log('audience.conditions', audience.conditions);

        return (
          <React.Fragment key={audience._id?.toString()}>
            <Grid container spacing={2} mb={2}>
              <Grid size={{ xs: 12 }}>
                <Card
                  variant="outlined"
                  sx={{ border: isSelected(audience._id?.toString()) }}
                  onClick={() => {
                    handleChange({
                      target: { name: 'audience', value: audience._id?.toString() },
                    } as any);
                    setAudienceName(audience.name);
                  }}
                >
                  <CardActionArea>
                    <CardContent sx={{ display: 'flex' }}>
                      <Box
                        component="img"
                        src="/icons/criteriaBased_Campaign.png"
                        alt={`${audience.name} Icon`}
                        sx={{ width: 50, height: 50, mr: { xs: 1, md: 2 }, flexShrink: 0 }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {audience.name}
                        </Typography>
                        <Typography variant="body2" color="#626262">
                          {audience.description}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          marginLeft: 'auto',
                          color: '#495057',
                          fontSize: '14px',
                          borderLeft: '2px solid #ECEEF6',
                          paddingLeft: '8px',
                        }}
                      >
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFilterModal(audience._id?.toString() ?? '');
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <span>View</span>
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>

            {isfilterModalId === audience._id?.toString() && (
              <FilterModal
                open={true}
                onClose={handleClose}
                name={audience.name ?? ''}
                description={audience.description ?? ''}
                tags={audience.tags ?? []}
                createdOn={audience.createdAt ?? ''}
                audience={audience.audienceCount ?? 0}
                summary={summary}
              />
            )}
          </React.Fragment>
        );
      })}

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Button
          variant="outlined"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          sx={{ marginRight: "10px" }}
        >
          Previous
        </Button>
        <Typography>
          Page <strong>{currentPage || page}</strong> of <strong>{totalPages || 1}</strong>
        </Typography>
        <Button
          variant="outlined"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          sx={{ marginLeft: "10px" }}
        >
          Next
        </Button>
      </div>

    </Box>
  );
};

export default AudienceSelector;
