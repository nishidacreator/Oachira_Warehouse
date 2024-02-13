const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const PickList = require('../models/pickList');
const Route = require('../models/route');
const Customer = require('../models/customer');
const PickListDetails = require('../models/pickListDetails');
const User = require('../../users/models/user');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {routeId, customerId, date, status, salesExecutiveId, deliveryDate, products} = req.body;

            const result = new PickList({routeId, customerId, date, status, salesExecutiveId, deliveryDate});
            console.log(result);

            await result.save();
            
            const pickId = result.id;

            for(i = 0; i< products.length; i++) {
              products[i].pickListId = pickId
            }

            const finalResult = await PickListDetails.bulkCreate(products)

            res.send(result);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', authenticateToken,async(req,res)=>{

    try {
        const result = await PickList.findAll({include: [Route, Customer, 'pickSalesExecutive'], order:['id']});
        res.send(result);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/routeid/:id', authenticateToken, async(req,res)=>{

  try {
      const result = await PickList.findAll({
        where: {routeId: req.params.id},
        include: [Route, Customer, 'salesexecutive']});
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.get('/userid/:id', authenticateToken, async(req,res)=>{
  try {
      const result = await PickList.findAll({
        where: {salesExecutiveId: req.params.id, status: "pending"},
        include: [Route, Customer, 'salesexecutive']});
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.get('/:id', authenticateToken,async(req,res)=>{

  try {
      const result = await PickList.findOne(
        {
          where : {id: req.params.id},
          include: [Route, Customer, 'pickSalesExecutive', PickListDetails]
        });
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await PickList.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Pick List with that ID not found",
            });
          }    
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        Route.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Pick List was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Pick List with id=${id}. Maybe Pick List was not found or req.body is empty!`
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