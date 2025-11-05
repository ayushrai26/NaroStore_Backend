const Order = require('../models/orders')



const fetchOrder = async(req,res)=>{
    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({message:'Invalid user id'})
        }
        const isOrderExist = await Order.find({userId})
        if(!isOrderExist || isOrderExist.length===0){
            return res.status(404).json({message:'No order found for this user'})
        }
        return res.status(200).json({message:'Order fetch successfully',isOrderExist})

    }catch(err){
        return res.status(500).json({message:'Internal server error'})
    }
}

module.exports = {fetchOrder}