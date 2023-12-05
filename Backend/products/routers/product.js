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
            const { productName, code, barCode, primaryUnitId, categoryId, brandId, reorderQuantity, loyaltyPoint} = req.body;

            const result = new Product({productName, code, barCode, primaryUnitId, categoryId, brandId, reorderQuantity, loyaltyPoint});
            await result.save();
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
        [Op.or]: [
          { productName: { [Op.iLike]: `%${req.query.search}%` } },
          { code: { [Op.iLike]: `%${req.query.search}%` } },
          { barCode: { [Op.iLike]: `%${req.query.search}%` } },
        ],
      };
      console.log(whereClause)
    }

    let limit;
    let offset;

    if (req.query.pageSize && req.query.page) {
      limit = req.query.pageSize;
      offset = (req.query.page - 1) * req.query.pageSize;
    }

    const products = await Product.findAll({
      where: whereClause,
      include: [Category, Brand, Hsn, Gst, SubCategory, Location],
      order: ["id"],
      limit, 
      offset
    });

    let totalCount;

    if (req.query.search) {
      totalCount = await Product.count({
        where: whereClause,
      });
    } else {
      totalCount = await Product.count();
    }

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
    res.status(500).json({ error: error.message });
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
        res.send({error: error.message})
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
        res.status(500).json({
          status: "error",
          message: error.message,
        });
      }
})

module.exports = router;