import express from "express";
import {
  createDepartment,
  deleteDepartment,
  changeDepartmentStatus,
  updateDepartment,
  getAllDepartments,
  getDepartment,
} from "../controllers/departmentController.js";
import { requiredSignIn, isAdmin } from "../middlewares/AuthMiddleware.js";
const router = express.Router();

// Get All Departments - GET /api/v1/department/getAllDepartments
router.get("/getAllDepartments", requiredSignIn, isAdmin, getAllDepartments);

// Get Single Department - GET /api/v1/department/getDepartment/:id
router.get("/getDepartment/:id", requiredSignIn, isAdmin, getDepartment);

// Create Department - POST /api/v1/department/createDepartment

//with authentication and admin authorization
router.post("/createDepartment", requiredSignIn, isAdmin, createDepartment);

//without authentication and authorization
// router.post('/createDepartment', createDepartment);

// Update Department - PUT /api/v1/department/updateDepartment/:id
router.put("/updateDepartment/:id", requiredSignIn, isAdmin, updateDepartment);

// Delete Department - DELETE /api/v1/department/deleteDepartment/:id

//with authentication and admin authorization
router.delete(
  "/deleteDepartment/:id",
  requiredSignIn,
  isAdmin,
  deleteDepartment
);

//without authentication and authorization
// router.delete('/deleteDepartment/:id', deleteDepartment);

// Change Department Status - PUT /api/v1/department/changeStatus/:id

//with authentication and admin authorization
router.put(
  "/changeStatus/:id",
  requiredSignIn,
  isAdmin,
  changeDepartmentStatus
);

export default router;
