const express = require('express');
const { 
    createUser,userLogIn,userProfileUpdate,userRoleUpdater,userProfileDelete,singleUserFinder,userPasswordReset,allUserFinder
  } = require('../Controllers/UserC');
  const {authenticateToken} = require('../Auth/Auth.js')
  const {checkRole} = require('../middleware/CheckRole.js')
const userCreateRouter = express.Router();

userCreateRouter.post('/register', createUser);
userCreateRouter.post('/login', userLogIn);
userCreateRouter.patch('/userRole/:userId',authenticateToken,checkRole(["1","2"]), userRoleUpdater);
userCreateRouter.delete('/userProfileDelete/:userId',authenticateToken,checkRole(["1","2"]),userProfileDelete);
userCreateRouter.patch('/userProfileUpdate/:userId',authenticateToken, userProfileUpdate);
userCreateRouter.get('/getSingleUser/:userId',authenticateToken,checkRole(["1","2"]),singleUserFinder);
userCreateRouter.patch('/userPasswordReset/:userId',authenticateToken, userPasswordReset);
userCreateRouter.get('/allUsers/:userId',authenticateToken,checkRole(["1","2"]), allUserFinder);

module.exports = {userCreateRouter};