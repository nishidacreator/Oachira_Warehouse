const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');

const multer = require('../../utils/multer');
const cloudinary = require('../../utils/cloudinary');

const authenticateToken = require('../../middleware/authorization');

const Distributor = require('../models/distributor');
const ProductDistributor = require('../models/productDistributor');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {distributorName, address1, address2,state, phoneNumber, gstNo, panNo, fssaiNo, 
              contactPerson, status, fileUrl, cloudinaryId, products} = req.body;

            const distributor = new Distributor({distributorName, address1, address2,state, phoneNumber, gstNo, panNo,
               fssaiNo, contactPerson, status, fileUrl, cloudinaryId});

            await distributor.save();

            const distributorId = distributor.id;
            if(products.length > 0){
              for(let i = 0; i < products.length; i++) {
                products[i].distributorId = distributorId
                products[i].status = true;
              }
              const prodDist = await ProductDistributor.bulkCreate(products);
            }
            
            res.send(distributor);

    } catch (error) {
        res.send(error);
    }
})

router.get("/", authenticateToken, async (req, res) => {
  try {
    let whereClause = {};
    
    let limit;
    let offset;
    if (req.query.pageSize && req.query.page) {
      limit = req.query.pageSize;
      offset = (req.query.page - 1) * req.query.pageSize;
    }else {
      whereClause = {
        status : true
      }
    }
    const distributor = await Distributor.findAll({
      where: whereClause,
      order: ["id"],
      limit,
      offset,
    });

    let totalCount;
    totalCount = await Distributor.count();

    if (req.query.page && req.query.pageSize) {
      const response = {
        count: totalCount,
        items: distributor,
      };

      res.json(response);
    } else {
      res.send(distributor);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        Distributor.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Distributor was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Distributor with id=${id}. Maybe Distributor was not found or req.body is empty!`
                });
              }
            })
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: error.message,
        });
      }
})

router.post('/fileupload', multer.single('file'), async (req, res) => {
  try {
      const result = await cloudinary.uploader.upload(req.file.path);
      res.send(result);
  } catch (error) {
      res.send(error);
  }
});

router.delete('/:id', authenticateToken, async(req,res)=>{
  try {
    const distributors = await Distributor.findOne({
      where: {id: req.params.id},
      order: ["id"]
    });

      try {
        const file = distributors.cloudinaryId;
        console.log(file);
        if(file){
          const result = await cloudinary.uploader.destroy(file);
        }
  
      } catch (error) {
        res.status(500).send(error);
        console.error(error);
      }

      const result = await distributors.destroy({
          force: true
      });

      if (result === 0) {
          return res.status(404).json({
            status: "fail",
            message: "Distributor with that ID not found",
          });
        }
    
        res.status(204).json();
      }  catch (error) {
      res.send({error: error.message})
  }
  
})

router.patch('/imageupdate', async (req, res) => {
  try {
    // Use the `upload` method with the `public_id` of the image you want to update
    const result = await cloudinary.uploader.upload(req.body.fileUrl, req.file.path);

    res.send(result);
  } catch (error) {
    console.error('Error updating image:', error.message);
  }
  })

router.get('/byfileurl', authenticateToken, async (req, res) => {
try {
  const distributors = await Distributor.findOne({
    where: {fileUrl: req.query.fileUrl},
    order: ["id"]
  });

  try {
    const file = distributors.cloudinaryId;
    console.log(file);
    const result = await cloudinary.uploader.destroy(file);

    distributors.fileUrl = '';
    distributors.cloudinaryId = '';
    await distributors.save();

    res.send(distributors);
  } catch (error) {
    res.status(500).send(error);
    console.error(error);
  }
} catch (error) {
  console.error("Error in distributor retrieval:", error);
  res.status(500).json({ error: "Internal Server Error" });
}
});

router.patch('/statusupdate/:id', authenticateToken, async(req,res)=>{
  try {

    let status = req.body.status;
    let result = await Distributor.findByPk(req.params.id);
    result.status = status

    await result.save();
    res.send(result);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
})

module.exports = router;