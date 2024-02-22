const express = require('express');
const router = express.Router();

const authenticateToken = require('../../middleware/authorization');

const Order = require('../models/order');
const OrderDetails = require('../models/orderDetails');
const Distributor = require('../../products/models/distributor');
const User = require('../../users/models/user');

router.post('/', async (req, res) => {
    try {
        const { orderNo, distributorId, userId,companyId, warehouseId, date, status, orderDetails } = req.body;

        // // Validate input data
        // if (!orderNo || !distributorId || !userId || companyId || !warehouseId || !status || !orderDetails) {
        //     return res.status(400).send({ error: 'Incomplete data provided.' });
        // }

        // Create a new Order instance
        const purchaseOrder = new Order({ orderNo, distributorId, userId, warehouseId, date, status });
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

router.get('/', async (req, res) => {

    const order = await Order.findAll({
        order:['id'],
        include : [Distributor, User]
    })

    res.send(order);
})
module.exports = router;
