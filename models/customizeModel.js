const mongoose = require('mongoose')

const customizeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    clothType:{
       type:String,
       required:true
    },
    color:{
        type:String,

    },
    size:{
        type:String,
        required:true
    },
    images:[{
        type:String
}],
    text:{
        type:String
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
      type:Number,
      required:true
    }
})

const customizeModel = mongoose.model('customize',customizeSchema)
module.exports = customizeModel