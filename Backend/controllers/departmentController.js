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
      name: { $regex: new RegExp(`^${name}$`, "i") }, // Case-insensitive check
    });
    if (existingDeptName) {
      return res
        .status(400)
        .json({ message: "Department name already exists" });
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
      departmentCode: { $regex: new RegExp(`^${departmentCode}$`, "i") }, // Case-insensitive check
    });
    if (existingDeptCode) {
      return res
        .status(400)
        .json({ message: "Department code already exists" });
    }

    // Validate department head
    if (!departmentHead || departmentHead.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Department head is required",
      });
    }

    //validate if department head exists in User collection
    if (departmentHead) {
      if (!mongoose.Types.ObjectId.isValid(departmentHead)) {
        return res.status(400).json({
          success: false,
          message: "Invalid department head ID",
        });
      }

      const employee = await User.findById(departmentHead);
      if (!employee) {
        return res.status(400).json({
          success: false,
          message: "Selected employee not found",
        });
      }

      // Check if employee is already a department head
      const existingHead = await Department.findOne({
        departmentHead: departmentHead,
      });
      if (existingHead) {
        return res.status(400).json({
          success: false,
          message: "This employee is already assigned as a department head",
        });
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
    // check email uniqueness
    const existingEmail = await Department.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") }, // Case-insensitive check
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
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
      departmentHead,
      capacity,
      status: status ? status : "active",
      location: location.trim(),
      email: email.trim().toLowerCase(),
      conactNumber: number.trim(),
      description: description ? description.trim() : "",
    });
    await department.save();

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating department",
      error: error.message,
    });
  }
};

// Update Department
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
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

    // Check if department exists
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // Validate name if provided
    if (name !== undefined) {
      if (!name || name.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Department name cannot be empty",
        });
      }
      // Check if department name already exists (excluding current department)
      const existingDeptName = await Department.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        _id: { $ne: id },
      });
      if (existingDeptName) {
        return res.status(400).json({
          success: false,
          message: "Department name already exists",
        });
      }
    }

    // Validate department code if provided
    if (departmentCode !== undefined) {
      if (!departmentCode || departmentCode.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Department code cannot be empty",
        });
      }
      // Check if department code already exists (excluding current department)
      const existingDeptCode = await Department.findOne({
        departmentCode: { $regex: new RegExp(`^${departmentCode}$`, "i") },
        _id: { $ne: id },
      });
      if (existingDeptCode) {
        return res.status(400).json({
          success: false,
          message: "Department code already exists",
        });
      }
    }

    // Validate department head if provided
    if (departmentHead !== undefined) {
      if (!departmentHead || departmentHead.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Department head cannot be empty",
        });
      }
      if (!mongoose.Types.ObjectId.isValid(departmentHead)) {
        return res.status(400).json({
          success: false,
          message: "Invalid department head ID",
        });
      }
      const employee = await User.findById(departmentHead);
      if (!employee) {
        return res.status(400).json({
          success: false,
          message: "Selected employee not found",
        });
      }

      // Check if employee is already a department head in another department
      const existingHead = await Department.findOne({
        departmentHead: departmentHead,
        _id: { $ne: id }, // Exclude current department
      });
      if (existingHead) {
        return res.status(400).json({
          success: false,
          message: "This employee is already assigned as a department head",
        });
      }
    }

    // Validate capacity if provided
    if (capacity !== undefined) {
      if (isNaN(capacity) || capacity < 1 || capacity > 1000) {
        return res.status(400).json({
          success: false,
          message: "Capacity must be a number between 1 and 1000",
        });
      }
    }

    // Validate status if provided
    if (status !== undefined) {
      const validStatuses = ["Active", "Inactive"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be either 'Active' or 'Inactive'",
        });
      }
    }

    // Validate location if provided
    if (location !== undefined) {
      if (!location || location.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Location cannot be empty",
        });
      }
    }

    // Validate email if provided
    if (email !== undefined) {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "A valid email address is required",
        });
      }
      // Check email uniqueness (excluding current department)
      const existingEmail = await Department.findOne({
        email: { $regex: new RegExp(`^${email}$`, "i") },
        _id: { $ne: id },
      });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // Validate contact number if provided
    if (number !== undefined) {
      const phoneRegex =
        /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
      if (!number || number.trim() === "" || !phoneRegex.test(number)) {
        return res.status(400).json({
          success: false,
          message: "Contact number is required and must be valid",
        });
      }
    }

    // Validate description if provided
    if (description !== undefined && description.trim().length > 500) {
      return res.status(400).json({
        success: false,
        message: "Description cannot exceed 500 characters",
      });
    }

    // Update department fields
    if (name) department.name = name.trim();
    if (departmentCode) department.departmentCode = departmentCode.trim();
    if (departmentHead) department.departmentHead = departmentHead;
    if (capacity) department.capacity = capacity;
    if (status) department.status = status;
    if (location) department.location = location.trim();
    if (email) department.email = email.trim().toLowerCase();
    if (number) department.conactNumber = number.trim();
    if (description !== undefined) department.description = description.trim();

    await department.save();

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating department",
      error: error.message,
    });
  }
};

// Delete Department
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // Check if any users are assigned to this department
    const emplyeeCount = await User.countDocuments({ departmentID: id });

    if (emplyeeCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete department with assigned employees",
      });
    }

    await Department.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting department",
      error: error.message,
    });
  }
};

// Get All Departments
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate("departmentHead", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Departments retrieved successfully",
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving departments",
      error: error.message,
    });
  }
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

    res.status(200).json({
      success: true,
      message: "Department retrieved successfully",
      data: department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving department",
      error: error.message,
    });
  }
};

// changeStatus Department
export const changeDepartmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    // Toggle status
    department.status = department.status === "Active" ? "Inactive" : "Active";
    await department.save();

    res.status(200).json({
      success: true,
      message: `Department status changed to ${department.status}`,
      data: department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error changing department status",
      error: error.message,
    });
  }
};
