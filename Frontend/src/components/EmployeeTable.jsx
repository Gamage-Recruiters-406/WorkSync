import React, { useState } from 'react';
import { Eye, Edit2, Trash2, Plus } from 'lucide-react';

const EmployeeTable = () => {
  const [employees] = useState([
    {
      id: 1,
      name: 'Jennifer Hunt',
      employeeId: 'JN01901',
      role: 'Manager',
      department: 'Finance',
      status: 'Active',
    },
    {
      id: 2,
      name: 'John Davis',
      employeeId: 'JN01284',
      role: 'Manager',
      department: 'HR',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Emma Watson',
      employeeId: 'MV01556',
      role: 'Employee',
      department: 'Sales',
      status: 'Active',
    },
    {
      id: 4,
      name: 'William Brown',
      employeeId: 'WB01367',
      role: 'Employee',
      department: 'IT',
      status: 'Active',
    },
    {
      id: 5,
      name: 'Olivia Robinson',
      employeeId: 'QR11213',
      role: 'Manager',
      department: 'Operations',
      status: 'Active',
    },
    {
      id: 6,
      name: 'Liam Taylor',
      employeeId: 'LV01247',
      role: 'Employee',
      department: 'IT',
      status: 'Active',
    },
    {
      id: 7,
      name: 'Natalene W',
      employeeId: 'AM02761',
      role: 'Employee',
      department: 'Operations',
      status: 'Inactive',
    },
    {
      id: 8,
      name: 'Andrew Davies',
      employeeId: 'AD01442',
      role: 'Employee',
      department: 'Operations',
      status: 'Active',
    },
  ]);

  const getStatusColor = (status) => {
    return status === 'Active' ? '#00C853' : '#A0AEC0';
  };

  const handleAction = (action, employee) => {
    console.log(`${action} employee:`, employee);
  };

  return (
    <div className="relative">
      {/* Table Container */}
      <div
        className="bg-white rounded-lg border shadow-sm overflow-hidden"
        style={{
          borderColor: '#D9E2EC',
          padding: '24px',
        }}
      >
        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr
              className="border-b"
              style={{
                borderColor: '#D9E2EC',
              }}
            >
              <th
                className="text-left py-4 px-4 font-semibold text-sm"
                style={{ color: '#2D3748' }}
              >
                Name
              </th>
              <th
                className="text-left py-4 px-4 font-semibold text-sm"
                style={{ color: '#2D3748' }}
              >
                Employee ID
              </th>
              <th
                className="text-left py-4 px-4 font-semibold text-sm"
                style={{ color: '#2D3748' }}
              >
                Role
              </th>
              <th
                className="text-left py-4 px-4 font-semibold text-sm"
                style={{ color: '#2D3748' }}
              >
                Department
              </th>
              <th
                className="text-left py-4 px-4 font-semibold text-sm"
                style={{ color: '#2D3748' }}
              >
                Status
              </th>
              <th
                className="text-right py-4 px-4 font-semibold text-sm"
                style={{ color: '#2D3748' }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="border-b hover:bg-gray-50 transition-colors"
                style={{
                  borderColor: '#D9E2EC',
                  height: '60px',
                }}
              >
                <td
                  className="py-4 px-4 font-medium text-sm"
                  style={{ color: '#2D3748' }}
                >
                  {employee.name}
                </td>
                <td
                  className="py-4 px-4 text-sm"
                  style={{ color: '#718096' }}
                >
                  {employee.employeeId}
                </td>
                <td
                  className="py-4 px-4 text-sm"
                  style={{ color: '#718096' }}
                >
                  {employee.role}
                </td>
                <td
                  className="py-4 px-4 text-sm"
                  style={{ color: '#718096' }}
                >
                  {employee.department}
                </td>
                <td className="py-4 px-4">
                  <span
                    className="text-sm font-medium"
                    style={{ color: getStatusColor(employee.status) }}
                  >
                    {employee.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-end gap-2">
                    {/* View Button */}
                    <button
                      onClick={() => handleAction('View', employee)}
                      className="p-2 rounded-full hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                      style={{ color: '#0E7C86' }}
                      title="View"
                    >
                      <Eye size={18} />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleAction('Edit', employee)}
                      className="p-2 rounded-full hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                      style={{ color: '#0E7C86' }}
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleAction('Delete', employee)}
                      className="p-2 rounded-full hover:bg-red-50 transition-all duration-200 cursor-pointer"
                      style={{ color: '#0E7C86' }}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Employee Button */}
      <button
        className="fixed bottom-8 right-8 flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
        style={{
          backgroundColor: '#0E7C86',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#0A6670';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#0E7C86';
        }}
      >
        <Plus size={20} />
        Add New Employee
      </button>
    </div>
  );
};

export default EmployeeTable;
