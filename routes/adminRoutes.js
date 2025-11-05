const express = require('express')
const router = express.Router()
const {signIn, generateAdminToken, logOut} = require('../controllers/adminController')
const {fetchUsers,fetchOrders} = require('../controllers/adminController')
const verifyAdminToken = require('../middlewares/verifyAdminToken')
const isAdmin = require('../middlewares/roleBased')


router.post('/sign-in-admin',signIn)
router.get('/fetch-all-users',verifyAdminToken,isAdmin,fetchUsers)
router.get('/fetch-orders',verifyAdminToken,isAdmin,fetchOrders)
router.get('/generate-access-token',generateAdminToken)
router.post('/logout',logOut)
module.exports = router