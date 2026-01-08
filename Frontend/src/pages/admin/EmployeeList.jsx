import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import EmployeeTable from '../../components/EmployeeTable';

const EmployeeList = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 overflow-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#0E7C86' }}>
                Employee Directory
              </h1>
              <p className="text-gray-600 text-sm font-medium">
                Manage and view all employees in your organization
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards - Optional */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4" style={{ borderColor: '#E0F2FE' }}>
            <p className="text-gray-600 text-xs font-semibold mb-1">Total Employees</p>
            <p className="text-2xl font-bold" style={{ color: '#0E7C86' }}>08</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4" style={{ borderColor: '#E0F2FE' }}>
            <p className="text-gray-600 text-xs font-semibold mb-1">Active</p>
            <p className="text-2xl font-bold" style={{ color: '#0E7C86' }}>07</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-4" style={{ borderColor: '#E0F2FE' }}>
            <p className="text-gray-600 text-xs font-semibold mb-1">Inactive</p>
            <p className="text-2xl font-bold" style={{ color: '#E53E3E' }}>01</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <EmployeeTable />
        </div>
      </main>
    </div>
  );
};

export default EmployeeList;
