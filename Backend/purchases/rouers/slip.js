const express = require('express');

const router = express.Router();
const Slip = require('../models/slip')
const Distributor = require('../../products/models/distributor');
const Entry = require('../models/entry');

router.post('/', async (req, res) => {
    try {
    
    const { entryId, distributorId, purchaseInvoice, amount,invoiceNo, description , date, contactPerson , status  } = req.body;

            const slip = new Slip({ entryId, distributorId, purchaseInvoice, amount , invoiceNo, description , date, contactPerson , status  });

            await slip.save();

            res.send(slip);

    } catch (error) {
        res.send(error.message);
    }
})

router.get('/', async (req, res) => {
    try {
        const slip = await Slip.findAll({order:['id']})

        res.send(slip);
    } catch (error) {
        res.send(error.message);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const slip = await Slip.findOne({
            where: {id: req.params.id}, 
            order:['id'],
            include: [Distributor]
        })
        
        res.send(slip);
    } catch (error) {
        res.send(error.message)
    }
  
})

// router.delete('/:id', authenticateToken, async(req,res)=>{
//     try {
//       const brands = await Slip.findOne({
//         where: {id: req.params.id},
//         order: ["id"]
//       });
  
//         try {
//           const file = brands.cloudinaryId;
//           console.log(file);
//           if(file){
//             const result = await cloudinary.uploader.destroy(file);
//           }
    
//         } catch (error) {
//           res.send(error.message);
//         }
  
//         const result = await brands.destroy({
//             force: true
//         });
  
//         if (result === 0) {
//             return res.status(404).json({
//               status: "fail",
//               message: "Brand with that ID not found",
//             });
//           }
      
//           res.status(204).json();
//         }  catch (error) {
//           res.send(error.message);
//     }
    
//   })
  
//   router.patch('/imageupdate', async (req, res) => {
//     try {
//       // Use the `upload` method with the `public_id` of the image you want to update
//       const result = await cloudinary.uploader.upload(req.body.fileUrl, req.file.path);
  
//       res.send(result);
//     } catch (error) {
//       res.send(error.message);
//     }
//   })




module.exports = router;