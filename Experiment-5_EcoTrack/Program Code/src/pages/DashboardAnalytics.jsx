import { useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLogs } from "../store/logSlice";
import { Card, CardContent, Typography, Button, CircularProgress, Box } from "@mui/material";

const DashboardAnalytics = () => {
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

  const analytics = useMemo(() => {
    const highCarbonCount = logs.filter(log => log.carbon >= 4).length;
    const lowCarbonCount = logs.filter(log => log.carbon < 4).length;
    const averageCarbon = logs.length > 0 ? (logs.reduce((acc, log) => acc + log.carbon, 0) / logs.length).toFixed(2) : 0;
    return { highCarbonCount, lowCarbonCount, averageCarbon };
  }, [logs]);

  if (status === "loading") {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  if (status === "failed") {
    return <Typography color="error">Error loading analytics: {error}</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Carbon Analytics</Typography>
        <Typography variant="body1">High Carbon Activities: {analytics.highCarbonCount}</Typography>
        <Typography variant="body1">Low Carbon Activities: {analytics.lowCarbonCount}</Typography>
        <Typography variant="body1">Average Carbon per Activity: {analytics.averageCarbon} kg</Typography>
        <Button variant="contained" onClick={handleRefresh} sx={{ mt: 2 }}>Refresh Analytics</Button>
      </CardContent>
    </Card>
  );
};

export default DashboardAnalytics;