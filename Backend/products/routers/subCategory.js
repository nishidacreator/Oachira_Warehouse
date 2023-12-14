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
      res.send(error);
  }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {subCategoryName, categoryId, status, cloudinaryIdSub, fileUrlSub } = req.body;

            const subcategory = new SubCategory({subCategoryName, categoryId, status, cloudinaryIdSub, fileUrlSub});

            await subcategory.save();

            res.send(subcategory);

    } catch (error) {
        res.send(error);
    }
})

router.get("/", authenticateToken, async (req, res) => {
    try {
      let whereClause = {};
      if (req.query.search) {
        whereClause = {
          [Op.or]: [{ subcategoryName: { [Op.iLike]: `%${req.query.search}%` } }],
        };
      }
  
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
  
      if (req.query.search) {
        totalCount = await SubCategory.count({
          where: whereClause,
        });
      } else {
        totalCount = await SubCategory.count();
      }
  
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
      res.status(500).json({ error: error.message });
    }
});

module.exports = router;