import express from 'express';
import { createDepartment , deleteDepartment} from '../controllers/departmentController.js';
import { requiredSignIn,isAdmin } from '../middlewares/AuthMiddleware.js';
const router = express.Router();

// Create Department - POST /api/v1/department/createDepartment

//with authentication and admin authorization
router.post('/createDepartment',requiredSignIn ,isAdmin , createDepartment);

//without authentication and authorization
// router.post('/createDepartment', createDepartment);


// Delete Department - DELETE /api/v1/department/deleteDepartment/:id

//with authentication and admin authorization
router.delete('/deleteDepartment/:id',requiredSignIn ,isAdmin, deleteDepartment);

//without authentication and authorization
// router.delete('/deleteDepartment/:id', deleteDepartment);

export default router;
