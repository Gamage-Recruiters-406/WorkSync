import React from 'react';
import DashboardSidebar from '../../components/sidebar/DashboardSidebar';
import DashboardHeader from '../../components/DashboardHeader';
import EmployeeTable from '../../components/EmployeeTable';

const EmployeeList = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <DashboardSidebar activeItem="User" />

      {/* Main Content */}
      <div className="flex-1 ml-60">
        {/* Header */}
        <DashboardHeader />

        {/* Content Area */}
        <main className="pt-24 pb-32 px-8" style={{ backgroundColor: '#FFFFFF' }}>
          {/* Page Title */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: '#2D3748' }}
            >
              Employee List
            </h1>
            <p style={{ color: '#718096' }} className="text-sm">
              Manage and view all employees in your organization
            </p>
          </div>

          {/* Employee Table */}
          <EmployeeTable />
        </main>
      </div>
    </div>
  );
};

export default EmployeeList;
