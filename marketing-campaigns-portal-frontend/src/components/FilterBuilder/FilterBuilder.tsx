import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Box,
  Button,
  Card,
  Tab,
  Tabs,
  Typography,
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  IconButton,
  Select,
  Container,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CloseRounded, DragIndicator } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { createCriteriaBlocks, getCriteriaBlocks, createOrUpdateFilter } from "../../api/apiClient";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store"; // 👈 Correct import
import { debounce } from "lodash";
import AudiencePreview from "./AudiencePreview";

interface FilterBuilderProps {
  mode?: "edit" | "create";
  initialData?: any;
  onSave?: (data: any) => void;
  onDiscard?: () => void;
}

interface Criteria {
  label: string;
  dataType: string;
  operator?: string; // Add operator as an optional property
}

const operators: any = {
  string: ["equals", "not equals", "contains", "startsWith", "endsWith"],
  number: ["equals", "not equals", "greaterThan", "lessThan"],
  date: ["before", "after", "on"],
};

const initialCriteriaTabs: Record<string, Criteria[]> = {
  Tab1: [],
  Tab2: [],
};

const ItemType = "CRITERIA";

interface DraggableItemProps {
  criteria: Criteria;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ criteria }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { criteria },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Box
      ref={drag as any}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        p: 1,
        border: "3px solid #ECEEF6",
        borderRadius: "10px",
        mb: 1,
        display: "flex",
        alignItems: "center",
        color: "#6D6976",
      }}
    >
      <DragIndicator />
      {criteria.label}
    </Box>
  );
};

interface GroupCriteria extends Criteria {
  operator: string;
  value: string;
}

interface DropGroupProps {
  groupId: number;
  items: GroupCriteria[];
  onDrop: (criteria: Criteria, groupId: number) => void;
  onRemove: (criteriaLabel: string, groupId: number) => void;
  onUpdate: (
    criteriaLabel: string,
    groupId: number,
    field: keyof GroupCriteria,
    value: string
  ) => void;
}

const DropGroup: React.FC<DropGroupProps> = ({
  groupId,
  items,
  onDrop,
  onRemove,
  onUpdate,
}) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item: { criteria: Criteria }) => {
      onDrop(item.criteria, groupId);
    },
  });

  return (
    <Box
      ref={drop as any}
      sx={{
        p: 0,
        minHeight: 100,
        mt: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: items.length === 0 ? "center" : "flex-start",
        alignItems: items.length === 0 ? "center" : "flex-start",
        textAlign: "center",
      }}
    >
      {items.length === 0 ? (
        <Box>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Drag and drop fields
          </Typography>
          <Typography variant="body2" sx={{ color: "#A3AABC" }}>
            Drag fields here to create custom filters
          </Typography>
        </Box>
      ) : (
        items.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1,
              border: "1px solid #ccc",
              mt: 1,
            }}
          >
            <Typography>{item.label}</Typography>
            <Select
              value={item.operator}
              onChange={(e) =>
                onUpdate(item.label, groupId, "operator", e.target.value)
              }
              size="small"
            >
              <MenuItem value=">">&gt;</MenuItem>
              <MenuItem value="<">&lt;</MenuItem>
              <MenuItem value="=">=</MenuItem>
            </Select>
            {item.dataType === "string" ? (
              <TextField
                size="small"
                value={item.value}
                onChange={(e) =>
                  onUpdate(item.label, groupId, "value", e.target.value)
                }
              />
            ) : (
              <TextField
                type="date"
                size="small"
                value={item.value}
                onChange={(e) =>
                  onUpdate(item.label, groupId, "value", e.target.value)
                }
              />
            )}
            <IconButton
              size="small"
              onClick={() => onRemove(item.label, groupId)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))
      )}
    </Box>
  );
};

