import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard.jsx';
import Materials from './pages/Materials.jsx';
import Transactions from './pages/Transactions.jsx';

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'materials', label: 'Materials' },
  { id: 'transactions', label: 'Stock Transactions' }
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    document.title = 'Manufacturing Inventory Tracker';
  }, []);

  const refreshData = () => setRefreshKey((key) => key + 1);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Bottle Production</p>
          <h1>Manufacturing Inventory Tracker</h1>
        </div>
      </header>

      <nav className="tabs" aria-label="Main navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main>
        {activeTab === 'dashboard' && <Dashboard refreshKey={refreshKey} />}
        {activeTab === 'materials' && (
          <Materials refreshKey={refreshKey} onDataChange={refreshData} />
        )}
        {activeTab === 'transactions' && (
          <Transactions refreshKey={refreshKey} onDataChange={refreshData} />
        )}
      </main>
    </div>
  );
}

export default App;
