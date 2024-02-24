const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const DailyCollection = require('../models/dailyCollection');
const Customer = require('../models/customer');
const Route = require('../models/route');
const User = require('../../users/models/user');
const CustomerLedger = require('../models/customerLedger');

// router.post('/',authenticateToken ,async(req,res)=>{
//     try {
//         const {

//             customerId ,
//             amount,
//             date ,
//             invoiceNo,
//             userId,
//             paymentMode,
//             remarks,
//             routeId,
//             creditBalance
        
//         }=req.body;
        

//         const dailyCollection = new DailyCollection({
//             customerId ,
//             amount,
//             date ,
//             invoiceNo,
//             userId,
//             paymentMode,
//             remarks,
//             routeId,
//             creditBalance

//         })
//         const cId = req.body.customerId

//         const ledger = await CustomerLedger.create({
//             customerId :customerId,
//             invoiceNo:invoiceNo,
//             date:new Date(),
//             debit :amount,
//             credit :0
//         })



//         dailyCollection.save();
//         res.send(dailyCollection , ledger) 
        
//     } catch (error) {
//         res.send(error.message)
        
//     }
// }) 


router.post('/', authenticateToken, async (req, res) => {
    try {
        const {
            customerId,
            amount,
            date,
            invoiceNo,
            userId,
            paymentMode,
            remarks,
            routeId,
            creditBalance
        } = req.body;

        const dailyCollection = new DailyCollection({
            customerId,
            amount,
            date,
            invoiceNo,
            userId,
            paymentMode,
            remarks,
            routeId,
            creditBalance
        });

        await dailyCollection.save(); // Wait for the save operation to complete

        // Create ledger entry
        const ledger = await CustomerLedger.create({
            customerId: customerId,
            invoiceNo: invoiceNo,
            date: new Date(),
            debit: amount,
            credit: 0
        });

        res.status(201).json({ dailyCollection, ledger }); // Send both objects as a JSON response

    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors appropriately
    }
});


router.get('/',authenticateToken ,async(req,res)=>{
    try {
        const dailyCollection = await  DailyCollection.findAll({
            include:[ Customer , Route ,User]
        })
        res.send(dailyCollection)
        
    } catch (error) {
        res.send(error.message)
        
    }
})



module.exports = router;