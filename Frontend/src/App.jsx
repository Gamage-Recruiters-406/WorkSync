// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminAttendance from './pages/admin/AdminAttendance';
import UserAttendance from './pages/employee/UserAttendance';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/attendance" element={<AdminAttendance />} />
        <Route path="/user/attendance" element={<UserAttendance />} />
      </Routes>
    </Router>
  );
}

export default App;