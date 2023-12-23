const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');

const multer = require('../../utils/multer');
const cloudinary = require('../../utils/cloudinary');

const authenticateToken = require('../../middleware/authorization');

const Brand = require('../models/brand');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {brandName, status, fileUrl, cloudinaryId} = req.body;

            const brand = new Brand({brandName, status, fileUrl, cloudinaryId});

            await brand.save();

            res.send(brand);

    } catch (error) {
        res.send(error);
    }
})

router.get("/", authenticateToken, async (req, res) => {
  try {
    let whereClause = {};
    if (req.query.search) {
      whereClause = {
        [Op.or]: [{ brandName: { [Op.iLike]: `%${req.query.search}%` } }],
      };
    }
    
    let limit;
    let offset;
    if (req.query.pageSize && req.query.page) {
      limit = req.query.pageSize;
      offset = (req.query.page - 1) * req.query.pageSize;
    }
    const brand = await Brand.findAll({
      where: whereClause,
      order: ["id"],
      limit,
      offset,
    });

    let totalCount;

    if (req.query.search) {
      totalCount = await Brand.count({
        where: whereClause,
      });
    } else {
      totalCount = await Brand.count();
    }

    if (req.query.page && req.query.pageSize) {
      const response = {
        count: totalCount,
        items: brand,
      };

      res.json(response);
    } else {
      res.send(brand);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        Brand.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Brand was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Brand with id=${id}. Maybe Brand was not found or req.body is empty!`
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
    const brands = await Brand.findOne({
      where: {id: req.params.id},
      order: ["id"]
    });

      try {
        const file = brands.cloudinaryId;
        console.log(file);
        if(file){
          const result = await cloudinary.uploader.destroy(file);
        }
  
      } catch (error) {
        res.status(500).send(error);
        console.error(error);
      }

      const result = await brands.destroy({
          force: true
      });

      if (result === 0) {
          return res.status(404).json({
            status: "fail",
            message: "Brand with that ID not found",
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
  const brands = await Brand.findOne({
    where: {fileUrl: req.query.fileUrl},
    order: ["id"]
  });

  try {
    const file = brands.cloudinaryId;
    console.log(file);
    const result = await cloudinary.uploader.destroy(file);

    brands.fileUrl = '';
    brands.cloudinaryId = '';
    await brands.save();

    res.send(brands);
  } catch (error) {
    res.status(500).send(error);
    console.error(error);
  }
} catch (error) {
  console.error("Error in brand retrieval:", error);
  res.status(500).json({ error: "Internal Server Error" });
}
});

module.exports = router;