const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');

const multer = require('../../utils/multer');
const cloudinary = require('../../utils/cloudinary');

const authenticateToken = require('../../middleware/authorization');

const LoyaltyPoint = require('../models/loyaltyPoint');
const Customer = require('../models/customer');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {customerId, point, date, total, cash} = req.body;

            const loyaltypoint = new LoyaltyPoint({customerId, point, date, total, cash});

            await loyaltypoint.save();

            res.send(loyaltypoint);

    } catch (error) {
      res.send(error.message);
    }
})

router.get("/", authenticateToken, async (req, res) => {
  try {
    let whereClause = {};
    if (req.query.search) {
      whereClause = {
        [Op.or]: [{ loyaltypointName: { [Op.iLike]: `%${req.query.search}%` } }],
      };
    }
    
    let limit;
    let offset;
    if (req.query.pageSize && req.query.page) {
      limit = req.query.pageSize;
      offset = (req.query.page - 1) * req.query.pageSize;
    }
    const loyaltypoint = await LoyaltyPoint.findAll({
      where: whereClause,
      include: [Customer],
      order: ["id"],
      limit,
      offset
    });

    let totalCount;

    if (req.query.search) {
      totalCount = await LoyaltyPoint.count({
        where: whereClause,
      });
    } else {
      totalCount = await LoyaltyPoint.count();
    }

    if (req.query.page && req.query.pageSize) {
      const response = {
        count: totalCount,
        items: loyaltypoint,
      };

      res.json(response);
    } else {
      res.send(loyaltypoint);
    }
  } catch (error) {
    res.send(error.message);
  }
});

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        LoyaltyPoint.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "LoyaltyPoint was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update LoyaltyPoint with id=${id}. Maybe LoyaltyPoint was not found or req.body is empty!`
                });
              }
            })
      } catch (error) {
        res.send(error.message);
      }
})

router.post('/fileupload', multer.single('file'), async (req, res) => {
  try {
      const result = await cloudinary.uploader.upload(req.file.path);
      res.send(result);
  } catch (error) {
      res.send(error.message);
  }
});

router.delete('/:id', authenticateToken, async(req,res)=>{
  try {
    const loyaltypoints = await LoyaltyPoint.findOne({
      where: {id: req.params.id},
      order: ["id"]
    });

      try {
        const file = loyaltypoints.cloudinaryId;
        console.log(file);
        if(file){
          const result = await cloudinary.uploader.destroy(file);
        }
  
      } catch (error) {
        res.send(error.message);
        console.error(error);
      }

      const result = await loyaltypoints.destroy({
          force: true
      });

      if (result === 0) {
          return res.status(404).json({
            status: "fail",
            message: "LoyaltyPoint with that ID not found",
          });
        }
    
        res.status(204).json();
      }  catch (error) {
        res.send(error.message);
  }
  
})

router.patch('/imageupdate', async (req, res) => {
  try {
    // Use the `upload` method with the `public_id` of the image you want to update
    const result = await cloudinary.uploader.upload(req.body.fileUrl, req.file.path);

    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
  })

router.get('/byfileurl', authenticateToken, async (req, res) => {
try {
  const loyaltypoints = await LoyaltyPoint.findOne({
    where: {fileUrl: req.query.fileUrl},
    order: ["id"]
  });

  try {
    const file = loyaltypoints.cloudinaryId;
    console.log(file);
    const result = await cloudinary.uploader.destroy(file);

    loyaltypoints.fileUrl = '';
    loyaltypoints.cloudinaryId = '';
    await loyaltypoints.save();

    res.send(loyaltypoints);
  } catch (error) {
    res.send(error.message);
    console.error(error);
  }
} catch (error) {
  res.send(error.message);
}
});

module.exports = router;