const bcrypt = require('bcrypt')

const hashedPassword = async(plainPassword)=>{
   const salt = await bcrypt.genSalt(10)
   const hashedPassword = await bcrypt.hash(plainPassword,salt)
   return hashedPassword;
}

const comparePassword = async(password,hashedPassword)=>{
    return await  bcrypt.compare(password,hashedPassword)
}

module.exports = {hashedPassword,comparePassword}