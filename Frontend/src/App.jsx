import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import ProjectsPage from './ProjectPage';
import Sidebar from './components/Sidebar';
import ProjectDetails from "./ProjectDetails";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#E5E7EB] flex  px-6 py-8">
        {/* <Sidebar role="admin" activeItem="system-settings" /> */}
        <Sidebar role="employee" activeItem="dashboard" />

        <main className='flex-1 px-8 py-6'>
          <Routes>
            <Route path="/projects" element={<ProjectsPage/>}></Route>
            <Route path="/projects/:id" element={<ProjectDetails />} />
          </Routes>

        </main>
      </div>
    </Router>
  );
}

export default App;
