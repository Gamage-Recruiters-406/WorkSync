import Department from "../models/DepartmentModel.js";
import User from "../models/User.js";

// Create Department
export const createDepartment = async (req, res) => {
    try {
        const { name } = req.body;
        // Validate input
        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Department name is required"
            });
        }

         // Check if department already exists
        const existingDept = await Department.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') } // Case-insensitive check
        });


        if (existingDept) {
        return res.status(400).json({ message: 'Department already exists' });
        } 

        const department = new Department({ name: name.trim() });
        await department.save();

        res.status(201).json({
            success: true,
            message: "Department created successfully",
            data: department
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating department",
            error: error.message
        });
    }
};

// Delete Department
export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const department = await Department.findById(id);

        if(!department){
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        // Check if any users are assigned to this department
        const emplyeeCount = await User.countDocuments({ departmentID: id });
        
        if(emplyeeCount > 0){
            return res.status(400).json({
                success: false,
                message: "Cannot delete department with assigned employees"
            });
        }

        await Department.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Department deleted successfully"
        });

    }catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting department",
            error: error.message
        });
    }


}
