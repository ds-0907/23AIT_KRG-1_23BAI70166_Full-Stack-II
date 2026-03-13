import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLogs } from "../store/logSlice";

const DashboardSummary = () => {
  const dispatch = useDispatch();
  const { data: logs, status, error } = useSelector((state) => state.logs);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLogs());
    }
  }, [status, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchLogs());
  };

  if (status === "loading") {
    return <div>Loading summary...</div>;
  }

  if (status === "failed") {
    return <div>Error loading data: {error}</div>;
  }

  const total = logs.reduce((acc, log) => acc + log.carbon, 0);

  return (
    <div>
      <h2>Carbon Footprint Summary</h2>
      <p>Total Carbon Footprint: {total} kg</p>
      <p>Total Activities: {logs.length}</p>
      <button onClick={handleRefresh}>Refresh Data</button>
    </div>
  );
};

export default DashboardSummary;