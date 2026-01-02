import Department from "../models/DepartmentModel.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Create Department
export const createDepartment = async (req, res) => {
  try {
    const {
      name,
      departmentCode,
      departmentHead,
      capacity,
      status,
      location,
      email,
      number,
      description,
    } = req.body;

    // Validate name
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    // Check if department name already exists
    const existingDeptName = await Department.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingDeptName) {
      return res.status(400).json({
        success: false,
        message: "Department name already exists",
      });
    }

    // Validate code
    if (!departmentCode || departmentCode.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Department code is required",
      });
    }

    // Check if department code already exists
    const existingDeptCode = await Department.findOne({
      departmentCode: { $regex: new RegExp(`^${departmentCode}$`, "i") },
    });
    if (existingDeptCode) {
      return res.status(400).json({
        success: false,
        message: "Department code already exists",
      });
    }

    // Validate department head (now by name instead of ID, but allow empty)
    let employeeId = undefined;
    if (departmentHead !== undefined) {
      if (!departmentHead || departmentHead.trim() === "") {
        employeeId = null;
      } else {
        const employee = await User.findOne({
          name: { $regex: new RegExp(`^${departmentHead.trim()}$`, "i") },
        });

        if (!employee) {
          return res.status(400).json({
            success: false,
            message: "User with this name not found",
          });
        }

        employeeId = employee._id;

        // Check if employee is already a department head
        const existingHead = await Department.findOne({
          departmentHead: employeeId,
        });
        if (existingHead) {
          return res.status(400).json({
            success: false,
            message: "This employee is already assigned as a department head",
          });
        }
      }
    }

    // Validate Capacity
    if (!capacity || isNaN(capacity) || capacity < 1 || capacity > 1000) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be a number between 1 and 1000",
      });
    }

    // Validate status
    const validStatuses = ["Active", "Inactive"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'Active' or 'Inactive'",
      });
    }

    // Validate location
    if (!location || location.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Location is required",
      });
    }

    // Validate email
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "A valid email address is required",
      });
    }

    // Check email uniqueness
    const existingEmail = await Department.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Validate contact number
    const phoneRegex =
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    if (!number || number.trim() === "" || !phoneRegex.test(number)) {
      return res.status(400).json({
        success: false,
        message: "Contact number is required and must be valid",
      });
    }

    // Validate description
    if (description && description.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: "Description cannot exceed 500 characters",
      });
    }

    // Create new department
    const department = new Department({
      name: name.trim(),
      departmentCode: departmentCode.trim(),
      departmentHead: employeeId,
      capacity,
      status: status || "Active",
      location: location.trim(),
      email: email.trim().toLowerCase(),
      conactNumber: number.trim(),
      description: description ? description.trim() : "",
    });

    await department.save();
    await department.populate("departmentHead", "name email role");

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({
      success: false,
      message: "Error creating department",
      error: error.message,
    });
  }
};

// Update Department
export const updateDepartment = async (req, res) => {
};

// Delete Department
export const deleteDepartment = async (req, res) => {
};

// Get All Departments
export const getAllDepartments = async (req, res) => {
};

// Get Single Department
export const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid department ID",
      });
    }

    const department = await Department.findById(id).populate(
      "departmentHead",
      "name email role"
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // Get employee count for this department
    const employeeCount = await User.countDocuments({ departmentID: id });

    // Get list of employees in this department
    const employees = await User.find({ departmentID: id }).select(
      "name email role"
    );

    res.status(200).json({
      success: true,
      message: "Department retrieved successfully",
      data: {
        ...department.toObject(),
        employeeCount,
        employees,
      },
    });
  } catch (error) {
    console.error("Error retrieving department:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving department",
      error: error.message,
    });
  }
};

// Change Department Status
export const changeDepartmentStatus = async (req, res) => {
};

// Get Active Departments Only
export const getActiveDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ status: "Active" })
      .populate("departmentHead", "name email role")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      message: "Active departments retrieved successfully",
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    console.error("Error retrieving active departments:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving active departments",
      error: error.message,
    });
  }
};

// Search Departments
export const searchDepartments = async (req, res) => {
};

// Get Department Statistics
export const getDepartmentStatistics = async (req, res) => {
  try {
    const totalDepartments = await Department.countDocuments();
    const activeDepartments = await Department.countDocuments({
      status: "Active",
    });
    const inactiveDepartments = await Department.countDocuments({
      status: "Inactive",
    });

    // Get departments with most employees
    const allDepartments = await Department.find();
    const departmentsWithCounts = await Promise.all(
      allDepartments.map(async (dept) => {
        const count = await User.countDocuments({ departmentID: dept._id });
        return {
          id: dept._id,
          name: dept.name,
          employeeCount: count,
          capacity: dept.capacity,
        };
      })
    );

    departmentsWithCounts.sort((a, b) => b.employeeCount - a.employeeCount);

    res.status(200).json({
      success: true,
      message: "Department statistics retrieved successfully",
      data: {
        totalDepartments,
        activeDepartments,
        inactiveDepartments,
        topDepartments: departmentsWithCounts.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Error retrieving department statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving department statistics",
      error: error.message,
    });
  }
};
