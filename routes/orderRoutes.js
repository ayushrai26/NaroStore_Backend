const express = require('express')
const router = express.Router()
const verifyUserToken = require('../middlewares/verifyUserToken')
const {fetchOrder,updateOrderStatus} = require('../controllers/orderController')
const verifyAdminToken = require('../middlewares/verifyAdminToken')
const isAdmin = require('../middlewares/roleBased')


router.get('/fetch-user-order',verifyUserToken,fetchOrder)
router.patch('/update-order',verifyAdminToken,isAdmin,updateOrderStatus)

module.exports = router