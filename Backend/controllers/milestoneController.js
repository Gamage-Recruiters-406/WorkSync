import milestone from "../models/milestoneModel.js";

export const createMilestone = async (req, res) => {
    try {
        const {projectID, milestoneName, Description, Start_Date, End_Date, Status} = req.body;


        const newMilestone = new milestone({
            projectID,
            milestoneName,
            Description,
            Start_Date,
            End_Date,
            Status
        });

        const savedMilestone = await newMilestone.save();

        res.status(201).json({
            success: true,
            message: "Milestone created successfully",
            data: savedMilestone
        });

    } catch (error) {
        console.error("Error Creating milestone",error );
        res.status(500).json({
            success:false,
            message: "Error Creating Milestone"
        })
    }
}
