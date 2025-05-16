import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useNavigate } from "react-router-dom";
import SaveIcon from '@mui/icons-material/Save';
import AllModal from "../Modals/DeleteModal";
import { DynamicIconProps } from '../../types/modal';
import {
  Box,
  Button,
  Card,
  Tab,
  Tabs,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  IconButton,
  Select,
  Alert,
  InputBase,
  FormControl,
  InputLabel,

} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CloseRounded, DragIndicator } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { createCriteriaBlocks, getCriteriaBlocks, createOrUpdateFilter } from "../../api/apiClient";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

interface FilterBuilderProps {
  mode?: "edit" | "create";
  initialData?: any;
  onSave?: (data: any) => void;
  onDiscard?: () => void;
}

interface Criteria {
  label: string;
  dataType: string;
  operator?: string;
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
            ) : item.dataType === "date" ? (
              <TextField
                type="date"
                size="small"
                value={item.value}
                onChange={(e) =>
                  onUpdate(item.label, groupId, "value", e.target.value)
                }
              />
            ) : (
              <TextField
                type="number"
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
              <DeleteIcon fontSize="small" sx={{ "&:hover": { color: 'red' } }} />
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
  const navigate = useNavigate();
  const [groupsByTab, setGroupsByTab] = useState<{ [tab: string]: any[] }>({});
  const [groupOperatorsByTab, setGroupOperatorsByTab] = useState<{ [tab: string]: { [groupId: number]: string } }>({});
  const [logicalOperatorsByTab, setLogicalOperatorsByTab] = useState<{ [tab: string]: { [index: number]: "AND" | "OR" } }>({
    Tab1: {},
    Tab2: {},
  });

  const [activeTab, setActiveTab] = useState<string>("Tab1");
  const [createBlockError, setCreateBlockError] = useState<string>("");
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
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<{criteria: string[], filter:string[], main:string[]}>({criteria: [], filter: [], main: []});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isTypingFields, setIsTypingFields] = useState<{
    name: boolean;
    description: boolean;
    tags: boolean;
  }>({
    name: false,
    description: false,
    tags: false,
  })
  const [modalData, setModalData] = useState<{
    open: boolean;
    handleConfirm: () => void | ((id: string) => void) | (() => void);
    title: string; message: string;
    btntxt: string;
    icon: DynamicIconProps | undefined;
    color: string; handleClose: () => void;
  }>({
    open: false,
    handleConfirm: () => { },
    title: '',
    message: '',
    btntxt: '',
    icon: undefined,
    color: '',
    handleClose: () => { },
  });

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

  let mainError : string[] = []


  const handleClose = () => {
    setModalData(prev => ({ ...prev, open: false }))
  }

  const handleExit = () => {
    navigate("/filters?isDraft=false");
  }
  const handleDraftExit = () => {
    navigate("/filters?isDraft=true");
  }

  const handleBlockSuccess = () => {
    setModalData({
      open: true,
      handleConfirm: handleClose,
      title: 'Success',
      message: `"${newCriteria.label}" Criteria Block Saved Successfully`,
      handleClose: handleClose,
      btntxt: "Ok",
      icon: { type: "success" } as DynamicIconProps,
      color: "primary"
    });
  }

  const handleSuccess = () => {
    setModalData({
      open: true,
      handleConfirm: handleExit,
      title: 'Success',
      message: `"${saveFilterName}" Filter Saved Successfully`,
      handleClose: handleClose,
      btntxt: "Ok",
      icon: { type: "success" } as DynamicIconProps,
      color: "primary"
    });
  }

  const handleDraft = () => {
    setModalData({
      open: true,
      handleConfirm: handleDraftExit,
      title: 'Success',
      message: `Draft Saved Successfully`,
      handleClose: handleClose,
      btntxt: "Ok",
      icon: { type: "success" } as DynamicIconProps,
      color: "primary"
    });
  }

  

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
            // showAlertModal(`Cannot drag "${criteria.label}" as it already exists in this group.`);
            mainError.push(`Cannot drag "${criteria.label}" as it already exists in this group.`);
            setValidationError(prev => ({
              ...prev,
              main: [...prev.main, ...mainError]
            }));
            setTimeout(() => setValidationError(prev => ({ ...prev, main: [] })), 6000);
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
      // showAlertModal("As already added 1 block, cannot switch tab");
      mainError.push("As already added 1 block, cannot switch tab");
      setValidationError(prev => ({
        ...prev,
        main: [...prev.main, ...mainError]
      }));
      setTimeout(() => setValidationError(prev => ({ ...prev, main: [] })), 6000);
      return;

      // setTimeout(() => {
      //   setActiveTab(activeTab);
      // }, 0);
      // return;
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

  let criteriaError: string[] = [];

  const handleSaveCriteria = () => {

    if (!["string", "date", "number"].includes(newCriteria.dataType)) {
      criteriaError.push('Data Type is required.');
    }

    if (!newCriteria.label.trim()) {
      criteriaError.push('Block Name is required.');
    }

    if (!newCriteria.operator) {
      criteriaError.push('Operator field is required.');
    }

    if (!/^[a-zA-Z0-9\s]{3,30}$/.test(newCriteria.label)) {
      criteriaError.push('Block name should be 3-30 characters and contain only valid characters.');
    }

    if (criteriaError.length > 0) {
      setValidationError(prev => ({
        ...prev,
        criteria: [...prev.criteria, ...criteriaError]
      }));
      setTimeout(() => setValidationError(prev => ({ ...prev, criteria: [] })), 6000);
      return;
    }
    // console.log("acitve tab", activeTab);
    // console.log("new criteria", newCriteria);

    createCriteriaBlocks({
      name: newCriteria.label,
      type: newCriteria.dataType,
      category: activeTab === "Tab1" ? "filterComponent" : "triggerFilter",
      operators: [newCriteria.operator]
    })
      .then((res) => {
        console.log("res", res);
        handleBlockSuccess();
        fetchBlocks();
        handleCloseModal();
      })
      .catch((err) => {
        console.log("err", err);
        handleCloseModal();
      });
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

  /*
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
    };*/
  const handleSaveFilter = () => {
    const groups = groupsByTab[activeTab];

    if (!groups || groups.length === 0) {
      mainError.push("Please create at least one group before saving.");
    }

    for (const group of groups) {
      if (!group.criteria || group.criteria.length === 0) {
        mainError.push("Each group must have at least one criteria block.");
      }
      for (const criteria of group.criteria) {
        if (!criteria.value || criteria.value.trim() === "") {
          mainError.push(`Please fill all input values inside Group ${group.id + 1}.`);
        }
      }
    }

    if (mainError.length > 0) {
      console.log('main error set');
      setValidationError(prev => ({
        ...prev,
        main: [...prev.main, ...mainError]
      }));
      setTimeout(() => setValidationError(prev => ({ ...prev, main: [] })), 6000);
      return;
    }

    setSaveFilterName("");
    setSaveDescription("");
    setSaveTags("");
    setIsSaveFilterModalOpen(true);
  };

  let confirmFilterError: string[] = [];

  const handleConfirmSaveFilter = async () => {

    if (!saveFilterName.trim()) {
      confirmFilterError.push("Filter Name is required.");
    }

    if (!saveDescription.trim()) {
      confirmFilterError.push("Description is required.");
    }

    const groups = groupsByTab[activeTab];
    if (!groups || groups.length === 0) {
      confirmFilterError.push("Please create at least one group before saving.");
    }

    for (const group of groups) {
      if (!group.criteria || group.criteria.length === 0) {
        confirmFilterError.push("Each group must have at least one criteria block.");
      }
      for (const criteria of group.criteria) {
        if (!criteria.value || criteria.value.trim() === "") {
          confirmFilterError.push(`Please fill all input values inside Group ${group.id + 1}.`);
        }
      }
    }

    if (confirmFilterError.length > 0) {
      console.log('confirm filter error set');

      setValidationError(prev => ({
        ...prev,
        filter: [...prev.filter, ...confirmFilterError]
      }));
      setTimeout(() => setValidationError(prev => ({ ...prev, filter: [] })), 6000);
      return;
    }

    const conditions = groups.map((group, index) => {
      if (!group.groupId) {
        group.groupId = `group-${Date.now()}-${index}`;
      }

      return {
        groupId: group.groupId,
        groupOperator: groupOperatorsByTab[activeTab]?.[group.id] || "AND",
        criteria: group.criteria.map((criteria: any) => ({
          field: criteria.label,
          operator: criteria.operator,
          value: criteria.value,
        })),
      };
    });

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
        onSave(payload);
      } else {
        await createOrUpdateFilter(payload);
        handleSuccess();
      }
    } catch (error) {
      console.error("Error saving filter:", error);
      setIsSaveFilterModalOpen(false);
    }
  };

  const handleSaveDraftFilter = async () => {
    const groups = groupsByTab[activeTab];

    if (!groups || groups.length === 0) {
      mainError.push("Please create at least one group before saving.");
    }

    for (const group of groups) {
      if (!group.criteria || group.criteria.length === 0) {
        mainError.push("Each group must have at least one criteria block.");
      }
      for (const criteria of group.criteria) {
        if (!criteria.value || criteria.value.trim() === "") {
          mainError.push(`Please fill all input values inside Group ${group.id + 1}.`);
        }
      }
    }

    if (mainError.length > 0) {
      console.log('main error set');
      setValidationError(prev => ({
        ...prev,
        main: [...prev.main, ...mainError]
      }));
      setTimeout(() => setValidationError(prev => ({ ...prev, main: [] })), 6000);
      return;
    }

    const conditions = groups.map((group, index) => {
      if (!group.groupId) {
        group.groupId = `group-${Date.now()}-${index}`;
      }

      return {
        groupId: group.groupId,
        groupOperator: groupOperatorsByTab[activeTab]?.[group.id] || "AND",
        criteria: group.criteria.map((criteria: any) => ({
          field: criteria.label,
          operator: criteria.operator,
          value: criteria.value,
        })),
      };
    });

    const payload = {
      name: saveFilterName.trim() || "Untitled Draft",
      description: saveDescription.trim() || "Draft Description",
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
      handleDraft();
    } catch (error) {
      console.error("Error saving draft:", error);
      setIsSaveFilterModalOpen(false);
    }
  };


  return (

    <Box sx={{ minWidth: "100%" }}>
      <Box sx={{ m: 2 }}>
        <Box sx={{ position: 'relative', }}>
          {mode === 'create' &&
            (<><Typography variant="h4">
              Build Your Audience Filter
            </Typography>
              <Typography variant="body2" sx={{ color: "#626262", mt: 1 }}>
                "Use the tools below to define the exact audience you want to target. Drag, drop, or select options to create powerful filters with ease."
              </Typography></>
            )}

          {mode === "edit" ? (
            <Box sx={{ position: 'absolute', right: 0, top: 10 }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => onDiscard?.()}
                sx={{ minWidth: '160px', p: 1.1, fontSize: '14px' }}
              >
                <DeleteIcon />&nbsp;Discard
              </Button>

              <Button variant="contained" sx={{ minWidth: '160px', fontSize: '14px', bgcolor: '#0057D9', color: '#fff  ', p: 1.1, ml: 2, ":hover": { bgcolor: '#2068d5' } }}
                onClick={handleConfirmSaveFilter}>
                <SaveIcon /> &nbsp; Save Changes
              </Button>
            </Box>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSaveFilter} sx={{ position: 'absolute', right: 0, top: 10, minWidth: '160px', fontSize: '14px', bgcolor: '#0057D9', color: '#fff  ', p: 1.1, m: 0, ":hover": { bgcolor: '#2068d5' } }}>
              <SaveIcon />&nbsp;Save Filter
            </Button>
          )}
        </Box>

        {mode === "edit" && (
          <Box sx={{
            display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 500,
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
          }}>
            <InputBase
              value={saveFilterName}
              onChange={(e) => setSaveFilterName(e.target.value)}
              onFocus={() => setIsTypingFields(prev => ({ ...prev, name: true }))}
              onBlur={() => setIsTypingFields(prev => ({ ...prev, name: false }))}

              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '28px',
                  fontWeight: 'semi-bold',
                  boxShadow: isTypingFields.name
                    ? 'inset 0px 0px 10px rgb(213, 238, 255)'
                    : 'none',
                },
              }}
              required
            />
            <InputBase
              // label="Description"
              value={saveDescription}
              onChange={(e) => setSaveDescription(e.target.value)}
              onFocus={() => setIsTypingFields(prev => ({ ...prev, description: true }))}
              onBlur={() => setIsTypingFields(prev => ({ ...prev, description: false }))}
              required
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '14px',
                  color: '#626262',
                  // bgcolor: isTypingFields.description ? ' #f2f2f2' : "transparent",
                  boxShadow: isTypingFields.description
                    ? 'inset 0px 0px 10px rgb(213, 238, 255)'
                    : 'none',
                },
              }}
            />
            {(initialData?.tags?.length ?? 0) > 0 && (
              <InputBase
                // label="Tags (comma separated)"
                onFocus={() => setIsTypingFields(prev => ({ ...prev, tags: true }))}
                onBlur={() => setIsTypingFields(prev => ({ ...prev, tags: false }))}
                value={saveTags}
                onChange={(e) => setSaveTags(e.target.value)}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '12px',
                    color: '#626262',
                    boxShadow: isTypingFields.tags
                      ? 'inset 0px 0px 10px rgb(213, 238, 255)'
                      : 'none',
                  },
                }}
              />
            )}
          </Box>
        )}
      </Box>

      {validationError.main.length > 0 && (
            <Alert variant='outlined' severity="warning" sx={{ ml:2, mr:2 }}>
              {validationError.main[0]}
            </Alert>
          )}
      {/* <DndProvider backend={HTML5Backend}> */}
      <Box sx={{ display: "flex", gap: 2, p: 2 }}>
        <Card sx={{ p: 2, width: 335 }}>
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
              <InputLabel >
                <SearchIcon fontSize="small" sx={{ mt: 0.6, color: '#A2A2A2' }} />
              </InputLabel>
              <TextField
                placeholder="Search Fields"
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  style: { color: "#A2A2A2" },
                }}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value) }}
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
            <Box sx={{ maxHeight: '42vh', overflowY: 'auto', m: 2 }}>
              {criteriaTabs[activeTab]
                .filter((criteria: any) =>
                  typeof criteria.label === "string" &&
                  criteria.label.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((criteria: any) => (
                  <DraggableItem key={criteria.label} criteria={criteria} />
                ))}
            </Box>

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
        <Box sx={{ width: "50%" }}>
          <Card sx={{ p: 2, }}>
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
                      Group {index + 1}
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
                    onUpdate={handleUpdateItem}
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

          </Card>
          {
            mode === 'create' && (
              <Button
                variant="contained"
                color="success"
                onClick={handleSaveDraftFilter}
                sx={{ minWidth: '160px', p: 1.1, mt: 2, ml: 'auto', fontSize: '14px', display: 'flex', justifyContent: 'center', }}
              ><SaveIcon />&nbsp; Save Draft
              </Button>
            )
          }

        </Box>
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
      <Dialog open={isSaveFilterModalOpen} onClose={() => setIsSaveFilterModalOpen(false)}>

        <Box sx={{ bgcolor: '#0057D9', width: '100%', height: 35, display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ color: "white", ml: 2, mt: 0.5 }}>Save Filter</Typography>
          <IconButton onClick={() => setIsSaveFilterModalOpen(false)}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
        <Card sx={{ width: 400, p: 2, mx: "auto", outline: "none", }}>
        {validationError.filter.length > 0 && (
            <Alert variant='outlined' severity="warning" sx={{ mb: 1 }}>
              {validationError.filter[0]}
            </Alert>
          )}
               
          <FormControl variant="outlined" size="medium" sx={{ minWidth: { xs: '100%' }, bgcolor: "#F8F9FA", borderRadius: "6px", p: 1 }}>
            <InputLabel sx={{ display: 'flex' }}>
              Template Name<Typography color="red">*</Typography>
            </InputLabel>
            <InputBase
              value={saveFilterName}
              onChange={(e) => {
                const val = e.target.value;
                setSaveFilterName(val);
              }}
              sx={{
                width: "100%",
                pt: 0.5,
              }}
              required
              fullWidth
            />
          </FormControl>

          <FormControl variant="outlined" size="medium" sx={{ minWidth: { xs: '100%' }, bgcolor: "#F8F9FA", borderRadius: "6px", p: 1, mt: 2 }}>
            <InputLabel sx={{ display: 'flex' }}>
              Description<Typography color="red">*</Typography>
            </InputLabel>
            <InputBase
              value={saveDescription}
              onChange={(e) => setSaveDescription(e.target.value)}
              sx={{
                fontSize: "14px",
                width: "100%",
                pt: 0.5,
                mt: 2,
              }}
              required
              fullWidth
              multiline
              minRows={5}
            // inputRef={messageRef}
            />
          </FormControl>

          <FormControl variant="outlined" size="medium" sx={{ minWidth: { xs: '100%' }, bgcolor: "#F8F9FA", borderRadius: "6px", p: 1, mt: 2 }}>
            <InputLabel sx={{ display: 'flex' }}>
              Tags (comma separated)
            </InputLabel>
            <InputBase
              value={saveTags}
              onChange={(e) => setSaveTags(e.target.value)}
              sx={{
                width: "100%",
                pt: 0.5,
              }}
              fullWidth
            />
          </FormControl>

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
              sx={{ width: "48%", bgcolor: '#0057D9' }}
            >
              Save
            </Button>
          </Box>
        </Card>
      </Dialog>
      <Dialog open={isModalOpen} onClose={handleCloseModal} >
        <Box sx={{ width: '450px' }}>
          <Box sx={{ bgcolor: '#0057D9', width: '100%', height: 35, display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: "white", ml: 2, mt: 0.5 }}>Add New Criteria Block</Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
          <DialogContent>

            {validationError.criteria.length > 0 && (
              <Alert variant='outlined' severity="warning" sx={{ mb: 1 }}>
                {validationError.criteria[0]}
              </Alert>
            )}

            <FormControl variant="outlined" size="medium" sx={{ minWidth: { xs: '100%' }, bgcolor: "#F8F9FA", borderRadius: "6px", p: 1 }}>
              <InputLabel sx={{ display: 'flex' }}>
                Block Name<Typography color="red">*</Typography>
              </InputLabel>
              <InputBase
                value={newCriteria.label}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewCriteria({ ...newCriteria, label: val });
                }}
                required
                fullWidth
              />
            </FormControl>

            <FormControl fullWidth variant="outlined" size="medium" sx={{
              minWidth: 200, bgcolor: "#F8F9FA", borderRadius: "6px", mt: 2.5,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
            }}>
              <InputLabel sx={{ display: 'flex' }}>
                Data Type<Typography color="red">*</Typography>
              </InputLabel>
              <Select
                value={newCriteria.dataType || ''}
                label="Data Type"
                onChange={(e) =>
                  setNewCriteria({
                    ...newCriteria,
                    dataType: e.target.value + "",
                  })}
                required
                sx={{ color: "#6D6976", }}
              >
                {[
                  'string',
                  'date',
                  'number',
                ].map((c) => (
                  <MenuItem key={c} value={c} sx={{ color: "#6D6976", }}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" size="medium" sx={{
              minWidth: 200, bgcolor: "#F8F9FA", borderRadius: "6px", mt: 2.5,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
            }}>
              <InputLabel sx={{ display: 'flex' }}>
                Operator<Typography color="red">*</Typography>
              </InputLabel>
              <Select
                value={newCriteria.operator || ""}
                label="Operator"
                onChange={(e) =>
                  setNewCriteria({
                    ...newCriteria,
                    operator: e.target.value || "",
                  })
                }
                required
                sx={{ color: "#6D6976", }}
              >
                {newCriteria.dataType &&
                  operators[newCriteria.dataType].map((operator: string) => (
                    <MenuItem key={operator} value={operator} sx={{ color: "#6D6976", }}>
                      {operator}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

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
              sx={{ bgcolor: '#0057D9' }}
              disabled={!newCriteria.label || !newCriteria.dataType || !newCriteria.operator}
            >
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      

      <AllModal
        open={modalData.open}
        handleClose={modalData.handleClose}
        handleConfirm={modalData.handleConfirm}
        title={modalData.title}
        message={modalData.message}
        btntxt={modalData.btntxt}
        icon={modalData.icon}
        color={modalData.color}
      />
    </Box>

  );
};

export default App;
