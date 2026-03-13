import { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogs } from "../features/logsSlice";

const Logs = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.logs);

  const handleRefresh = useCallback(() => {
    dispatch(fetchLogs());
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle"){
      dispatch(fetchLogs());
    }
  }, [status, dispatch]);

  const totalCarbon = useMemo(() => {
    return data.reduce((acc, log) => acc + log.carbon, 0);
  }, [data]);

  if(status === "loading"){
    return <p>Loading Logs...</p>;
  }
  if (status === "failed"){
    return <p>Error: {error}</p>;
  }
  return (
    <div>
      <h1>Daily Logs (Redux)</h1>
      <ol>
        {data.map((log) => (
          <li key={log.id}>
            {log.activity} - {log.carbon} kg CO₂
          </li>
        ))}
      </ol>
      <h3>Total Carbon: {totalCarbon} kg CO₂</h3>

      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
};

export default Logs;