const Dashboard = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to EcoTrack Dashboard</h1>
        <p style={styles.subtitle}>You are successfully logged in.</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f8f9fa',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '48px 40px',
    textAlign: 'center',
    border: '1px solid #e5e7eb',
    minWidth: '400px',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
  },
};

export default Dashboard;
