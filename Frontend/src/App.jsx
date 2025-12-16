// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminAttendance from './pages/AdminAttendance/AdminAttendance';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/attendance" element={<AdminAttendance />} />
      </Routes>
    </Router>
  );
}

export default App;