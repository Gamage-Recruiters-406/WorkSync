import axios from 'axios';

const employeeApi = axios.create({
  baseURL: 'http://localhost:8090/api/v1/employee',
  withCredentials: true,
});

export const getAllEmployees = async () => {
  try {
    const response = await employeeApi.get('/getAllEmployee');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSingleEmployeeById = async (id) => {
  try {
    const response = await employeeApi.get(`/getSingleEmployeeByID/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await employeeApi.patch(`/updateEmployee/${id}`, employeeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeEmployee = async (id) => {
  try {
    const response = await employeeApi.delete(`/RemoveEmployee/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const response = await employeeApi.post('/addEmployee', employeeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
