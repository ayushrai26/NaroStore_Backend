const express = require('express')
const router = express.Router()
const {uploadMultiplePhotos} = require('../controllers/uploadController')
const cloudinary = require('../utils/cloudinary/cloudinary')
const multer = require('multer')
const {CloudinaryStorage} = require('multer-storage-cloudinary')


const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'productPics',
        allowed_formats :['jpg','png','jpeg','webp']
    }
})

const upload = multer({storage})

router.post('/product-photos',upload.any(),uploadMultiplePhotos)

module.exports = router

