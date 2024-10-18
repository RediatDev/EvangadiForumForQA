const express = require('express');
const {  createAnswer,getAnswerByQuestionId,updateAnswer,deleteAnswer,getAnswerByUserId} = require('../Controllers/AnswaerC.js'); 
const {authenticateToken} = require('../Auth/Auth.js')
const {checkRole} = require('../middleware/CheckRole.js')

let answerCreateRouter = express.Router();

answerCreateRouter.post('/createAnswer',authenticateToken, createAnswer);
answerCreateRouter.get('/:questionId',authenticateToken,getAnswerByQuestionId);
answerCreateRouter.patch('/updateAnswer/:answerId',authenticateToken, updateAnswer);
answerCreateRouter.delete('/deleteAnswer/:answerId',authenticateToken, deleteAnswer);
answerCreateRouter.get('/:answerId/:userId',authenticateToken, getAnswerByUserId);


module.exports = {answerCreateRouter};