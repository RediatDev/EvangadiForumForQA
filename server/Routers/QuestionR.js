const express = require('express');
const {createQuestion,updateQuestion,deleteQuestion,getSingleQuestion,getAllQuestions,getQuestionByTag,imageSender} = require('../Controllers/QuestionC.js'); 
const {authenticateToken} = require('../Auth/Auth.js')
const {checkRole} = require('../middleware/CheckRole.js')
const ImageFileUploader  = require('../middleware/ImageFileHandler.js')

let questionCreateRouter = express.Router();

questionCreateRouter.post('/createQuestion',authenticateToken,ImageFileUploader.single('image_file'), createQuestion);

questionCreateRouter.get('/updateQuestion/:questionId',authenticateToken,ImageFileUploader.single('image_file'),updateQuestion);

questionCreateRouter.delete('deleteQuestion/:questionId',authenticateToken, deleteQuestion);
questionCreateRouter.get('getQuestion/:Id',authenticateToken, getSingleQuestion);
questionCreateRouter.get('/getAllQuestion',authenticateToken, getAllQuestions);
questionCreateRouter.get('/getQuestionByTag',authenticateToken, getQuestionByTag);





module.exports = {questionCreateRouter};