const express = require('express')
const router = express.Router();
const {signIn,signUp,forgetPassword,userDetails,generateUserToken,logOut,updateUser} = require('../controllers/userController');
const verifyUserToken = require('../middlewares/verifyUserToken');
const isAdmin = require('../middlewares/roleBased');


router.post('/sign-up-user',signUp)
router.post('/sign-in-user',signIn)
router.patch('/forget-password',forgetPassword)
router.get('/fetch-user-details',verifyUserToken,userDetails)
router.get('/generate-access-token',generateUserToken)
router.put('/update-user',verifyUserToken,updateUser)
router.get('/log-out',logOut)


module.exports = router
