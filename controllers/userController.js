const user = require('../models/userModel');
const {hashedPassword,comparePassword} = require('../utils/hashing/hashingPassword');
const jwt = require('jsonwebtoken')



const signUp = async(req,res)=>{

    try{
        let {fullName,email,password} = req.body;
        console.log(fullName,email,password)
  email = email?.trim();
  password = password?.trim();
  fullName = fullName?.trim();
  
  if(!email || !password  || !fullName){
    return res.status(400).json('All fields are required')
  }
  const isUserExist = await user.findOne({email});
  if(isUserExist){
    return res.status(409).json({message:'User Already exist'})
  }
  const hashed = await hashedPassword(password)

  const newUser = new user({fullName,
    
    email,
    
    password:hashed})
  await newUser.save();
  return res.status(201).json({message:'User created Successfully',user:newUser})

    }catch(err){
        console.log('Signup error',err)
        return res.status(500).json({message:'Internal Server Error'})

    }
  

}

const signIn = async(req,res)=>{
    try{
        let {email,password} = req.body;
        console.log(email,password)
        if(!email || !password){
    return res.status(400).json({message:'All fields are required'})
        }
        const isUserExist = await user.findOne({email})
        console.log(isUserExist)
        if(!isUserExist){
            return res.status(404).json({message:'User not found'})
        }
       const isPassword = await comparePassword(password,isUserExist.password)
       if(!isPassword){
        return res.status(401).json({message:'Invalid Password'})
       }
      const accessToken =  jwt.sign(
        {id:isUserExist._id,role:isUserExist.role},
        process.env.JWT_SECRET,
        {expiresIn:'10m'}
    )
    const refreshToken = jwt.sign(
      {id:isUserExist._id,role:isUserExist.role},
      process.env.JWT_SECRET_REFRESH_KEY,
      {expiresIn:'15d'}
    )
    res.cookie("userRefreshToken",refreshToken,{
      httpOnly:true,
      secure:true,
      sameSite: "none",
      maxAge:15*24*60*60*1000,
      path:'/'
    })
    res.cookie("userAccessToken",accessToken,{
      httpOnly:true,
      secure:true,
      sameSite:"none",
      maxAge:10*60*1000,
      path:'/'
    })
    return res.status(200).json({message:'Login successfully',isUserExist})

  
    }catch(err){
        console.log('Signin error',err)
        return res.status(500).json({message:'Internal Server error'})
    }

}



const forgetPassword = async(req,res)=>{

    try{
        let {email,newPassword} = req.body;
    email = email?.trim();
    newPassword = newPassword?.trim();
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }
    const isUserExist = await user.findOne({email})
    if(!isUserExist){
        return res.status(401).json({message:'User not exist'})
    }
    const hashed = await hashedPassword(newPassword)
    isUserExist.password = hashed;
    await isUserExist.save()

    return res.status(200).json({ message: 'Password updated successfully' });


    }catch(err){
      console.error('Forget password error:', err);
    return res.status(500).json({ message: 'Server error' });
    }
    

}



const userDetails = async(req,res)=>{
  try{
    const userId = req.user.id
    console.log(userId,'userId')
    if(!userId){
      return res.status(404).json({message:'Not Authorized'})
    }

    const existUser = await user.findOne({_id:userId})
    if(!existUser){
      return res.status(404).json({message:'User not found'})
    }
    return res.status(200).json({message:'User found',existUser})

  }catch(err){
    return res.status(500).json({message:'Internal server error'})

  }
}

const generateUserToken = async(req,res)=>{
  const refreshToken = req.cookies.userRefreshToken;
  
  if(!refreshToken){
    return res.status(401).json({message:'No refresh token found'})
  }
  try{
const userData = jwt.verify(refreshToken,process.env.JWT_SECRET_REFRESH_KEY)
console.log(userData,'userdata')
    const accessToken =  jwt.sign(
        {id:userData.id,role:userData.role},
        process.env.JWT_SECRET,
        {expiresIn:'10m'}
    )
    
    res.cookie('userAccessToken',accessToken,{
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

const updateUser = async(req,res)=>{
  try{
    const userId = req.user.id;
    
    const updatedData = req.body;
    
    if(!userId){
      return res.status(404).json({message:'User not found'})
    }
    const isUserExist = await user.findByIdAndUpdate(userId,{$set:updatedData},{new:true})
    console.log(isUserExist,'is')
    if(!isUserExist){
      return res.status(404).json({message:'User not found'})
    }
    
     res.status(200).json({
      message: "User details updated successfully",
      user: isUserExist,
    });
  

  }catch(err){
    return res.status(500).json({message:'Internal server error'})
  }
}

const logOut = async (req, res) => {
  try {
  
    res.clearCookie("userRefreshToken", {
      httpOnly: true,      
      secure: true,        
      sameSite: "none",
      path: "/",
    });
    res.clearCookie("userAccessToken", {
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


module.exports = {signIn,signUp,forgetPassword,userDetails,generateUserToken,logOut,updateUser}