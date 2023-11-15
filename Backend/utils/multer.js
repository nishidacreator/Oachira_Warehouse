const multer = require('multer');
const path = require('path');

  module.exports = multer({
    storage : multer.diskStorage({
        filename: (req, file, cb)=>{
          cb(null, file.originalname)
        }
      }),

    limits : {fileSize : '1000000'},
    
    fileFilter : (req,file,cb)=>{
      const fileTypes = /jpeg|jpg|png|gif/
      const mimetype = fileTypes.test(file.mimetype)
      const extname = fileTypes.test(path.extname(file.originalname))
  
      if(mimetype && extname){
        return cb(null, true)
      }
      cb('File format is not supported')
    }
  })
  