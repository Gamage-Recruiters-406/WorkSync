import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DashboardSidebar from '../../components/sidebar/DashboardSidebar';
import DashboardHeader from '../../components/DashboardHeader';
import AddEmployeeImg from '../../assets/Addemployee.png';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Mock data for dropdowns
  const roles = [
    { value: 'Manager', label: 'Manager' },
    { value: 'Employee', label: 'Employee' },
    { value: 'Team Lead', label: 'Team Lead' },
    { value: 'Intern', label: 'Intern' },
  ];

  const departments = [
    { value: 'Finance', label: 'Finance' },
    { value: 'HR', label: 'HR' },
    { value: 'Sales', label: 'Sales' },
    { value: 'IT', label: 'IT' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Marketing', label: 'Marketing' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Generate a temporary password - can be changed by user later
      const tempPassword = Math.random().toString(36).slice(-8) + 'Temp@1';

      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role === 'Manager' ? 2 : 1, // 1: Employee, 2: Manager, 3: Admin
        password: tempPassword,
        departmentID: formData.department,
      };

      const response = await fetch('http://localhost:5000/api/v1/userAuth/userRegistration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success - redirect back to employee list
        alert(`Employee added successfully! Temporary password: ${tempPassword}`);
        navigate('/admin/employee-list');
      } else {
        setErrors({ submit: data.message || 'Failed to add employee' });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

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
          {/* Back Button */}
          <button
            onClick={() => navigate('/admin/employee-list')}
            className="flex items-center gap-2 mb-8 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: '#0E7C86' }}
          >
            <ArrowLeft size={18} />
            Back to Employee List
          </button>

          {/* Page Title */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: '#2D3748' }}
            >
              Add New Employee
            </h1>
            <p style={{ color: '#718096' }} className="text-sm">
              Fill in the details below to add a new employee to your organization
            </p>
          </div>

          {/* Form Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div
                className="bg-white rounded-lg shadow-sm border p-8"
                style={{ borderColor: '#D9E2EC' }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#2D3748' }}
                    >
                      Name <span style={{ color: '#E53E3E' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter employee name"
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: errors.name ? '#E53E3E' : '#D9E2EC',
                        focusRing: errors.name ? '#E53E3E' : '#0E7C86',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = errors.name
                          ? '#E53E3E'
                          : '#0E7C86';
                        e.target.style.boxShadow = errors.name
                          ? '0 0 0 3px rgba(229, 62, 62, 0.1)'
                          : '0 0 0 3px rgba(14, 124, 134, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.name
                          ? '#E53E3E'
                          : '#D9E2EC';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {errors.name && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: '#E53E3E' }}
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#2D3748' }}
                    >
                      Email <span style={{ color: '#E53E3E' }}>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter employee email"
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                      style={{
                        borderColor: errors.email ? '#E53E3E' : '#D9E2EC',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = errors.email
                          ? '#E53E3E'
                          : '#0E7C86';
                        e.target.style.boxShadow = errors.email
                          ? '0 0 0 3px rgba(229, 62, 62, 0.1)'
                          : '0 0 0 3px rgba(14, 124, 134, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.email
                          ? '#E53E3E'
                          : '#D9E2EC';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {errors.email && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: '#E53E3E' }}
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Role Field */}
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#2D3748' }}
                    >
                      Role <span style={{ color: '#E53E3E' }}>*</span>
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all appearance-none bg-white cursor-pointer"
                      style={{
                        borderColor: errors.role ? '#E53E3E' : '#D9E2EC',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232D3748' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        paddingRight: '2.5rem',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = errors.role
                          ? '#E53E3E'
                          : '#0E7C86';
                        e.target.style.boxShadow = errors.role
                          ? '0 0 0 3px rgba(229, 62, 62, 0.1)'
                          : '0 0 0 3px rgba(14, 124, 134, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.role
                          ? '#E53E3E'
                          : '#D9E2EC';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    {errors.role && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: '#E53E3E' }}
                      >
                        {errors.role}
                      </p>
                    )}
                  </div>

                  {/* Department Field */}
                  <div>
                    <label
                      htmlFor="department"
                      className="block text-sm font-semibold mb-2"
                      style={{ color: '#2D3748' }}
                    >
                      Department <span style={{ color: '#E53E3E' }}>*</span>
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all appearance-none bg-white cursor-pointer"
                      style={{
                        borderColor: errors.department
                          ? '#E53E3E'
                          : '#D9E2EC',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232D3748' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        paddingRight: '2.5rem',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = errors.department
                          ? '#E53E3E'
                          : '#0E7C86';
                        e.target.style.boxShadow = errors.department
                          ? '0 0 0 3px rgba(229, 62, 62, 0.1)'
                          : '0 0 0 3px rgba(14, 124, 134, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.department
                          ? '#E53E3E'
                          : '#D9E2EC';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                    {errors.department && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: '#E53E3E' }}
                      >
                        {errors.department}
                      </p>
                    )}
                  </div>

                  {/* Submit Error Message */}
                  {errors.submit && (
                    <div
                      className="p-4 rounded-lg text-sm"
                      style={{
                        backgroundColor: 'rgba(229, 62, 62, 0.1)',
                        color: '#E53E3E',
                        borderLeft: '4px solid #E53E3E',
                      }}
                    >
                      {errors.submit}
                    </div>
                  )}

                  {/* Form Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50"
                      style={{ backgroundColor: '#0E7C86' }}
                      onMouseEnter={(e) => {
                        if (!loading)
                          e.currentTarget.style.backgroundColor = '#0A6670';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#0E7C86';
                      }}
                    >
                      {loading ? 'Adding Employee...' : 'Add Employee'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/admin/employee-list')}
                      className="flex-1 px-6 py-3 rounded-lg font-semibold border transition-all duration-200 cursor-pointer"
                      style={{
                        borderColor: '#D9E2EC',
                        color: '#2D3748',
                        backgroundColor: '#FFFFFF',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F7FAFC';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Illustration Section */}
            <div className="lg:col-span-1 hidden lg:flex items-center justify-center">
              <div className="w-full flex items-center justify-center">
                <img
                  src={AddEmployeeImg}
                  alt="Add Employee"
                  className="w-full h-auto max-w-md"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddEmployee;
