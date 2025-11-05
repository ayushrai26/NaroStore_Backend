const Cart = require('../models/cartModel')
const Product = require('../models/productModel')

const addToCart = async(req,res)=>{
  
    try{
      console.log('incoming')
   const userId = req.user.id;
   console.log(userId)
  const {productId,quantity,size,price} = req.body;
  console.log(price)
  console.log(productId,quantity,'productId,quantity')
  
  const product = await Product.findById(productId)
  if(!product){
    return res.status(404).json({message:'Product not Found'})
  }
  let cart = await Cart.findOne({userId})
  if(!cart){
    cart = new Cart({userId,
        items:[{
            productId,quantity,size
        }],
        totalPrice:product.price*quantity
    })
    await cart.save();
      return res.status(200).json({ message: 'Product added to cart', cart });
    
  }
   const existingItem =  cart.items.find((item)=>item.productId?.toString() === productId && item.size ===size)
   if(!existingItem){
    cart.items.push({productId,quantity,size})
   }else{
    existingItem.quantity += quantity;
   }
   let total = 0;
    for (const item of cart.items) {
      const prod = await Product.findById(item.productId);
      if (prod) total += prod.price * item.quantity;
    }
    cart.totalPrice = total;

    await cart.save();
   console.log(cart)
   return res.status(200).json({message:'Product added to cart',cart}) 

  

    }catch(err){
      console.error('Add to cart error',err)
        res.status(500).json({message:'Internal server error'})
    }
  


}

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let existingUserCart = await Cart.findOne({ userId }).populate('items.productId');

    if (!existingUserCart) {
      return res.status(404).json({ message: 'No items in the cart' });
    }

  
    existingUserCart.items = existingUserCart.items.filter(
      (item) => item.productId !== null && item.productId !== undefined
    );

    return res.status(200).json({ message: 'cart Items', existingUserCart });
  } catch (err) {
    console.error('Fetch cart error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { productId, size,type } = req.body;
    const userId = req.user.id;
    if(!userId){
      return res.status(401).json({message:'Unauthorized'})
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(i => i.productId.toString() === productId && i.size===size);
    if (!item) return res.status(404).json({ message: 'Item not found' });
   
    if(type==='increase'){
       item.quantity++
    }else if(type ==='decrease'){
      item.quantity--
    }
    

    const total = await Promise.all(
      cart.items.map(async it => {
        const p = await Product.findById(it.productId);
        return p ? p.price * it.quantity : 0;
      })
    ).then(vals => vals.reduce((sum, v) => sum + v, 0));

    cart.totalPrice = total;
    await cart.save();
    await cart.populate('items.productId');

    res.status(200).json({ message: 'Quantity updated', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeItem = async (req, res) => {
  try {
    const { productId, size } = req.body;
    const userId = req.user.id;
    console.log(userId,productId,size)

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      i => !(i.productId.toString() === productId && i.size === size)
    );

    const total = await Promise.all(
      cart.items.map(async it => {
        const p = await Product.findById(it.productId);
        return p ? p.price * it.quantity : 0;
      })
    ).then(vals => vals.reduce((sum, v) => sum + v, 0));

    cart.totalPrice = total;
    await cart.save();
    await cart.populate('items.productId');

    res.status(200).json({ message: 'Item removed', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

  


module.exports = {addToCart,getCart,removeItem,updateQuantity}