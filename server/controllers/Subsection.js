const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const {uploadImageToCloudinary} = require("../utils/imageUploder");
const Course = require("../models/Course");

//create subSection

exports.createSubSection = async (req,res)=>{
    try {
		// Extract necessary information from the request body
		const { sectionId, title , description,courseId } = req.body;
		const video = req.files.videoFile;

		// Check if all necessary fields are provided
		if (!sectionId || !title || !description || !video || !courseId ) {
			return res
				.status(404)
				.json({ success: false, message: "All Fields are Required" });
		}

		const ifsection= await Section.findById(sectionId);
		if (!ifsection) {
            return res
                .status(404)
                .json({ success: false, message: "Section not found" });
        }


		// Upload the video file to Cloudinary
		const uploadDetails = await uploadImageToCloudinary(
			video,
			process.env.FOLDER_VIDEO
		);

		console.log(uploadDetails);
		// Create a new sub-section with the necessary information
		const SubSectionDetails = await SubSection.create({
			title: title,
			// timeDuration: timeDuration,
			description: description,
			videoUrl: uploadDetails.secure_url,
		});

		// Update the corresponding section with the newly created sub-section
		const updatedSection = await Section.findByIdAndUpdate(
			{ _id: sectionId },
			{ $push: { subSection: SubSectionDetails._id } },
			{ new: true }
		).populate("subSection");

		const updatedCourse = await Course.findById(courseId).populate({ path: "courseContent", populate: { path: "subSection" } }).exec();
		// Return the updated section in the response
		return res.status(200).json({ success: true, data: updatedCourse });
	} catch (error) {
		// Handle any errors that may occur during the process
		console.error("Error creating new sub-section:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	
    }
    
}


// update subSection

exports.updateSubSection = async(req,res)=>{
    try{
        const {sectionId,subSectionId,title,description} = req.body
        if (!sectionId || !subSectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing sectionId or subSectionId",
            });
        }
        const subSection = await SubSection.findById(subSectionId)

        if(!subSection){
            return res.status(404).json({
                success:false,
                message:"SubSection not found",
            })
        }

        subSection.title = title ?? subSection.title;
        
        // if(description!==undefined){
        //     subSection.description = description
        // }
        subSection.description = description ?? subSection.description;

        // if(req.files && req.files.video !== undefined){
        if(req.files?.video){
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save()

        const updatedSection = await Section.findById(sectionId).populate("subSection")
        if (!updatedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }
        console.log("updated section",updatedSection)

        return res.json({
            success:true,
            message:"Section updated successfully",
            data:updatedSection,
        })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"An error occured while updating the section",
        })
    }
}



//delete subSection
exports.deleteSubSection = async (req,res)=>{
    try{
        const {subSectionId,sectionId} = req.body
        await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        )
        const subSection = await SubSection.findByIdAndDelete({_id:subSectionId})

        if(!subSection){
            return res.status(404).json({
                success:false,
                message:"Subsection not found",
            })
        }

        const updatedSection = await Section.findById(sectionId).populate("subSection")

        return res.json({
            success:true,
            message:"SubSection deleted successfully",
            data:updatedSection,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'Unable to delete SubSection, please try again',
            error:error.message,
        });
    }
}