import express from 'express';
import { 
    rejisterEmployee,
    getAllEmployee
 } from '../controllers/Employeecontroller.js';
import { isAdmin, requiredSignIn } from '../middlewares/AuthMiddleware.js';


const router = express.Router();

//add new employee route
router.post("/RejisterEmployee/:id", requiredSignIn, isAdmin, rejisterEmployee );

router.get("/getAllEmployee", requiredSignIn, isAdmin, getAllEmployee)


export default router;