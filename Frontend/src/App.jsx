// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminAttendance from './pages/AdminAttendance';
import UserAttendance from './pages/UserAttendance';
import CreateTaskForm from './components/CreateTaskForm';
import TaskHistory from './components/TaskHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/attendance" element={<AdminAttendance />} />
        <Route path="/user/attendance" element={<UserAttendance />} />
       
        
          <Route path="/create-task" element={<CreateTaskForm />} />
          <Route path="/edit-task/:taskId" element={<CreateTaskForm />} />
          <Route path="/task-history" element={<TaskHistory />} />
      </Routes>
    </Router>
  );
}

export default App;