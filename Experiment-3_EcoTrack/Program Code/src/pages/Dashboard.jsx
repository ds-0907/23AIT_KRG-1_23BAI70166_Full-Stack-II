const Dashboard = ({ carbonLogs }) => {
  const total = carbonLogs.reduce((acc, x) => {
    return acc + x.carbon;
  }, 0);

  return (
    <div>
      <p>Total Carbon Footprint: {total} kg</p>
      <ul>
        {carbonLogs.map((log) => (
          <li key={log.id}>
            {log.activity} = {log.carbon} kg
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;