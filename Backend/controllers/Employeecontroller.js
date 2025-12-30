import EmployeeModel from "../models/EmployeeModel.js";
import User from "../models/User.js";
import { hashPassword } from "../helpers/AuthHelper.js";

export const rejisterEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // get user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // prevent duplicates (choose one depending on your Employee schema)
    const exists = await EmployeeModel.findOne({ userId: user._id });
    // OR if you don't have userId in Employee schema:
    // const exists = await EmployeeModel.findOne({ email: user.email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "This user is already registered as an employee",
      });
    }

    // NIC as password (hashed)
    const hashed = await hashPassword(user.NIC);

    // create employee
    const employee = await EmployeeModel.create({
      userId: user._id, // recommended to keep link
      FirstName: user.FirstName,
      LastName: user.LastName,
      NIC: user.NIC,
      ContactNumber: user.ContactNumber,
      Gender: user.Gender,
      email: user.email,
      password: hashed,
    });

    await User.findByIdAndDelete(id);

    return res.status(201).json({
      success: true,
      message: "New Employee added successfully",
    });
  } catch (error) {
    console.log("registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server side error",
      error: error.message,
    });
  }
};

//get all workers
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

//get all workers by role 
export const EmloyeesByRole = async (req, res) => {
    try {
        const Employees = await EmployeeModel.find({role : 1});

        res.status(200).json({
            success: true,
            message: "Fetch all members",
            Employees
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server side Error'
        })
    }
}