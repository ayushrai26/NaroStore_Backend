const express = require('express')

const router = express.Router()
const verifyUserToken = require('../middlewares/verifyUserToken')
const verifyAdminToken = require('../middlewares/verifyAdminToken')
const isAdmin = require('../middlewares/roleBased')
const {newProduct,deleteProduct,fetchProducts,fetchSingleProduct,filterProduct,productReview,submitReview,fetchReview,editProduct,fetchProductHomePage,fetchSingleReview} = require('../controllers/productController')

router.post('/create-product',verifyAdminToken,isAdmin,newProduct)
router.get('/fetch-all-products',fetchProducts)
router.get('/fetch-product-homePage',fetchProductHomePage)
router.get('/fetch-product/:productId',fetchSingleProduct)
router.delete('/delete-product/:productId',verifyAdminToken,isAdmin,deleteProduct)
router.patch('/edit-product/:productId',verifyAdminToken,isAdmin,editProduct)
router.get('/fetch-product-review/:productId',productReview)
router.post('/filter-products',filterProduct)
router.post('/submit-review',verifyUserToken,submitReview)
router.post('/fetch-reviews',fetchReview)

module.exports = router

