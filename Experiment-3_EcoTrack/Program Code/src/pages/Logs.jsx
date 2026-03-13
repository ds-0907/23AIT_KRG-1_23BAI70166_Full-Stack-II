import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLogs } from "../store/logSlice";

const Logs = () => {
  const dispatch = useDispatch();
  const { data: logs, status, error } = useSelector((state) => state.logs);
  
  const handleRefresh = () => {
    dispatch(fetchLogs());
  }

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLogs());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <div>Loading logs...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const filteredArray = logs.filter((log) => log.carbon >= 4);
  const lowCarbonArray = logs.filter((log) => log.carbon < 4);

  return (
    <div>
      <h2>High Carbon Activity</h2>
      {filteredArray.map((log) => (
        <div style={{ color: "red" }} key={log.id}>
          {log.activity} = {log.carbon} Kg
        </div>
      ))}
      <h2>Low Carbon Activity</h2>
      {lowCarbonArray.map((log) => (
        <div style={{ color: "green" }} key={log.id}>
          {log.activity} = {log.carbon} Kg
        </div>
      ))}
      <br />
      <button onClick={handleRefresh}>Refresh Logs</button>
    </div>
  );
};

export default Logs;