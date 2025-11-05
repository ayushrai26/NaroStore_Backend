const express = require('express')
const router = express.Router()
const verifyUserToken = require('../middlewares/verifyUserToken')
const {fetchOrder} = require('../controllers/orderController')


router.get('/fetch-user-order',verifyUserToken,fetchOrder)

module.exports = router