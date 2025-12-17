// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminAttendance from './pages/AdminAttendance';
import UserAttendance from './pages/UserAttendance';

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