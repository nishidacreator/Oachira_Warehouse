const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');

const authenticateToken = require('../../middleware/authorization');

const SubCategory = require('../models/subCategory');
const Category = require('../models/category');

const multer = require('../../utils/multer')
const cloudinary = require('../../utils/cloudinary');

router.post('/fileupload', multer.single('file'), async (req, res) => {
  try {
      const result = await cloudinary.uploader.upload(req.file.path);
      res.send(result);
  } catch (error) {
      res.send(error.message);
  }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {subCategoryName, categoryId, status, cloudinaryIdSub, fileUrlSub } = req.body;

            const subcategory = new SubCategory({subCategoryName, categoryId, status, cloudinaryIdSub, fileUrlSub});

            await subcategory.save();

            res.send(subcategory);

    } catch (error) {
        res.send(error.message);
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
      }
      const subcategory = await SubCategory.findAll({
        include: [Category],
        where: whereClause,
        order: ["id"],
        limit,
        offset,
      });
  
      let totalCount;
      totalCount = await SubCategory.count();
  
      if (req.query.page && req.query.pageSize) {
        const response = {
          count: totalCount,
          items: subcategory,
        };
  
        res.json(response);
      } else {
        res.send(subcategory);
      }
    } catch (error) {
      res.send(error.message);
    }
});

router.patch('/:id', authenticateToken, async(req,res)=>{
  try {

    SubCategory.update(req.body, {
        where: { id: req.params.id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "SubCategory was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update SubCategory with id=${id}. Maybe SubCategory was not found or req.body is empty!`
            });
          }
        })
    } catch (error) {
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
    const categories = await SubCategory.findOne({
      where: {fileUrlSub: req.query.fileUrl},
      order: ["id"]
    });

    try {
      const file = categories.cloudinaryIdSub;
      console.log(file);
      const result = await cloudinary.uploader.destroy(file);

      categories.fileUrlSub = '';
      categories.cloudinaryIdSub = '';
      await categories.save();

      res.send(categories);
    } catch (error) {
      res.send(error.message);
    }
  } catch (error) {
    res.send(error.message);
  }
});

router.delete('/:id', authenticateToken, async(req,res)=>{
  try {
    const categories = await SubCategory.findOne({
      where: {id: req.params.id},
      order: ["id"]
    });

      try {
        const file = categories.cloudinaryIdSub;
        if(file){
          const result = await cloudinary.uploader.destroy(file);
        }
  
      } catch (error) {
        res.send(error.message);
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
        res.send(error.message);
  }
  
})

router.patch('/statusupdate/:id', authenticateToken, async(req,res)=>{
  try {

    let status = req.body.status;
    let result = await SubCategory.findByPk(req.params.id);
    result.status = status

    await result.save();
    res.send(result);
    } catch (error) {
      res.send(error.message);
    }
})
module.exports = router;