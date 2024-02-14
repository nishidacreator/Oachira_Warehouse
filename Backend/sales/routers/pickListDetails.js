const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const PickListDetails = require('../models/pickListDetails');
const Route = require('../models/route');
const Product = require('../../products/models/product');
const PickList = require('../models/pickList');
const Customer = require('../models/customer');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {products} = req.body;

            const result = await PickListDetails.bulkCreate(products)

            await result.save();

            res.send(result);

    } catch (error) {
        res.send(error);
    }
})

router.get('/:id', authenticateToken,async(req,res)=>{

    try {
        const result = await PickListDetails.findAll(
          {where :{pickListId : req.params.id},
          include: [{
            model : PickList, 
            include: {
              model: Customer
            }}, {
            model: Product
          }], order:['id']});
        res.send(result);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/byid/:id', authenticateToken, async(req,res)=>{

  try {
      const result = await PickListDetails.findOne(
        {where :{id : req.params.id},
        include: [{
          model : PickList, 
          include: {
            model: Customer
          }}, {
          model: Product
        }]});
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.get('/product/:id', authenticateToken, async(req,res)=>{

  try {
      const result = await PickListDetails.findAll(
        {where :{productId : req.params.id},
        include: [
          { model: PickList, include: [Customer, Route, 'pickSalesExecutive'] }, 
          { model: Product }
        ]});
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})


router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await PickListDetails.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Pick List Details with that ID not found",
            });
          }    
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        PickListDetails.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Pick List Details was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Pick List Details with id=${id}. Maybe Pick List Details was not found or req.body is empty!`
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