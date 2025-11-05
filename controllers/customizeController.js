const customize = require('../models/customizeModel')

const submitCustomize = async(req,res)=>{
    try{
        const {userId,clothType,text,color,size,quantity} = req.body;
        if(!userId){
            return res.status(401).json({message:'Unathorized user'})
        }
        if(!clothType || !size){
            return res.status(401).json({message:'fields are required'})
        }
        const newDesign = new customize({
            userId,
            clothType,
            color,
            size,
            text,
            quantity,
        })
        await newDesign.save();
        return res.status(201).json({message:'design submitted',newDesign})


    }catch(err){

        return res.status(500).json({message:'Internal server error',err})

    }
}


module.exports = {submitCustomize}