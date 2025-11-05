const mongoose = require('mongoose')


const orderSchema = new mongoose.Schema({
    userId:{type:String,
        
    },
    items:[
        {
            name:String,
            price:Number,
            qunatity:Number
        },
    ],
    amount:Number,
    status:{
        type:String,
        default:"pending"
    },
    paymentId:String,
    address:Object,
    orderStatus:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    },

})

const orderModel = mongoose.model('Order',orderSchema)
module.exports = orderModel
