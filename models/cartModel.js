const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    items:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',
                required:true

            },
            quantity:{
                type:Number,
                default:1
            },
            size:{
                type:String,
                required:true
            }
        }
    ],
    totalPrice:{
        type:Number,
        default:0
    }

})

const cartModel = mongoose.model('cart',cartSchema)
module.exports = cartModel