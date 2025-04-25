

import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Button, Typography, TextField, MenuItem, Grid, Box, Modal, Paper, TextareaAutosize,
  Chip,
  Stack,
  IconButton,
  Tabs,
  Tab,
  Select
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getTemplates, getRecentlyUsedTemplates, toggleFavorite,
  getFavoriteTemplates, setFilters, setActiveTab, getTemplateById,
   clearSelectedTemplate, 
   updateTemplate,
    deleteTemplate, 
    restoreTemplate,
    duplicateTemplate, 
} from "../../redux/slices/templateSlice";
import { RootState } from "../../redux/store";
import { useDebounce } from "use-debounce";


const Templates = () => {

  const [tab, setTab] = React.useState(0);

  const dispatch = useDispatch();
  const {
    allTemplates = [], recentTemplates = [], favoriteTemplates = [],
    filters, totalPages, activeTab, selectedTemplate,
  } = useSelector((state: RootState) => state.template || {});

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editContent, setEditContent] = useState("");
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [totalLocalFavorites, setTotalLocalFavorites] = useState(1);

  useEffect(() => {
    dispatch(setFilters({ page: 1 }));
  }, [debouncedSearch, filters.type, filters.category, filters.sortBy, dispatch]);

  useEffect(() => {
    if (selectedTemplate) {
      setEditName(selectedTemplate.name);
      setEditContent(JSON.stringify(selectedTemplate.content, null, 2));
    }
  }, [selectedTemplate]);

  const buildQuery = () => {
    const query: any = { page: filters.page, limit: filters.limit };
    if (debouncedSearch?.trim()) query.search = debouncedSearch.trim();
    if (filters.type) query.type = filters.type;
    if (filters.category) query.category = filters.category;
    switch (filters.sortBy || "newest") {
      case "newest": query.sortBy = "createdAt"; query.order = "desc"; break;
      case "oldest": query.sortBy = "createdAt"; query.order = "asc"; break;
      case "nameAsc": query.sortBy = "name"; query.order = "asc"; break;
      case "nameDesc": query.sortBy = "name"; query.order = "desc"; break;
    }
    return query;
  };

  const refreshActiveTab = () => {
    const query = buildQuery();
    if (activeTab === "all") dispatch(getTemplates(query) as any);
    else if (activeTab === "recent") dispatch(getRecentlyUsedTemplates(query) as any);
    else if (activeTab === "favorite") dispatch(getFavoriteTemplates(query) as any);
  };

  useEffect(() => {
    refreshActiveTab();
  }, [dispatch, activeTab, filters.page, filters.limit, debouncedSearch, filters.type, filters.category, filters.sortBy]);

  useEffect(() => {
    if (activeTab === "favorite") {
      setTotalLocalFavorites(totalPages || 1);
    }
  }, [favoriteTemplates, activeTab, totalPages]);

  const handleTabChange = (tab: "all" | "recent" | "favorite") => {
    dispatch(setActiveTab(tab));
    dispatch(setFilters({ page: 1 }));
    setSearchTerm("");
  };

  const handleFavoriteToggle = async (templateId: string) => {
    await dispatch(toggleFavorite(templateId) as any);
    refreshActiveTab();
  };

  const handleViewTemplate = (templateId: string) => {
    dispatch(getTemplateById(templateId) as any);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(clearSelectedTemplate());
    refreshActiveTab();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ [e.target.name]: e.target.value, page: 1 }));
  };

  const handlePageChange = (direction: "next" | "prev") => {
    const newPage = direction === "next" ? filters.page + 1 : Math.max(filters.page - 1, 1);
    dispatch(setFilters({ page: newPage }));
  };

  const handleEditClick = async (id: string) => {
    await dispatch(getTemplateById(id) as any);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditName("");
    setEditContent("");
    dispatch(clearSelectedTemplate());
    refreshActiveTab();
  };

  const handleSaveEdit = async () => {
    if (selectedTemplate) {
      const updatedData = {
        ...selectedTemplate,
        name: editName,
        content: JSON.parse(editContent),
      };
      await dispatch(updateTemplate({ id: selectedTemplate._id, data: updatedData }) as any);
      setOpenEditModal(false);
      dispatch(clearSelectedTemplate());
      refreshActiveTab();
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      await dispatch(deleteTemplate(id) as any);
      refreshActiveTab();
    }
  };

  const handleRestoreTemplate = async (id: string) => {
    await dispatch(restoreTemplate(id) as any);
    refreshActiveTab();
  };

  const handleDuplicateTemplate = async (id: string) => {
    await dispatch(duplicateTemplate(id) as any);
    refreshActiveTab();
  };
  

  const templatesToShow =
    activeTab === "all" ? allTemplates :
      activeTab === "recent" ? recentTemplates :
        favoriteTemplates;

  const isTemplateFavorite = (template: any) =>
    template.isFavorite === true || template.favorite === true;

  const isLoading = () =>
    (activeTab === "all" && allTemplates.length === 0) ||
    (activeTab === "recent" && recentTemplates.length === 0) ||
    (activeTab === "favorite" && favoriteTemplates.length === 0);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Template Dashboard</Typography>


      <Box mb={2}>
        {(["all", "recent", "favorite"] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "contained" : "outlined"}
            onClick={() => handleTabChange(tab)}
            sx={{ mr: 2 }}
          >
            {tab === "all" ? "All Templates" : tab === "recent" ? "Recently Used" : "Favourites"}
          </Button>
        ))}
      </Box>

      {/* Filters */}
      <Grid container spacing={2} alignItems="center" mb={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search by templates or tags"
            fullWidth variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField select label="Type" name="type" fullWidth variant="outlined"
            value={filters.type || ""} onChange={handleFilterChange}>
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="Email">Email</MenuItem>
            <MenuItem value="SMS">SMS</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField select label="Category" name="category" fullWidth variant="outlined"
            value={filters.category || ""} onChange={handleFilterChange}>
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="Promotional">Promotional</MenuItem>
            <MenuItem value="Transactional">Transactional</MenuItem>
            <MenuItem value="Event Based">Event Based</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField select label="Sort by" name="sortBy" fullWidth variant="outlined"
            value={filters.sortBy || ""} onChange={handleFilterChange}>
            <MenuItem value="" disabled>Sort by</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="nameAsc">Name (A to Z)</MenuItem>
            <MenuItem value="nameDesc">Name (Z to A)</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {isLoading() ? (
        <Typography>Loading templates...</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>TEMPLATE</TableCell>
              <TableCell>TYPE</TableCell>
              <TableCell>LAST MODIFIED</TableCell>
              <TableCell>CATEGORY</TableCell>
              <TableCell>TAGS</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templatesToShow.map((template: any) => (
              <TableRow key={template._id}>
                <TableCell>
                  <Button onClick={() => handleFavoriteToggle(template._id)}>
                    {isTemplateFavorite(template) ? "★" : "☆"}
                  </Button>
                </TableCell>
                <TableCell>{template.name}</TableCell>
                <TableCell>{template.type}</TableCell>
                <TableCell>{new Date(template.lastModified).toLocaleString()}</TableCell>
                <TableCell>{template.category}</TableCell>
                <TableCell>{template.tags?.join(", ") || "—"}</TableCell>
                <TableCell>
                  <Button onClick={() => handleViewTemplate(template._id)}>View</Button>
                  <Button onClick={() => handleEditClick(template._id)}>Edit</Button>
                  <Button onClick={() => handleDuplicateTemplate(template._id)}>Duplicate</Button>
                  {template.isDeleted ? (
                    <Button color="success" onClick={() => handleRestoreTemplate(template._id)}>Restore</Button>
                  ) : (
                    <Button color="error" onClick={() => handleDeleteTemplate(template._id)}>Delete</Button>
                  )}

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Box mt={3}>
        <Button onClick={() => handlePageChange("prev")} disabled={filters.page === 1}>
          Previous
        </Button>
        <span style={{ margin: "0 10px" }}>
          Page {filters.page} of {activeTab === "favorite" ? totalLocalFavorites : totalPages}
        </span>
        <Button
          onClick={() => handlePageChange("next")}
          disabled={
            filters.page >= (activeTab === "favorite" ? totalLocalFavorites : totalPages ?? 1)
          }
        >
          Next
        </Button>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 3, minWidth: 400 }}>
          {selectedTemplate ? (
            <>
              <Typography variant="h6">{selectedTemplate.name}</Typography>
              <Typography>Type: {selectedTemplate.type}</Typography>
              <Typography>Category: {selectedTemplate.category}</Typography>
              <Typography>Last Modified: {new Date(selectedTemplate.lastModified).toLocaleString()}</Typography>
              <Typography>Tags: {selectedTemplate.tags?.join(", ") || "—"}</Typography>
              <Box mt={2}>
                <Button variant="contained" onClick={handleClose}>Close</Button>
              </Box>
            </>
          ) : (
            <Typography>Loading template...</Typography>
          )}
        </Paper>
      </Modal>

      <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <Box sx={{ p: 4, bgcolor: "background.paper", m: "auto", mt: 8, width: 500, borderRadius: 2 }}>
          {selectedTemplate ? (
            <>
              <Typography variant="h6" gutterBottom>Edit Template</Typography>
              <TextField
                fullWidth
                label="Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextareaAutosize
                minRows={10}
                style={{ width: "100%", padding: 10, fontFamily: "inherit", fontSize: 14 }}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button onClick={handleCloseEditModal} sx={{ mr: 1 }}>Cancel</Button>
                <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
              </Box>
            </>
          ) : (
            <Typography>Loading template...</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Templates;
