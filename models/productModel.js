const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        trim:true
    },
    images:[{
        type:String
    }],
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const productModel = mongoose.model('Product',productSchema)
module.exports = productModel