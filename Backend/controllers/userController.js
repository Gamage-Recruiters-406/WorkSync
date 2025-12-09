import User from "../models/User.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

// REGISTER USER
export const registerUser = async (req, res) => {
    try {
        const { name, role, email, password, departmentID } = req.body;

        // Validation
        if (!name || !role || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields (name, role, email, password) are required"
            });
        }

        // Validate role
        if (![1, 2, 3].includes(Number(role))) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be 1 (Employee), 2 (Manager), or 3 (Admin)"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            role: Number(role),
            email,
            password: hashedPassword,
            departmentID: departmentID || undefined
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { 
                userid: user._id,
                name: user.name,
                role: user.role,
                email: user.email,
                departmentID: user.departmentID
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

        res.status(200).json({
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
