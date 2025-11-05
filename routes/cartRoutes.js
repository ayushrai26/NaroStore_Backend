const express = require('express')
const router = express.Router()
const verifyUserToken = require('../middlewares/verifyUserToken')
const {addToCart,
    getCart,
    removeItem,
   updateQuantity
}
     = require('../controllers/cartController')

router.post('/add-to-cart',verifyUserToken,addToCart)
router.get('/fetch-cart-products',verifyUserToken,getCart)
router.delete('/remove-item',verifyUserToken,removeItem)
router.patch('/update-quantity',verifyUserToken,updateQuantity)
module.exports = router;