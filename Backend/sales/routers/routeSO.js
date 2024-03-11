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
const Gst = require('../../products/models/gst');
const Hsn = require('../../products/models/hsn');
const Category = require('../../products/models/category');
const SubCategory = require('../../products/models/subCategory');
const { route } = require('./routeSODetails');
const sequelize = require('../../utils/db');
const { Sequelize } = require('sequelize');

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
        const result = await RouteSO.findAll({
          include: [Route, Customer, 'pickSalesExecutive'], order:['id']});
        res.send(result);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/routeid/:id', authenticateToken, async(req,res)=>{
  try {
      const result = await RouteSO.findAll({
        where: {routeId: req.params.id},
        include: [Route, Customer, 'pickSalesExecutive', {model: RouteSODetails, include: [SecondaryUnit]}]});
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
              include: [{model: Product, include: [Gst, Hsn, Category, SubCategory]}, SecondaryUnit]
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


router.post('/report/picklist', async(req,res)=>{

  const deliveryDate = new Date(req.body.deliveryDate)
  if (!deliveryDate || deliveryDate === "" || deliveryDate == "Invalid Date"){
    return res.send("Delivery date field cannot be empty.")
  }

   
    const routeId = req.body.routeId
    
   
   
    if(!routeId){
      return res.send( 'Route field cannot be empty.' )
    }

    try {
     const pickList = await RouteSO.findAll({ 
      where:{deliveryDate:deliveryDate, routeId:routeId},
      include:[
        {model:Route,attributes:['routeName']},
        {model:RouteSODetails},
        {model:Customer,attributes:["name"]}
      ],
      attributes:['routeId','date']
    });
  

  //  const pickList = await sequelize.query(`
  //       SELECT 
  //       r."routeName", so.date, c.name
  //       FROM  
  //       "routeSO" so 
  //       JOIN 
  //       route r on so."routeId" = r.id 
  //       JOIN
  //       customer c on so."customerId" = c.id

  //  `)

   const records = pickList
   console.log(records)
    res.json(records)
  
    
  } catch (error) {
    console.log(error.message)
  }
})


module.exports = router;
