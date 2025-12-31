import EmployeeModel from "../models/EmployeeModel.js";
import User from "../models/User.js";
import { hashPassword, comparePassword } from "../helpers/AuthHelper.js";
import JWT from "jsonwebtoken";

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



//get single employee
export const getSingleEmployee = async (req, res) => {
  try {
    const id = req.user.userid;

    const user = await EmployeeModel.findById(id);
    console.log(user);

    res.status(200).json({
      success: true,
      message: 'User details fetch successfully!',
      user
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server side Error'
    })
  }
}

// LOGIN USER
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Check if user exists
        const user = await EmployeeModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate JWT
        const token = JWT.sign(
            { 
                userid: user._id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie('access_token', token, {
            httpOnly: true
        }).status(200).json({
            success: true,
            message: "Login successful",
            data: {
                userid: user._id,
                name: user.name,
                role: user.role,
                email: user.email,
                departmentID: user.departmentID
            },
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Error logging in",
            error: error.message
        });
    }
};

//log out controller
export const SignOut = async(req, res) => {
  try {
    res.clearCookie('access_token').status(200).json({
      success: true,
      message: 'Signout Successfully!'
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Server side Error.'
    })
  }
}