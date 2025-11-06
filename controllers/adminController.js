const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const user = require('../models/userModel')
const Order = require('../models/orders')
const signIn = async(req,res)=>{
    try{
      const {email,password} = req.body;
      if(!email || !password){
        return res.status(400).json({message:'Invalid Email or Password'})
      }
      const isAdminExist = await User.findOne({email})
      if(!isAdminExist){
        return res.status(404).json({message:'Admin not found'})
      }
      console.log(isAdminExist,'is')
      if(isAdminExist.role!=='admin'){
        return res.status(401).json({message:'Unauthorized'})
      }
      const isMatch = await bcrypt.compare(password,isAdminExist.password)
      if(!isMatch){
        return res.status(401).json({message:'Wrong Password'})
      }
      const accessToken = jwt.sign(
        {id:isAdminExist._id,role:isAdminExist.role},
        process.env.JWT_SECRET,
        {expiresIn:'10m'}
      )
      const refreshToken = jwt.sign(
        {id:isAdminExist._id,role:isAdminExist.role},
        process.env.JWT_SECRET_REFRESH_KEY,
        {expiresIn:'15d'}
      )
      console.log(accessToken,refreshToken)
      res.cookie('adminAccessToken',accessToken,{
        httpOnly:true,
      secure:true,
      sameSite: "none",
      maxAge:10*60*1000,
      path:'/'

      })
      res.cookie("adminRefreshToken",refreshToken,{
      httpOnly:true,
      secure:true,
      sameSite: "none",
      maxAge:15*24*60*60*1000,
      path:'/'
    })
    return res.status(200).json({message:'Login successfull',isAdminExist})
    }catch(err){
    console.log(err,err.message)
    return res.status(500).json({message:'Internal server errror'})
    }
}

const fetchUsers = async (req, res) => {
  try {
    

    
    const users = await user.find({}, { password: 0, __v: 0 });

    res.status(200).json({
      success: true,
      totalUsers: users.length,
      users
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const fetchOrders = async(req,res)=>{
  try{
     const orders = await Order.find({})
     if(!orders || orders.length===0){
      return res.status(404).json({message:'No orders to show'})
     }
     return res.status(200).json({message:'Orders fetch successfully',orders})
  }catch(err){
  return res.status(500).json({message:'Internal Server Error'})
  }
}

const generateAdminToken = async(req,res)=>{
  const refreshToken = req.cookies.adminRefreshToken;
  
  if(!refreshToken){
    return res.status(401).json({message:'No refresh token found'})
  }
  try{
const adminData = jwt.verify(refreshToken,process.env.JWT_SECRET_REFRESH_KEY)
console.log(adminData,'admindata')
    const accessToken =  jwt.sign(
        {id:adminData.id,role:adminData.role},
        process.env.JWT_SECRET,
        {expiresIn:'10m'}
    )
    
    res.cookie('adminAccessToken',accessToken,{
      httpOnly:true,
      secure:true,
      sameSite:"none",
      maxAge:10*60*1000,
      path:'/'

    })
    return res.status(200).json({message:'Access Token'})

  }catch(err){
     return res.status(403).json({ message: "Invalid or expired refresh token" });
  }

}
const logOut = async (req, res) => {
  try {
  
    res.clearCookie("adminRefreshToken", {
      httpOnly: true,      
      secure: true,        
      sameSite: "none",
      path: "/",
    });
    res.clearCookie("adminAccessToken", {
      httpOnly: true,      
      secure: true,        
      sameSite: "none",
      path: "/",
    });

    

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Internal error" });
  }
};


module.exports = {signIn,fetchUsers,fetchOrders,generateAdminToken,logOut}