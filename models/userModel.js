const mongoose = require('mongoose')

const userSchema =  new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    username:{
        type:String,
    
        
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        validate:{
            validator:function(v){
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
            },
            message:"Enter valid email address"
        }
    },
    mobileNumber:{
        type:Number,
        
        maxlength:10,
        
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        maxlength:256,
        validate:{
            validator: function(v){
         return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v);
            },
            message:props=>"Password must contains uppercase,lowercase,number,and special character"
        }
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },
    gender:{
        type:String
    },
    profilePic:{
        type:String
    }

})

const userModel = mongoose.model('user',userSchema)
module.exports = userModel