import express from 'express';
import { 
    rejisterEmployee,
    getAllEmployee,
    EmloyeesByRole
 } from '../controllers/Employeecontroller.js';
import { isAdmin, requiredSignIn } from '../middlewares/AuthMiddleware.js';


const router = express.Router();

//add new employee route
router.post("/RejisterEmployee/:id", requiredSignIn, isAdmin, rejisterEmployee );

//get all workers
router.get("/getAllEmployee", requiredSignIn, isAdmin, getAllEmployee)

//get all workers by there role
router.get("/getEmloyeesByRole", requiredSignIn, EmloyeesByRole );


export default router;