const App: React.FC<FilterBuilderProps> = ({
  mode = "create",
  initialData,
  onSave,
  onDiscard,
}) => {
  const dispatch = useDispatch<AppDispatch>();      // 👈 Add <AppDispatch> here

  const [groupsByTab, setGroupsByTab] = useState<{ [tab: string]: any[] }>({});

  const [groupOperatorsByTab, setGroupOperatorsByTab] = useState<{ [tab: string]: { [groupId: number]: string } }>({});

  const [logicalOperatorsByTab, setLogicalOperatorsByTab] = useState<{ [tab: string]: { [index: number]: "AND" | "OR" } }>({
    Tab1: {},
    Tab2: {},
  });

  const [activeTab, setActiveTab] = useState<string>("Tab1");
  const [createBlockError, setCreateBlockError] = useState<string>("");
  const [groups, setGroups] = useState<any[]>([]);
  const [saveFilterName, setSaveFilterName] = useState("");
  const [saveDescription, setSaveDescription] = useState("");
  const [saveTags, setSaveTags] = useState("");
  const [isSaveFilterModalOpen, setIsSaveFilterModalOpen] = useState(false);
  const [estimatedAudience, setEstimatedAudience] = useState<number>(5000); // Static value
  const [criteriaTabs, setCriteriaTabs] = useState<any>(initialCriteriaTabs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCriteria, setNewCriteria] = useState<Criteria>({
    label: "",
    dataType: "string",
    operator: ""
  });

  const [currentTab, setCurrentTab] = useState<string>("");

  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string>("");

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState<string>("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setSaveFilterName(initialData.name || "");
      setSaveDescription(initialData.description || "");
      setSaveTags((initialData.tags || []).join(", "));
  
      const tabKey = "Tab1";
      const groups = initialData.groups || [];
  
      const formattedGroups = groups.map((group: any) => ({
        id: group.groupId, // ✅ use groupId directly
        criteria: group.conditions.map((c: any) => ({
          label: c.field,
          operator: c.operator,
          value: c.value,
          dataType: "string",
        })),
      }));
  
      const groupOps: any = {};
      const logicOps: any = {};
  
      groups.forEach((group: any, index: number) => {
        groupOps[group.groupId] = group.groupOperator;
        if (index > 0) logicOps[index] = initialData.logicalOperator || "OR";
      });
  
      setGroupsByTab({ [tabKey]: formattedGroups });
      setGroupOperatorsByTab({ [tabKey]: groupOps });
      setLogicalOperatorsByTab({ [tabKey]: logicOps });
      setActiveTab(tabKey);
    }
  }, [initialData, mode]);
  
  
  



  const showWarningModal = (message: string) => {
    setWarningMessage(message);
    setIsWarningModalOpen(true);
  };


  const handleCloseWarningModal = () => {
    setIsWarningModalOpen(false);
  };

  const showAlertModal = (message: string) => {
    setAlertModalMessage(message);
    setIsAlertModalOpen(true);
  };

  const handleCloseAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  const addGroup = () => {
    setGroupsByTab((prev) => {
      const currentGroups = prev[activeTab] || [];
      const newGroupId = currentGroups.length;
      return {
        ...prev,
        [activeTab]: [...currentGroups, { id: newGroupId, criteria: [] }],
      };
    });

    setGroupOperatorsByTab((prev) => {
      const currentGroupOperators = prev[activeTab] || {};
      return {
        ...prev,
        [activeTab]: { ...currentGroupOperators, [groupsByTab[activeTab]?.length || 0]: "AND" },
      };
    });
  };



  const handleDrop = (criteria: Criteria, groupId: number) => {
    setGroupsByTab((prev) => {
      const updatedGroups = prev[activeTab].map((group) => {
        if (group.id === groupId) {
          if (group.criteria.some((c: Criteria) => c.label === criteria.label)) {
            showAlertModal(`Cannot drag "${criteria.label}" as it already exists in this group.`);
            return group;
          }
          return {
            ...group,
            criteria: [...group.criteria, { ...criteria, operator: "=", value: "" }],
          };
        }
        return group;
      });
      return { ...prev, [activeTab]: updatedGroups };
    });
  };



  // 👇 Add this function inside your App component
  const handleUpdateItem = (
    criteriaLabel: string,
    groupId: number,
    field: keyof GroupCriteria,
    value: string
  ) => {
    setGroupsByTab((prev) => {
      const updatedGroups = prev[activeTab].map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            criteria: group.criteria.map((item: GroupCriteria) => {
              if (item.label === criteriaLabel) {
                return { ...item, [field]: value };
              }
              return item;
            }),
          };
        }
        return group;
      });

      return {
        ...prev,
        [activeTab]: updatedGroups,
      };
    });
  };


  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    const currentGroups = groupsByTab[activeTab] || [];
    if (currentGroups.some((group) => group.criteria.length > 0)) {
      showAlertModal("As already added 1 block, cannot switch tab");

      // Delay re-rendering to let modal render
      setTimeout(() => {
        setActiveTab(activeTab); // Reset to current tab to avoid tab switch
      }, 0);

      return;
    }

    setActiveTab(newValue);
  };


  const handleOpenModal = (tab: string) => {
    setCurrentTab(tab);
    setNewCriteria({ label: "", dataType: "string" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveCriteria = () => {
    if (!newCriteria.label.trim()) {
      showWarningModal("Name of Block cannot be empty.");
      return;
    }
    if (!["string", "date", "number"].includes(newCriteria.dataType)) {
      showWarningModal("Invalid Data Type selected.");
      return;
    }
    console.log("acitve tab", activeTab);
    console.log("new criteria", newCriteria);

    createCriteriaBlocks({
      name: newCriteria.label,
      type: newCriteria.dataType,
      category: activeTab === "Tab1" ? "filterComponent" : "triggerFilter",
      operators: [newCriteria.operator]
    })
      .then((res) => {
        console.log("res", res);
        showAlertModal(
          "Criteria Block created successfully. You can start adding to group panel"
        );
        fetchBlocks();
        handleCloseModal();
      })
      .catch((err) => {
        console.log("err", err);
        setCreateBlockError("Failed to craete block, please try again");
        handleCloseModal();
      });
    // handleCloseModal();
  };

  const handleDeleteGroup = (groupId: number) => {
    setGroupsByTab((prev) => {
      const updatedGroups = prev[activeTab].filter((group) => group.id !== groupId);
      return { ...prev, [activeTab]: updatedGroups };
    });

    setGroupOperatorsByTab((prev) => {
      const updated = { ...prev[activeTab] };
      delete updated[groupId];
      return { ...prev, [activeTab]: updated };
    });
  };


  const handleRemoveItem = (criteriaLabel: string, groupId: number) => {
    setGroupsByTab((prev) => {
      const updatedGroups = prev[activeTab].map((group: any) => {
        if (group.id === groupId) {
          const updatedCriteria = group.criteria.filter(
            (item: any) => item.label !== criteriaLabel
          );
          return { ...group, criteria: updatedCriteria };
        }
        return group;
      });
      return { ...prev, [activeTab]: updatedGroups };
    });
  };
  
  

  const fetchBlocks = () => {
    getCriteriaBlocks().then((res) => {
      console.log({ res });
      const tab1Data: any = [];
      const tab2Data: any = [];
      res.data.forEach((item: any) => {
        if (item.category === "filterComponent") {
          tab1Data.push({ label: item.name, dataType: item.type });
        } else if (item.category === "triggerFilter") {
          tab2Data.push({ label: item.name, dataType: item.type });
        }
      });
      setCriteriaTabs({
        Tab1: tab1Data,
        Tab2: tab2Data,
      });
    });
  };
  useEffect(() => {
    fetchBlocks();
  }, []);

  const [groupOperators, setGroupOperators] = useState<{ [groupId: number]: "AND" | "OR" }>({});
  const [logicalOperator, setLogicalOperator] = useState<"AND" | "OR">("OR");


  const handleInputChange = (groupId: number, criteriaLabel: string, field: string, value: string) => {
    setGroupsByTab((prev) => {
      const updatedGroups = prev[activeTab].map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            criteria: group.criteria.map((item: Criteria) => {
              if (item.label === criteriaLabel) {
                return { ...item, [field]: value };
              }
              return item;
            }),
          };
        }
        return group;
      });
      return { ...prev, [activeTab]: updatedGroups };
    });
  };



  const handleSaveFilter = () => {
    const groups = groupsByTab[activeTab];
  
    if (!groups || groups.length === 0) {
      showWarningModal("Please create at least one group before saving.");
      return;
    }
  
    for (const group of groups) {
      if (!group.criteria || group.criteria.length === 0) {
        showWarningModal("Each group must have at least one criteria block.");
        return;
      }
      for (const criteria of group.criteria) {
        if (!criteria.value || criteria.value.trim() === "") {
          showWarningModal(`Please fill all input values inside Group ${group.id + 1}.`);
          return;
        }
      }
    }
  
    // ✅ Passed all criteria checks — reset modal fields and open modal
    setSaveFilterName("");
    setSaveDescription("");
    setSaveTags("");
    setIsSaveFilterModalOpen(true);
  };
  
  const handleConfirmSaveFilter = async () => {
    if (!saveFilterName.trim()) {
      showWarningModal("Filter Name is required.");
      return;
    }

    if (!saveDescription.trim()) {
      showWarningModal("Description is required.");
      return;
    }

    const groups = groupsByTab[activeTab];
    if (!groups || groups.length === 0) {
      showWarningModal("Please create at least one group before saving.");
      return;
    }

    for (const group of groups) {
      if (!group.criteria || group.criteria.length === 0) {
        showWarningModal("Each group must have at least one criteria block.");
        return;
      }
      for (const criteria of group.criteria) {
        if (!criteria.value || criteria.value.trim() === "") {
          showWarningModal(`Please fill all input values inside Group ${group.id + 1}.`);
          return;
        }
      }
    }

    const conditions = groups.map((group) => ({
      groupId: `group${group.id}`,
      groupOperator: groupOperatorsByTab[activeTab]?.[group.id] || "AND",
      criteria: group.criteria.map((criteria: any) => ({
        field: criteria.label,
        operator: criteria.operator,
        value: criteria.value,
      })),
    }));

    const payload = {
      name: saveFilterName.trim(),
      description: saveDescription.trim(),
      tags: saveTags.split(",").map((tag) => tag.trim()).filter(tag => tag),
      conditions,
      customFields: { region: "North America", campaign: "Summer Sale" },
      isDraft: false,
      logicalOperator:
        conditions.length > 1
          ? logicalOperatorsByTab[activeTab]?.[1] || "OR"
          : undefined,
      estimatedAudience,
    };

    try {
      if (mode === "edit" && onSave) {
        onSave(payload); // pass data to parent (EditFilter page)
      } else {
        await createOrUpdateFilter(payload);
        alert("Filter Saved Successfully!");
        setIsSaveFilterModalOpen(false);
      }
    } catch (error) {
      console.error("Error saving filter:", error);
      setIsSaveFilterModalOpen(false);
    }
  };


  const handleSaveDraftFilter = async () => {
    if (!saveFilterName.trim()) {
      showWarningModal("Filter Name is required.");
      return;
    }

    if (!saveDescription.trim()) {
      showWarningModal("Description is required.");
      return;
    }

    const groups = groupsByTab[activeTab];

    if (!groups || groups.length === 0) {
      showWarningModal("Please create at least one group before saving.");
      return;
    }

    for (const group of groups) {
      if (!group.criteria || group.criteria.length === 0) {
        showWarningModal("Each group must have at least one criteria block.");
        return;
      }
      for (const criteria of group.criteria) {
        if (!criteria.value || criteria.value.trim() === "") {
          showWarningModal(`Please fill all input values inside Group ${group.id + 1}.`);
          return;
        }
      }
    }

    const conditions = groups.map((group) => ({
      groupId: `group${group.id}`,
      groupOperator: groupOperatorsByTab[activeTab]?.[group.id] || "AND",
      criteria: group.criteria.map((criteria: any) => ({
        field: criteria.label,
        operator: criteria.operator,
        value: criteria.value,
      })),
    }));

    const payload = {
      name: saveFilterName.trim(),
      description: saveDescription.trim(),
      tags: saveTags.split(",").map((tag) => tag.trim()).filter(tag => tag),
      conditions,
      customFields: { region: "North America", campaign: "Summer Sale" },
      isDraft: true,
      logicalOperator:
        conditions.length > 1
          ? logicalOperatorsByTab[activeTab]?.[1] || "OR"
          : undefined,
      estimatedAudience,
    };

    try {
      await createOrUpdateFilter(payload);
      alert("Draft Saved Successfully!");
      setIsSaveFilterModalOpen(false);
    } catch (error) {
      console.error("Error saving draft:", error);
      setIsSaveFilterModalOpen(false);
    }
  };


  return (
    <Container>
      <Box>
        <Box sx={{ m: 2 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Build Your Audience Filter
          </Typography>
          {mode === "edit" && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500, mb: 3 }}>
              <TextField
                label="Filter Name"
                value={saveFilterName}
                onChange={(e) => setSaveFilterName(e.target.value)}
                required
              />
              <TextField
                label="Description"
                value={saveDescription}
                onChange={(e) => setSaveDescription(e.target.value)}
                required
              />
              <TextField
                label="Tags (comma separated)"
                value={saveTags}
                onChange={(e) => setSaveTags(e.target.value)}
              />
            </Box>
          )}

        </Box>
        <DndProvider backend={HTML5Backend}>
          <Box sx={{ display: "flex", gap: 2, p: 2 }}>
            <Card sx={{ p: 2, width: 300 }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                {Object.keys(criteriaTabs).map((tab, index) => (
                  <Tab
                    key={tab}
                    label={index == 0 ? "Filter Components" : "Trigger Filters"}
                    value={tab}
                  />
                ))}
              </Tabs>
              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{
                    mt: 2,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#F8F9FA",
                    borderRadius: "8px",
                    padding: "4px 8px",
                  }}
                >
                  <IconButton size="small" sx={{ color: "#A2A2A2" }}>
                    {/* <SearchIcon fontSize="small" /> */}
                  </IconButton>
                  <TextField
                    placeholder="Search Fields"
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      style: { color: "#A2A2A2" },
                    }}
                    fullWidth
                    sx={{
                      backgroundColor: "#F8F9FA",
                      borderRadius: "8px",
                      paddingLeft: "8px",
                    }}
                  />
                </Box>
                <Typography
                  sx={{ mb: 2, color: "#232232", fontWeight: "bold" }}
                >
                  Criteria Blocks
                </Typography>

                {criteriaTabs[activeTab].map((criteria: any) => (
                  <DraggableItem key={criteria.label} criteria={criteria} />
                ))}
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => handleOpenModal(activeTab)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontWeight: 600,
                    width: "100%",
                    mt: 2,
                    textTransform: "none",
                  }}
                >
                  <AddIcon fontSize="small" />
                  Add Custom Field
                </Button>
              </Box>

            </Card>
            <Card sx={{ p: 2, width: "50%" }}>
              <Typography variant="h6" sx={{}}>
                Filter Canvas
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2, color: "#A3AABC" }}>
                Create your custom filter by combining multiple conditions.
              </Typography>

              {(groupsByTab[activeTab] || []).map((group, index) => (
                <React.Fragment key={group.id}>
                  {/* Show 'Match groups with' only between groups */}
                  {index > 0 && (
                    <Box
                      sx={{
                        mt: 2,
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2">Match groups with:</Typography>
                      <Select
                        value={logicalOperatorsByTab[activeTab]?.[index] || "OR"}
                        onChange={(e) =>
                          setLogicalOperatorsByTab((prev) => ({
                            ...prev,
                            [activeTab]: {
                              ...prev[activeTab],
                              [index]: e.target.value as "AND" | "OR",
                            },
                          }))
                        }
                        size="small"
                      >
                        <MenuItem value="AND">AND</MenuItem>
                        <MenuItem value="OR">OR</MenuItem>
                      </Select>
                    </Box>
                  )}



                  {/* Group Box */}
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      border: "0.5px dashed #A3AABC",
                      borderRadius: "2px",
                      borderWidth: "3px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        Group {group.id + 1}
                      </Typography>
                      <Button
                        variant="text"
                        color="inherit"
                        size="small"
                        onClick={() => handleDeleteGroup(group.id)}
                        sx={{
                          color: "grey.600",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        Clear
                        <CloseRounded fontSize="small" />
                      </Button>
                    </Box>

                    {/* Inside group operator */}
                    <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2">Within group:</Typography>
                      <Select
                        value={groupOperatorsByTab[activeTab]?.[group.id] || "AND"}
                        onChange={(e) =>
                          setGroupOperatorsByTab((prev) => ({
                            ...prev,
                            [activeTab]: {
                              ...prev[activeTab],
                              [group.id]: e.target.value as "AND" | "OR",
                            },
                          }))
                        }
                        size="small"
                      >
                        <MenuItem value="AND">AND</MenuItem>
                        <MenuItem value="OR">OR</MenuItem>
                      </Select>
                    </Box>

                    {/* DropGroup */}
                    <DropGroup
                      groupId={group.id}
                      items={group.criteria}
                      onDrop={handleDrop}
                      onRemove={handleRemoveItem}
                      onUpdate={handleUpdateItem} // ✅ FIXED here
                    />

                  </Box>
                </React.Fragment>
              ))}


              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="text"
                  color="primary"
                  onClick={addGroup}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  <AddIcon fontSize="small" />
                  Add Group
                </Button>
              </Box>
              {/* Save Buttons */}
              {mode === "edit" ? (
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => onDiscard?.()}
                  >
                    Discard
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConfirmSaveFilter}
                  >
                    Save Changes
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleSaveDraftFilter}
                  >
                    Save Draft
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleSaveFilter}>
                    Save Filter
                  </Button>
                </Box>
              )}

            </Card>
            <Card sx={{ p: 2, width: 300 }}>
              <Typography variant="h6" sx={{}}>
                Filter Summary
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2, color: "#A3AABC" }}>
                Preview your audience
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 0, color: "#6D6976", fontWeight: 600 }}
              >
                Estimated Audience
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    marginRight: "4px",
                    marginBottom: "-4px",
                  }}
                >
                  {estimatedAudience}
                </Typography>
                <Typography sx={{ color: "#A3AABC" }}>people</Typography>
              </Box>
            </Card>
          </Box>
          {/* Save Filter Modal */}
          <Modal open={isSaveFilterModalOpen} onClose={() => setIsSaveFilterModalOpen(false)}>
            <Card sx={{ width: 400, p: 4, mx: "auto", mt: "10%", outline: "none" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Save Filter
              </Typography>

              <TextField
                fullWidth
                label="Filter Name"
                value={saveFilterName}
                onChange={(e) => setSaveFilterName(e.target.value)}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={saveDescription}
                onChange={(e) => setSaveDescription(e.target.value)}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Tags (comma separated)"
                value={saveTags}
                onChange={(e) => setSaveTags(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Button
                  onClick={() => setIsSaveFilterModalOpen(false)}
                  variant="outlined"
                  color="secondary"
                  sx={{ width: "48%" }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmSaveFilter}
                  variant="contained"
                  color="primary"
                  sx={{ width: "48%" }}
                >
                  Save
                </Button>
            

              </Box>

            </Card>
          </Modal>
          <Dialog open={isModalOpen} onClose={handleCloseModal}>
            <DialogTitle>Add New Criteria Block</DialogTitle>
            <DialogContent>
              <TextField
                label="Name of Block"
                fullWidth
                margin="normal"
                value={newCriteria.label}
                onChange={(e) =>
                  setNewCriteria({ ...newCriteria, label: e.target.value })
                }
              />
              <Select
                label="Data Type"
                fullWidth
                value={newCriteria.dataType}
                onChange={(e) =>
                  setNewCriteria({
                    ...newCriteria,
                    dataType: e.target.value + "",
                  })
                }
                sx={{ mt: 2 }}
              >
                <MenuItem value="string">String</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="number">Number</MenuItem>
              </Select>
              <Select
                label="Operator"
                fullWidth
                value={newCriteria.dataType ? operators[newCriteria.dataType] : ""}
                onChange={(e) =>
                  setNewCriteria({
                    ...newCriteria,
                    operator: e.target.value || "",
                  })
                }
                sx={{ mt: 2 }}
              >
                {newCriteria.dataType &&
                  operators[newCriteria.dataType].map((operator: string) => (
                    <MenuItem key={operator} value={operator}>
                      {operator}
                    </MenuItem>
                  ))}
              </Select>
              <p>
                <small style={{ color: "red" }}>{createBlockError}</small>
              </p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button
                onClick={handleSaveCriteria}
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={isAlertModalOpen} onClose={handleCloseAlertModal}>
            <DialogTitle>Alert</DialogTitle>
            <DialogContent>
              <Typography>{alertModalMessage}</Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseAlertModal}
                variant="contained"
                color="primary"
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={isWarningModalOpen} onClose={handleCloseWarningModal}>
            <DialogTitle>Warning</DialogTitle>
            <DialogContent>
              <Typography>{warningMessage}</Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseWarningModal}
                variant="contained"
                color="primary"
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </DndProvider>
      </Box>
    </Container>
  );
};

export default App;
