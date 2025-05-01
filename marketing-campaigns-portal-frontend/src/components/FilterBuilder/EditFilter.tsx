import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFilterById, updateFilter } from "../../api/apiClient"; // ✅ ensure getFilterById exists
import FilterBuilder from "./FilterBuilder";

const EditFilter: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState<any>(null);

  useEffect(() => {
    const fetchFilter = async () => {
      try {
        const response = await getFilterById(id as string);
        console.log("Fetched filter data 1:", response);
        setFilterData(response);
      } catch (error) {
        console.error("Failed to load filter:", error);
        alert("Failed to load filter data");
        navigate("/filters");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFilter();
  }, [id, navigate]);

  const handleSave = async (updatedData: any) => {
    try {
      await updateFilter(id as string, updatedData);
      alert("Filter updated successfully!");
      navigate("/filters");
    } catch (error) {
      console.error("Failed to update filter:", error);
      alert("Update failed.");
    }
  };

  const handleDiscard = () => {
    if (window.confirm("Discard changes and return to Manage Filters?")) {
      navigate("/filters");
    }
  };

  if (loading) return <div>Loading filter...</div>;

  return (
    <FilterBuilder
      mode="edit"
      initialData={filterData}
      onSave={handleSave}
      onDiscard={handleDiscard}
    />
  );
};

export default EditFilter;
