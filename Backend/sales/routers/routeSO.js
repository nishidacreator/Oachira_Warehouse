const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const RouteSO = require('../models/routeSO');
const Route = require('../models/route');
const Customer = require('../models/customer');
const RouteSODetails = require('../models/routeSODetails');
const User = require('../../users/models/user');
const Product = require('../../products/models/product');
const SecondaryUnit = require('../../products/models/secondaryUnit');
const CustomerGrade = require('../models/customerGrade');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {routeId, customerId, date, status, salesExecutiveId, deliveryDate, products} = req.body;

            const result = new RouteSO({routeId, customerId, date, status, salesExecutiveId, deliveryDate});
            console.log(result);

            await result.save();
            
            const soId = result.id;

            for(i = 0; i< products.length; i++) {
              products[i].routeSOId = soId
            }

            const finalResult = await RouteSODetails.bulkCreate(products)

            res.send(result);

    } catch (error) {
      res.send(error.message);
    }
})

router.get('/', authenticateToken,async(req,res)=>{

    try {
        const result = await RouteSO.findAll({include: [Route, Customer, 'pickSalesExecutive'], order:['id']});
        res.send(result);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/routeid/:id', authenticateToken, async(req,res)=>{

  try {
      const result = await RouteSO.findAll({
        where: {routeId: req.params.id},
        include: [Route, Customer, 'salesexecutive']});
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.get('/userid/:id', authenticateToken, async(req,res)=>{
  try {
      const result = await RouteSO.findAll({
        where: {salesExecutiveId: req.params.id, status: "pending"},
        include: [Route, Customer, 'salesexecutive']});
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.get('/:id', authenticateToken,async(req,res)=>{

  try {
      const result = await RouteSO.findOne(
        {
          where : {id: req.params.id},
          include: [
            {model : RouteSODetails, 
              include: [Product, SecondaryUnit]
            }, {model: Customer, include: [CustomerGrade]}, 
            Route, 'pickSalesExecutive'
          ]
        });
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await RouteSO.destroy({
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
          res.send(error.message);
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
  try {
    console.log(req.body);
    RouteSO.update(req.body, {
        where: { id: req.params.id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "RouteSO was updated successfully."
            });
          } else {
            res.send(
              `Cannot update RouteSO with id=${id}. Maybe RouteSO was not found or req.body is empty!`
            );
          }
        })

        const soId = req.params.id;

        const result = await RouteSODetails.destroy({
          where: { routeSOId: soId},
          force: true,
        });

        let list = req.body.products;
        for(let i = 0; i < list.length; i++){
          list[i].routeSOId = soId;
        }

        let pd = await RouteSODetails.bulkCreate(list)
        
  } catch (error) {
    res.send(error.message);
  }
})

module.exports = router;