import Dashboard from './pages/Dashboard';
import logs from './data/logs';
import Logs from './pages/Logs';

function App() {

  return (
    <div>
      <Dashboard prop={logs}/>
      <Logs logs = {logs}/>
    </div>
  )
}

export default App;