const {Question} = require('../models');
let createQuestion = async (req, res) => {
    const { title, description, tag } = req.body;
    const userId = req.user.userId; 
	const imageLink = req.file ? req.file.path : null;
    const errors = [];

    // Validate the required fields
    if (!title) errors.push("Title is required.");
    if (!description) errors.push("Description is required.");
    if (!tag) errors.push("At least one tag is required.");

    // If there are validation errors, return them
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

	if (req.fileValidationError) {
		return res.status(400).json({ErrorMessage: req.fileValidationError});
	  }

    try {
        // Create the question
        const newQuestion = await Question.create({
            title,
            description,
            imageLink,
            tag,
            userId,
        });

        // Respond with the created question
        return res.status(201).json({ message: "Question created successfully", question: newQuestion });
    } catch (err) {
        console.error("Error creating question:", err);
        return res.status(500).json({ errors: ["Internal server error while creating question"] });
    }
};

let updateQuestion = async (req, res) => {
    const { questionId } = req.params; 
    const { title, description, tag } = req.body;
    const userId = req.user.userId; // Assuming user ID is available from authentication middleware
	const imageLink = req.file ? req.file.path : null;
    const errors = [];

    // Ensure the question ID is provided
    if (!questionId) {
        errors.push("Question ID is required.");
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
	if (req.fileValidationError) {
		return res.status(400).json({ErrorMessage: req.fileValidationError});
	  }
    try {
        // Find the question by ID
        const question = await Question.findOne({ where: { questionId, userId } });

        // Check if question exists and belongs to the logged-in user
        if (!question) {
            return res.status(404).json({ errors: ["Question not found"] });
        }

        // Update fields only if they are provided
        if (title) question.title = title;
        if (description) question.description = description;
        if (imageLink) question.imageLink = imageLink;
        if (tag) question.tag = tag;

        // Save the updated question to the database
        await question.save();

        // Respond with the updated question
        return res.status(200).json({ message: "Question updated successfully", question });

    } catch (err) {
        console.error("Error updating question:", err);
        return res.status(500).json({ errors: ["Internal server error while updating question"] });
    }
};


let deleteQuestion = async (req, res) => {
    const { questionId } = req.params; 
    const userId = req.user.userId;

    // Validation check
    if (!questionId) {
        return res.status(400).json({ errors: ["Question ID is required."] });
    }

    try {
        // Find the question by ID and ensure it belongs to the logged-in user
        const question = await Question.findOne({ where: { questionId, userId } });

        // Check if question exists and belongs to the authenticated user
        if (!question) {
            return res.status(404).json({ errors: ["Question not found"] });
        }

        // Delete the question
        await question.destroy();

        // Respond with success message
        return res.status(200).json({ message: "Question deleted successfully." });

    } catch (err) {
        console.error("Error deleting question:", err);
        return res.status(500).json({ errors: ["Internal server error while deleting question."] });
    }
};


let getSingleQuestion = async (req, res) => {
    const { questionId } = req.params; 

    // Validation check
    if (!questionId) {
        return res.status(400).json({ errors: ["Question ID is required."] });
    }

    try {
        // Find the question by ID
        const question = await Question.findOne({
            where: { questionId },
            include: [{
                model: User, 
                attributes: ['userId','username', 'email'] 
            }]
        });

        // Check if the question exists
        if (!question) {
            return res.status(404).json({ errors: ["Question not found."] });
        }

        // Respond with the question data
        return res.status(200).json({ question });

    } catch (err) {
        console.error("Error fetching question:", err);
        return res.status(500).json({ errors: ["Internal server error while fetching the question."] });
    }
};


let getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.findAll({
            include: [{
                model: User, // Include User information if needed
                attributes: ['userId','username', 'email'] 
            }],
            order: [['createdAt', 'DESC']] 
        });

        // Check if there are any questions
        if (questions.length === 0) {
            return res.status(404).json({ message: "No questions found." });
        }

        // Respond with the list of questions
        return res.status(200).json({ questions });

    } catch (err) {
        console.error("Error fetching questions:", err);
        return res.status(500).json({ errors: ["Internal server error while fetching all questions."] });
    }
};


let getQuestionByTag = async (req, res) => {
    const { tag } = req.params; 

    // Validation check
    if (!tag) {
        return res.status(400).json({ errors: ["Tag is required."] });
    }

    try {
        // Fetch questions by tag
        const questions = await Question.findAll({
            where: { tag }, 
            include: [{
                model: User, 
                attributes: ['userId','username', 'email'] 
            }],
            order: [['createdAt', 'DESC']] 
        });

        // Check if any questions were found
        if (questions.length === 0) {
            return res.status(404).json({ message: "No questions found for this tag." });
        }

        // Respond with the list of questions
        return res.status(200).json({ questions });

    } catch (err) {
        console.error("Error fetching questions by tag:", err);
        return res.status(500).json({ errors: ["Internal server error while fetching questions by tag."] });
    }
};

const imageSender = async (req, res) => {
	const { imageLink } = req.params;

	const imagePath = `ImageStore/${imageLink}`;
	fs.readFile(imagePath, (err, data) => {
		if (err) {
			return res.status(404).send('File not found');
		} else {
			// Extract the file extension to determine the content type
			const fileExtension = imageLink.split('.').pop();
			let contentType = 'image/png'; // default to PNG

			if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
				contentType = 'image/jpeg';
			} else if (fileExtension === 'png') {
				contentType = 'image/png';
			}

			// Set the content type before sending the response
			res.setHeader('Content-Type', contentType);
			res.send(data);
		}
	});
};




module.exports ={
    createQuestion,updateQuestion,deleteQuestion,getSingleQuestion,getAllQuestions,getQuestionByTag,imageSender
}