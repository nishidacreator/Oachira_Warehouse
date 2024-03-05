const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const RouteSODetails = require('../models/routeSODetails');
const Route = require('../models/route');
const Product = require('../../products/models/product');
const RouteSO = require('../models/routeSO');
const Customer = require('../models/customer');
const SecondaryUnit = require('../../products/models/secondaryUnit');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {products} = req.body;

            const result = await RouteSODetails.bulkCreate(products)

            await result.save();

            res.send(result);

    } catch (error) {
      res.send(error.message);
    }
})

router.get('/routeid/:id', authenticateToken,async(req,res)=>{

    try {
        const result = await RouteSODetails.findAll(
          {where :{routeSOId : req.params.id},
          include: [{
            model : RouteSO, 
            include: {
              model: Customer
            }}, {
            model: Product
          },
          { model: SecondaryUnit}], order:['id']});
        res.send(result);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/productid/:id/:routeid', authenticateToken, async(req,res)=>{
  try {
      const result = await RouteSODetails.findAll(
        {where :{productId : req.params.id, routeSOId : req.params.routeid},
        include: [{
          model : RouteSO, 
          include: {
            model: Customer
          }}, {
          model: Product
        },
        { model: SecondaryUnit}], order:['id']});
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.get('/byid/:id', authenticateToken, async(req,res)=>{

  try {
      const result = await RouteSODetails.findOne(
        {where :{id : req.params.id},
        include: [
          { model: RouteSO, include: { model: Customer }}, 
          { model: Product},
          { model: SecondaryUnit}
        ]});
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.get('/product/:id', authenticateToken, async(req,res)=>{

  try {
      const result = await RouteSODetails.findAll(
        {where :{productId : req.params.id},
        include: [
          { model: RouteSO, include: [Customer, Route, 'pickSalesExecutive'] }, 
          { model: Product }
        ]});
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})


router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await RouteSODetails.destroy({
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
          res.send(error.message);
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        RouteSODetails.update(req.body, {
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
        res.send(error.message);
      }
})






module.exports = router;