const express = require('express');
const ProductDistributor = require('../models/productDistributor');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const {Op} = require('sequelize');
const Product = require('../models/product');
const Distributor = require('../models/distributor');

router.post('/', authenticateToken, async (req, res) => {
    try {                                  
            const products = req.body;
            console.log(products);

            let result = await ProductDistributor.bulkCreate(products);

            res.send(result);

    } catch (error) {
        res.send(error.message);
    }
})

router.get('/byditsributorid/:id', authenticateToken, async(req,res)=>{
  try {
      const result = await ProductDistributor.findAll({
        where: {distributorId: req.params.id},
        include: [Product, Distributor]
      });
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})

// router.get("/", authenticateToken, async (req, res) => {
//     try {
//       let whereClause = {};
//       if (req.query.search) {
//         whereClause = {
//           [Op.or]: [{ productdistributorName: { [Op.iLike]: `%${req.query.search}%` } }],
//         };
//       }
  
//       let limit;
//       let offset;
//       if (req.query.pageSize && req.query.page) {
//         limit = req.query.pageSize;
//         offset = (req.query.page - 1) * req.query.pageSize;
//       }
//       const productdistributor = await ProductDistributor.findAll({
//         where: whereClause,
//         order: ["id"],
//         limit,
//         offset,
//         include: [Distributor, Product]
//       });
  
//       let totalCount;
  
//       if (req.query.search) {
//         totalCount = await ProductDistributor.count({
//           where: whereClause,
//         });
//       } else {
//         totalCount = await ProductDistributor.count();
//       }
  
//       if (req.query.page && req.query.pageSize) {
//         const response = {
//           count: totalCount,
//           items: productdistributor,
//         };
  
//         res.json(response);
//       } else {
//         res.send(productdistributor);
//       }
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
// });

// router.patch('/:id', authenticateToken, async(req,res)=>{
//   try {
//       ProductDistributor.update(req.body, {
//           where: { id: req.params.id }
//         })
//           .then(num => {
//             if (num == 1) {
//               res.send({
//                 message: "ProductDistributor was updated successfully."
//               });
//             } else {
//               res.send({
//                 message: `Cannot update ProductDistributor with id=${id}. Maybe ProductDistributor was not found or req.body is empty!`
//               });
//             }
//           })
//     } catch (error) {
//       res.status(500).json({
//         status: "error",
//         message: error.message,
//       });
//     }
// })

router.delete('/:id', authenticateToken, async(req,res)=>{
  try {
      const productdistributor = await ProductDistributor.findOne({
        where: {id: req.params.id},
        order: ["id"]
      });

      const result = await productdistributor.destroy({
          force: true
      });

      if (result === 0) {
          return res.status(404).json({
            status: "fail",
            message: "ProductDistributor with that ID not found",
          });
        }
    
        res.status(204).json();
      }  catch (error) {
        res.send(error.message);
  }
  
})

router.patch('/status/:id', authenticateToken, async(req,res)=>{
  try {

      const data = {
        status: req.body.status
      }
      ProductDistributor.update(data, {
          where: { id: req.params.id }
        })
          .then(num => {
            if (num == 1) {
              res.send({
                message: "ProductDistributor was updated successfully."
              });
            } else {
              res.send({
                message: `Cannot update ProductDistributor with id=${id}. Maybe ProductDistributor was not found or req.body is empty!`
              });
            }
          })
    } catch (error) {
      res.send(error.message);
    }
})

router.patch('/statusupdate/:id', authenticateToken, async(req,res)=>{
  try {

    let status = req.body.status;
    let result = await ProductDistributor.findByPk(req.params.id);
    result.status = status

    await result.save();
    res.send(result);
    } catch (error) {
      res.send(error.message);
    }
})


module.exports = router;