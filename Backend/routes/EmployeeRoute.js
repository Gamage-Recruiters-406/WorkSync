import express from 'express';
import { 
    rejisterEmployee,
    getAllEmployee,
    EmloyeesByRole,
    getSingleEmployee,
    loginUser,
    SignOut,
    RemoveEmployee
 } from '../controllers/Employeecontroller.js';
import { isAdmin, requiredSignIn } from '../middlewares/AuthMiddleware.js';


const router = express.Router();

//login route
router.post("/userLogin", loginUser);

//log out function
router.post("/signout",requiredSignIn, SignOut);

//add new employee route
router.post("/RejisterEmployee/:id", requiredSignIn, isAdmin, rejisterEmployee );

//get all workers
router.get("/getAllEmployee", requiredSignIn, isAdmin, getAllEmployee)

//get all workers by there role
router.get("/getEmloyeesByRole", requiredSignIn, EmloyeesByRole );

//get single user
router.get("/getSingleEmployee",requiredSignIn, getSingleEmployee)

//remove employee
router.delete("/RemoveEmployee/:id",requiredSignIn, isAdmin, RemoveEmployee)


export default router;