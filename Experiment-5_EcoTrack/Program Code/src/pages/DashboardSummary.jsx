import { useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLogs } from "../store/logSlice";
import { Card, CardContent, Typography, Button, CircularProgress, Box } from "@mui/material";

const DashboardSummary = () => {
  const dispatch = useDispatch();
  const { data: logs, status, error } = useSelector((state) => state.logs);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLogs());
    }
  }, [status, dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchLogs());
  }, [dispatch]);

  const total = useMemo(() => {
    return logs.reduce((acc, log) => acc + log.carbon, 0);
  }, [logs]);

  if (status === "loading") {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  if (status === "failed") {
    return <Typography color="error">Error loading data: {error}</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Carbon Footprint Summary</Typography>
        <Typography variant="body1">Total Carbon Footprint: {total} kg</Typography>
        <Typography variant="body1">Total Activities: {logs.length}</Typography>
        <Button variant="contained" onClick={handleRefresh} sx={{ mt: 2 }}>Refresh Data</Button>
      </CardContent>
    </Card>
  );
};

export default DashboardSummary;