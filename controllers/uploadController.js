const cloudinary = require('../utils/cloudinary/cloudinary')


const uploadMultiplePhotos = async(req,res)=>{
    try{
      console.log(req.files,'files')
   if(!req.files || req.files.length === 0){
   return res.status(400).json({ message: 'No files uploaded' })
   }
   console.log(req.files,'files')
  
   const imageUrls = req.files.map(file=>file.path)

    return res.status(200).json({
      message: 'Images uploaded successfully',
      images: imageUrls
    });
    }catch(err){
     console.error('Upload error:', err);
    return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { uploadMultiplePhotos };