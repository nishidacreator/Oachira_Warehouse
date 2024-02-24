const express = require('express');
const router = express.Router();

const authenticateToken = require('../../middleware/authorization');

const Order = require('../models/order');
const OrderDetails = require('../models/orderDetails');
const Distributor = require('../../products/models/distributor');
const User = require('../../users/models/user');
const Company = require('../../company/company');
const Product = require('../../products/models/product');
const SecondaryUnit = require('../../products/models/secondaryUnit');
const PrimaryUnit = require('../../products/models/primayUnit');

router.post('/',authenticateToken, async (req, res) => {
    try {
        const { orderNo, distributorId, userId,companyId, warehouseId, date, status, orderDetails } = req.body;

   
  

        // Create a new Order instance
        const purchaseOrder = new Order({ orderNo, distributorId, companyId,userId, warehouseId, date, status,orderDetails });
        console.log(purchaseOrder);
        // Save the order to the database
        await purchaseOrder.save();

        // Get the ID of the newly created order
        const orderId = purchaseOrder.id;

        // Assign the orderId to each orderDetail
        for (let i = 0; i < orderDetails.length; i++) {
            orderDetails[i].orderId = orderId;
        }

        // Bulk create orderDetails associated with the order
        const pOrderDetails = await OrderDetails.bulkCreate(orderDetails);

        // Send the created order as a response
        res.status(201).send(pOrderDetails);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send({ error: 'Internal server error.' });
    }
});

router.get('/', authenticateToken,async (req, res) => {

    const order = await Order.findAll({
        order:['id'],
        include : [Distributor, User ,Company,
          {model: OrderDetails, include:[SecondaryUnit, Product, PrimaryUnit]}]
    })

    res.send(order);
})


router.get('/:id', authenticateToken, async (req, res) => {
  try {
      const orderDetail = await Order.findOne({
          where: { id: req.params.id }, 
          include: [
              Distributor, User,
              Company,
              {
                  model: OrderDetails,
                  include: [Product,SecondaryUnit] // Include Product model inside OrderDetails
              },
              
          ],
          order: ['id']
      });
      res.send(orderDetail);
  } catch (error) {
      res.send(error.message);
  }  
});



router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
      Order.update(req.body, {
          where: { id: req.params.id }
        })
          .then(num => {
            if (num == 1) {
              res.send({
                message: "Order was updated successfully."
              });
            } else {
              res.send({
                message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body is empty!`
              });
            }
          })
  
          const oId = req.params.id;
  
          const result = await OrderDetails.destroy({
            where: { orderId: oId},
            force: true,
          });
  
          let details = req.body.orderDetails;
          for(let i = 0; i < details.length; i++){
            details[i].orderId = oId;
          }
  
          let rd = await OrderDetails.bulkCreate(details)
          
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  })
  
  router.delete('/:id', authenticateToken, async(req,res)=>{
    try {
  
        const result = await Order.destroy({
            where: { id: req.params.id },
            force: true,
        });
  
        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Purchase Order  with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
  })
  
module.exports = router;
