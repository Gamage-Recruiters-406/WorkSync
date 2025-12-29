import User from "../models/User.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

// REGISTER USER
export const registerUser = async (req, res) => {
    try {
        const { FirstName, LastName, NIC, ContactNumber, Gender, email } = req.body;

        // Validation
        if (!FirstName || !NIC || !ContactNumber || !LastName || !Gender || !email ) {
            return res.status(404).json({
                success: false,
                message: "All fields are required!"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "You already send your details"
            });
        }

        const attachments =[];
        if (req.file) {
            attachments.push(req.file.path.replace(/\\/g, "/"));
        }

        // Create user
        const user = await User.create({ FirstName, LastName, NIC, ContactNumber, Gender, email, attachments});

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { 
                userid: user._id,
                FirstName: user.FirstName,
                LastName: user.LastName,
                email: user.email,
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Error registering user",
            error: error.message
        });
    }
};

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
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
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

//get all users
export const getAllUsers = async(req, res) => {
    try {
        const Users = await User.find();

        res.status(200).json({
            success: true,
            message: 'Fetching Users Data successfully!',
            Users
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Server side Error'
        })
    }
}