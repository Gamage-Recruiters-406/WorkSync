import React from 'react';
import Login from './Pages/Login';
import SignUp from './Pages/Signup';
import { AdminDashboard } from './Pages/AdminDashboard';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Dashboard routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
       
       
        
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>

   );
}

export default App;