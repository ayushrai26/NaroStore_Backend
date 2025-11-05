const Product = require('../models/productModel')
const ReviewAndRating = require('../models/productReviewsAndRating')

const newProduct = async(req,res)=>{

    try{
     const {name,description,price,category,images} = req.body;
   if(!name||!price||!images||images.length===0){
    return res.status(400).json({message:'All fields are required'})
   }

   const product = new Product({
    name,
    description,
    price,
    category,
    images
   })

   await product.save();
   return res.status(201).json({
      message: 'Product created successfully',
      product,
    });
    }catch(err){
        console.error('Product creation error:', err);
    return res.status(500).json({ message: 'Server error' });

    }
   

}

const fetchProducts = async(req,res)=>{
  try{

   const allProducts =  await Product.find()
   console.log(allProducts)
   if(!allProducts || allProducts.length===0){
    return res.status(404).json({message:'No products to show'})
   }

   return res.status(200).json({message:'All products',allProducts})

  

  }catch(err){

  res.status(500).json({message:'Internal Server error'})

  }
}

const fetchSingleProduct = async(req,res)=>{
  try{
    const {productId} = req.params;
    const product = await Product.findById(productId)
    if(!product){
      return res.status(404).json({message:'No product found'})
    }
    return res.status(200).json({message:'Product found',product})

  }catch(err){

    res.status(500).json({message:'Internal Server error'})
  }
}

const deleteProduct = async(req,res)=>{
    try {
    const { productId } = req.params; 

    console.log(productId,'id')
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({
      message: 'Product deleted successfully',
      deletedProduct: product,
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

const filterProduct = async(req,res)=>{
  try{
    
    let {searchQuery,category,priceRange} = req.body;
    priceRange = parseInt(priceRange.split('-')[1])
    console.log(priceRange,'pricerange')
    
    
    let filter = {};
    if (searchQuery && searchQuery.trim() !== "") {
      filter.name = { $regex: searchQuery, $options: "i" };
    }

    if (category && category !== "all") {
      
      filter.category = category.toLowerCase();
    }

    if(priceRange && priceRange!=="all"){
      filter.price = priceRange
    }

    
    
    const existProduct = await Product.find(filter)
    if(!existProduct){
      return res.status(404).json({message:'Product not found'})
    }
    console.log(existProduct)
    return res.status(200).json({message:'Product found',existProduct})

  }catch(err){
     console.log(err)
     res.status(500).json({message:'Internal server error'})
  }
}

const productReview = async(req,res)=>{
  try{
    const {productId} = req.params;
    if(!productId){
      return res.status(401).json({message:'product is required'})
    }
    const existProduct = await ReviewAndRating.find({productId}).populate('productId')
    if(!existProduct){
      return res.status(404).json({message:'Product Not found'})
    }

    return res.status(200).json({message:'Product found',existProduct})

  }catch(err){

    console.log(err)
    res.status(500).json({message:'Internal Server error',err})

  }
}

const submitReview = async(req,res)=>{
    try{
      const {productId,formdata} = req.body;
    
      console.log(productId,formdata)
      if(!productId){
        return res.status(401).json({message:'Product not found'})
      }
      if (!formdata || !formdata.author || !formdata.comment || !formdata.rating) {
      return res.status(400).json({ message: "Incomplete review data" });
    }
      const existProduct = await ReviewAndRating.findOne({productId})
      console.log(existProduct)
      if(!existProduct){
        const newReview = new ReviewAndRating({
         productId,
         
         reviews:[formdata]
      })
      await newReview.save();
      return res.status(201).json({message:'Review submitted successfully',newReview})
      }else{
        existProduct.reviews.push(formdata);
      await existProduct.save();

      return res.status(200).json({
        message: "Review added successfully",
        review: existProduct,
      });
      }
      
      
      
    


    }catch(err){
      return res.status(500).json({message:'Internal Server Error'})
    }
}

const fetchReview = async(req,res)=>{
  try{
   const {productId} = req.body
   console.log(productId,'productId')
   if(!productId){
    return res.status(401).json({message:'Need product to load reviews'})
   }
   const existProductReview = await ReviewAndRating.findOne({productId})
   if(!existProductReview){
    return res.status(404).json({message:'No reviews to show'})
   }
   return res.status(200).json({message:'Product reviews',existProductReview})
  }catch(err){
    return res.status(500).json({message:'Internal server error'})
  }
}

const editProduct = async(req,res)=>{
     try{
      const editingProduct = req.body;
      console.log(editingProduct,'edit')
      if(!editingProduct){
        return res.status(400).json({message:'Invalid data'})
      }
      const {productId} = req.params;
      if(!productId){
        return res.status(400).json({message:'Invalid Product'})
      }
      const product = await Product.findByIdAndUpdate(productId,{$set:editingProduct},{new:true})
    
      console.log(product,'pro')
      if(!product){
        return res.status(404).json({message:'Product Not found'})
      }

  return res.status(200).json({message:'Product Updated successfully'})

     }catch(err){
         return res.status(500).json({message:'Internal Server error'})
     }
}

const fetchProductHomePage = async(req,res)=>{
  try{

   const allProducts =  await Product.find().limit(3)
   console.log(allProducts)
   if(!allProducts || allProducts.length===0){
    return res.status(404).json({message:'No products to show'})
   }

   return res.status(200).json({message:'All products',allProducts})

  

  }catch(err){

  res.status(500).json({message:'Internal Server error'})

  }
}



module.exports = {newProduct,deleteProduct,fetchProducts,fetchSingleProduct,filterProduct,productReview,submitReview,fetchReview,editProduct,fetchProductHomePage}