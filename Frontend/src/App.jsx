import Sidebar from './components/Sidebar';
import UserLeaveManagement from './pages/userLeaveManagement';

function App() {
  return (
    <div className="min-h-screen bg-[#E5E7EB] flex gap-6 px-6 py-8">
      {/* <Sidebar role="admin" activeItem="system-settings" /> */}
      <Sidebar role="employee" activeItem="dashboard" />
      <UserLeaveManagement />
    </div>
  );
}

export default App;
