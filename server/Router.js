const express = require('express');
const AllRouters = express.Router();
const {answerCreateRouter} = require('./Routers/AnswerR')
const {questionCreateRouter} = require('./Routers/QuestionR')
const {userCreateRouter} = require('./Routers/UserR')


AllRouters.use('/users', userCreateRouter);
AllRouters.use('/questions', questionCreateRouter);
AllRouters.use('/answers', answerCreateRouter);


module.exports = { AllRouters };