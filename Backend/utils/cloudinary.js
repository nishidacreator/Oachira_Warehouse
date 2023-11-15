const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dnstyttdd', 
  api_key: '835542756993169', 
  api_secret: 'DcBILYo58QdhWY6H5Gs8asbPc-Q' 
});

module.exports = cloudinary;