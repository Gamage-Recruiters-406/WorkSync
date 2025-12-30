import EmployeeModel from "../models/EmployeeModel.js";
import User from "../models/User.js";

export const rejisterEmployee = async(req, res) => {
    try {
        const {id} = req.params;

        const user = await User.findById(id);
        
        if(!user){
            res.status(404).json({ 
                success: false, 
                message: "User not found"
            })
        }
        console.log(user);
        
        res.status(200).json({
            success: true,
            message: "New Employee added successfully"
        })



    } catch (error) {
        console.log("registration error: ",error);
        res.status(500).json({
            success: false,
            message: "Server side error"
        })
    }
}

export const getAllEmployee = async(req, res) => {
    try {
        const Employees = await EmployeeModel.find()

        res.status(200).json({
            success: true,
            message: "Fetching all employees",
            Employees
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Side Error"
        })
    }
}