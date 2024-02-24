const express = require('express');
const router = express.Router();

const authenticateToken = require('../../middleware/authorization');

const Order = require('../models/order');
const OrderDetails = require('../models/orderDetails');
const Product = require('../../products/models/product');
const PrimaryUnit = require('../../products/models/primayUnit');
const SecondaryUnit = require('../../products/models/secondaryUnit');

router.get('/', async (req, res) => {

    const order = await OrderDetails.findAll({
        order:['id'],
        include : [Order, Product, SecondaryUnit]
    })

    res.send(order);
})

router.get('/bypoid/:id', async (req, res) => {

    const order = await OrderDetails.findAll({
        where: {orderId: req.params.id},
        order:['id'],
        include : [Order, Product, SecondaryUnit]
    })

    res.send(order);
})
module.exports = router;