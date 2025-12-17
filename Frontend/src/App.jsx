import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './Dashboard';

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-mainbg flex">
      {/* Sidebar */}
      <div className={`${collapsed ? 'hidden' : 'block'} lg:block`}> 
        <Sidebar role="employee" activeItem="dashboard" />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <button
            className="mr-2 rounded-md bg-card p-2 shadow-sm lg:hidden"
            onClick={() => setCollapsed((s) => !s)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
        </div>

        <Dashboard />
      </div>
    </div>
  );
}

export default App;
