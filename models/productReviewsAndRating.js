const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',     
    required: true
  },
  
  reviews: [
    {
        author: {
    type: String,        
    default: "NaroStore Customer"
  },
      comment: {
        type: String,
        required: false,
        trim: true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true 
});

const ProductReview = mongoose.model('ProductReview', reviewSchema);
module.exports = ProductReview;
