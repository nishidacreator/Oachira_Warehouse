const express = require('express');
const router = express.Router();

const authenticateToken = require('../../middleware/authorization');
const bcrypt = require('bcrypt');

const Customer = require('../models/customer');

const CustomerPhone = require('../models/customerPhone');

router.get('/customerid/:id', authenticateToken, async(req,res)=>{
    try {
        const customer = await CustomerPhone.findAll({
            where: { customerId: req.params.id },
            include : [Customer], order: ['id']
        });
        res.send(customer);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/', authenticateToken, async(req,res)=>{
    try {
        const customer = await CustomerPhone.findAll({
            include : [Customer], order: ['id']
        });
        res.send(customer);
        
    } catch (error) {
        res.send(error.message);
    }  
})
module.exports = router;