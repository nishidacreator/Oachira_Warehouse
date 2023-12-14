const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');

const multer = require('../../utils/multer');
const cloudinary = require('../../utils/cloudinary');

const authenticateToken = require('../../middleware/authorization');

const Category = require('../models/category');
const SubCategory = require('../models/subCategory');

router.post('/', authenticateToken, async (req, res) => {
    try {
      const {categoryName, taxable, status, hsnCode, cloudinaryId, fileUrl, subCategories} = req.body;

      const category = new Category({categoryName, taxable, status, hsnCode, fileUrl, cloudinaryId});

      const result = await category.save();

      const categoryId = result.id;
      if(subCategories){
        for(let i=0; i<subCategories.length; i++) {
          subCategories[i].categoryId = categoryId;
          subCategories[i].status = true;
        }
        const sub = await SubCategory.bulkCreate(subCategories)

        const responseData = {
          category: result,
          subCategories: sub    
        };
        res.send(responseData);
      }else{
        res.send(category);
      } 
      
  } catch (error) {
      console.error(error); // Log the error for debugging purposes
      res.status(500).send('An error occurred while processing the request.');
  }
});

router.post('/fileupload', multer.single('file'), async (req, res) => {
  try {
      const result = await cloudinary.uploader.upload(req.file.path);
      res.send(result);
  } catch (error) {
      res.send(error);
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    let whereClause = {};

    if (req.query.search) {
      whereClause = {
        [Op.and]: [
          {
            [Op.or]: [
              {
                categoryName: { [Op.iLike]: `%${req.query.search}%` },
              },
            ],
          },
          { status: true }, // Ensure status is true
        ],
      };
    } else {
      whereClause = { status: true }; // Ensure status is true if no search query
    }
    

    let limit;
    let offset;

    if (req.query.pageSize && req.query.page) {
      limit = parseInt(req.query.pageSize, 10) || 10; // Default to 10 if not a valid number
      offset = (parseInt(req.query.page, 10) - 1) * limit || 0;
    }

    const categories = await Category.findAll({
      where: whereClause,
      order: ["id"],
      limit,
      offset,
    });

    let totalCount;

    if (req.query.search) {
      totalCount = await Category.count({
        where: whereClause,
      });
    } else {
      totalCount = await Category.count();
    }

    if (req.query.page && req.query.pageSize) {
      const response = {
        count: totalCount,
        items: categories,
      };

      res.json(response);
    } else {
      res.json(categories);
    }
  } catch (error) {
    console.error("Error in category retrieval:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {
      const categories = await Category.findOne({
        where: {id: req.params.id},
        order: ["id"]
      });
  
        try {
          const file = categories.cloudinaryId;
          console.log(file);
          const result = await cloudinary.uploader.destroy(file);
    
        } catch (error) {
          res.status(500).send(error);
          console.error(error);
        }

        const result = await categories.destroy({
            force: true
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Category with that ID not found",
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

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {

      Category.update(req.body, {
          where: { id: req.params.id }
        })
          .then(num => {
            if (num == 1) {
              res.send({
                message: "Category was updated successfully."
              });
            } else {
              res.send({
                message: `Cannot update Category with id=${id}. Maybe Category was not found or req.body is empty!`
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

router.get('/byfileurl', authenticateToken, async (req, res) => {
  try {
    const categories = await Category.findOne({
      where: {fileUrl: req.query.fileUrl},
      order: ["id"]
    });

    try {
      const file = categories.cloudinaryId;
      console.log(file);
      const result = await cloudinary.uploader.destroy(file);

      categories.fileUrl = '';
      categories.cloudinaryId = '';
      await categories.save();

      res.send(categories);
    } catch (error) {
      res.status(500).send(error);
      console.error(error);
    }
  } catch (error) {
    console.error("Error in category retrieval:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;