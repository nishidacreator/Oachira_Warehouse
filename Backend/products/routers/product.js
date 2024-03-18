const express = require('express');
const Product = require('../models/product');
const router = express.Router();
const PrimaryUnit = require('../models/primayUnit');
const Category = require('../models/category');
const Brand = require('../models/brand');
const {Op} = require('sequelize');
const multer = require('../../utils/multer');
const cloudinary = require('../../utils/cloudinary');
const authenticateToken = require('../../middleware/authorization');
const Hsn = require('../models/hsn');
const Gst = require('../models/gst');
const SubCategory = require('../models/subCategory');
const Location = require('../models/location');


router.post('/', authenticateToken, async (req, res) => {
    try {
            const { productName, code, barCode, subCategoryId, categoryId, brandId, reorderQuantity, warehouseLoyalityPoint,  retailLoyalityPoint,
              isSpecial,isRouteItem,openingStock, primaryUnitId,  baseUnitId, cloudinaryId, fileUrl, brockerage } = req.body;

            const result = new Product({ productName, code, barCode, subCategoryId, categoryId, brandId, reorderQuantity, warehouseLoyalityPoint, 
              retailLoyalityPoint,isSpecial,isRouteItem,openingStock, primaryUnitId, baseUnitId, cloudinaryId, fileUrl, brockerage });
              
            await result.save();
            res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});


router.get('/routeProducts', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        isRouteItem: true
      }
    });
    res.send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/fileupload', multer.single('file'), async (req, res) => {
  try {
      const result = await cloudinary.uploader.upload(req.file.path);
      res.send(result);
  } catch (error) {
      res.send(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    let whereClause = {};
    
    let limit;
    let offset;

    if (req.query.pageSize && req.query.page) {
      limit = parseInt(req.query.pageSize, 10) || 10; // Default to 10 if not a valid number
      offset = (parseInt(req.query.page, 10) - 1) * limit || 0;
    }else {
      whereClause = {
        status : true
      }
    }

    const products = await Product.findAll({
      where: whereClause,
      include: [Category, Brand, Hsn, Gst, SubCategory, Location, 'baseUnit'],
      order: ["id"],
      limit, 
      offset
    });

    let totalCount;
    totalCount = await Product.count();

    if (req.query.page && req.query.pageSize) {
      const response = {
        count: totalCount,
        items: products,
      };

      res.json(response);
    } else {
      res.send(products);
    }
  } catch (error) {
    res.send(error.message);
  }
});

router.get('/filter', async(req,res)=>{
    try {
        let {search} = req.body

        const product = await Product.findAll({where: {[Op.or]:[{productName: search}, {code: search}, {barCode: search}]},include: [PrimaryUnit, Category, Brand]});
        res.send(product);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await Product.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Product with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
          res.send(error.message);
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        Product.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Product was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`
                });
              }
            })
      } catch (error) {
        res.send(error.message);
      }
})

router.get('/byfileurl', authenticateToken, async (req, res) => {
  try {
    const categories = await Product.findOne({
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
      res.send(error.message);
    }
  } catch (error) {
    res.send(error.message);
  }
});

router.patch('/statusupdate/:id', authenticateToken, async(req,res)=>{
  try {

    let status = req.body.status;
    let result = await Product.findByPk(req.params.id);
    result.status = status

    await result.save();
    res.send(result);
    } catch (error) {
      res.send(error.message);
    }
})
module.exports = router;