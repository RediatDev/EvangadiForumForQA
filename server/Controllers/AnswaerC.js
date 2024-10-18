const { Answer } = require('../models'); 

// Create a new answer
let createAnswer = async (req, res) => {
  try {
    const { userId, questionId, answer, url } = req.body;
    const newAnswer = await Answer.create({
        userId,
        questionId,
        answer,
        url: url || null,
    });
    return res.status(201).json(newAnswer);
  } catch (error) {
    console.error("Error creating answer:", error);
    return res.status(500).json({ message: "Error creating answer", error });
  }
};

// Get answers by question ID
let getAnswerByQuestionId = async (req, res) => {
  try {
    const { questionId } = req.params;
    const answers = await Answer.findAll({
      where: { questionId },
    });
    return res.status(200).json(answers);
  } catch (error) {
    console.error("Error fetching answers by question ID:", error);
    return res.status(500).json({ message: "Error fetching answers", error });
  }
};

// Update an answer
let updateAnswer = async (req, res) => {
    try {
      const { answerId } = req.params; // Ensure the parameter matches your route
      const { answer, url } = req.body;
  
      // Create an object to hold the fields to update
      const updateData = {};
  
      // Add fields to updateData if they are provided
      if (answer !== undefined) { // Check if provided (including empty string)
        updateData.answer = answer;
      }
      if (url !== undefined) { // Check if provided (including empty string)
        updateData.url = url;
      }
  
      // If no fields to update, return a bad request response
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No fields to update" });
      }
  
      const [updated] = await Answer.update(updateData, { where: { answerId } });
  
      if (updated) {
        const updatedAnswer = await Answer.findOne({ where: { answerId } });
        return res.status(200).json(updatedAnswer);
      }
  
      return res.status(404).json({ message: "Answer not found" });
    } catch (error) {
      console.error("Error updating answer:", error);
      return res.status(500).json({ message: "Error updating answer", error });
    }
  };
  

// Delete an answer
let deleteAnswer = async (req, res) => {
    try {
      const { answerId } = req.params; 
      const deleted = await Answer.destroy({
        where: { answerId },
      });
  
      if (deleted) {
        return res.status(200).json({ message: "Answer deleted successfully" }); 
      }
  
      return res.status(404).json({ message: "Answer not found" });
    } catch (error) {
      console.error("Error deleting answer:", error);
      return res.status(500).json({ message: "Error deleting answer", error });
    }
  };
  

// Get answers by user ID
let getAnswerByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const answers = await Answer.findAll({
      where: { userId },
    });
    return res.status(200).json(answers);
  } catch (error) {
    console.error("Error fetching answers by user ID:", error);
    return res.status(500).json({ message: "Error fetching answers", error });
  }
};

module.exports = {
  createAnswer,
  getAnswerByQuestionId,
  updateAnswer,
  deleteAnswer,
  getAnswerByUserId,
};
