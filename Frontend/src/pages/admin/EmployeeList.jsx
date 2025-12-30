import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import EmployeeTable from '../../components/EmployeeTable';

const EmployeeList = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Employee List</h1>
        <p className="text-gray-600 text-sm mb-6">
          Manage and view all employees in your organization
        </p>
        <div className="bg-white rounded-lg shadow">
          <EmployeeTable />
        </div>
      </main>
    </div>
  );
};

export default EmployeeList;
