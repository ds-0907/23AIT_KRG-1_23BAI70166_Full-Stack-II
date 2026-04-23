import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = "http://localhost:8080/api";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState('login'); // login, signup, dashboard, create-poll
  const [polls, setPolls] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      // Decode token roughly to get info (or ideally call a /me endpoint)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ username: payload.sub, roles: payload.roles || [] });
        setView('dashboard');
        fetchPolls(token);
      } catch (e) {
        logout();
      }
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setView('login');
  };

  const fetchPolls = async (t) => {
    const res = await fetch(`${API_BASE}/polls`, {
      headers: { 'Authorization': `Bearer ${t}` }
    });
    if (res.ok) {
      const data = await res.json();
      setPolls(data);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch(`${API_BASE}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData))
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
    } else {
      setMessage('Login failed');
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    const res = await fetch(`${API_BASE}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ optionIndex })
    });
    if (res.ok) {
      setMessage('Vote cast successfully!');
      fetchPolls(token);
    } else {
      setMessage('Voting failed (maybe you already voted?)');
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const question = formData.get('question');
    const options = formData.get('options').split(',').map(s => s.trim());
    
    const res = await fetch(`${API_BASE}/polls`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ question, options })
    });
    if (res.ok) {
      setMessage('Poll created!');
      setView('dashboard');
      fetchPolls(token);
    }
  };

  if (view === 'login') {
    return (
      <div className="auth-container">
        <h1>LivePoll Login</h1>
        {message && <p className="error">{message}</p>}
        <form onSubmit={handleLogin}>
          <input name="username" placeholder="Username" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Sign In</button>
        </form>
        <hr />
        <button className="google-btn" onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}>
          Sign in with Google
        </button>
        <p>Try admin/admin123 or user/user123</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h2>LivePoll</h2>
        <div className="user-info">
          <span>Welcome, {user?.username} ({user?.roles?.join(', ')})</span>
          {user?.roles?.includes('ROLE_ADMIN') && (
            <button onClick={() => setView(view === 'create-poll' ? 'dashboard' : 'create-poll')}>
              {view === 'create-poll' ? 'Back to Polls' : 'Create Poll'}
            </button>
          )}
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {message && <div className="toast">{message}</div>}

      <main>
        {view === 'create-poll' ? (
          <div className="create-poll">
            <h3>Create New Poll</h3>
            <form onSubmit={handleCreatePoll}>
              <input name="question" placeholder="Poll Question" required />
              <textarea name="options" placeholder="Options (comma separated)" required></textarea>
              <button type="submit">Publish Poll</button>
            </form>
          </div>
        ) : (
          <div className="poll-list">
            <h3>Active Polls</h3>
            {polls.length === 0 && <p>No active polls found.</p>}
            {polls.map(poll => (
              <div key={poll.id} className="poll-card">
                <h4>{poll.question}</h4>
                <div className="options">
                  {poll.options.map((opt, idx) => (
                    <button key={idx} onClick={() => handleVote(poll.id, idx)}>{opt}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
