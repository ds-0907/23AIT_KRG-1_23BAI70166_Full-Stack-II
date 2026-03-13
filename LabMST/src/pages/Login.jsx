import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate('/dashboard');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>EcoTrack</h1>
        <p style={styles.subtitle}>Sign in to continue</p>
        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>
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
    minWidth: '340px',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '32px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#fff',
    background: '#2563eb',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s',
  },
};

export default Login;
