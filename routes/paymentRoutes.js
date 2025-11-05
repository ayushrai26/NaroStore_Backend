const express = require('express')
const router = express.Router()
const {makePayment} = require('../controllers/paymentController')
const verifyUserToken = require('../middlewares/verifyUserToken')

router.post('/create-checkout-session',verifyUserToken,makePayment)



module.exports = router;