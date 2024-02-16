const express = require('express');
const router = express.Router();

const authenticateToken = require('../../middleware/authorization');

const Entry = require('../models/entry')
const EntryDetails = require('../models/entryDetails');
const User = require('../../users/models/user');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { purchaseOrderId,userId, purchaseInvoice,purachseDate ,paymentMode , purchaseAmount,eWayBillNo,loading,transportationCharge,unloading ,munloadingTeam,commission, chequeNo,entryDetails} = req.body;

        // Validate input data
        // if (!orderNo || !distributorId || !userId || !warehouseId || !status || !orderDetails) {
        //     return res.status(400).send({ error: 'Incomplete data provided.' });
        // }

    
        const entry = new Entry({ purchaseOrderId,userId, purchaseInvoice,purachseDate ,paymentMode , purchaseAmount,eWayBillNo,loading,transportationCharge,unloading ,munloadingTeam,commission, chequeNo ,entryDetails});
        console.log(entry);
       
        await entry.save();

       const entryId = entry.id

        // Assign the orderId to each orderDetail
        for (let i = 0; i < entryDetails.length; i++) {
            entryDetails[i].entryId = entryId;
        }

        const eDetails = await EntryDetails.bulkCreate(entryDetails);

    
        res.status(201).send(eDetails);
    } catch (error) {
      res.send(error.message)
    }
});



router.get('/', async (req, res) => {

    const entry = await EntryDetails.findAll({
        order:['id'],
        include : [User]
  
    })

    res.send(entry);
})
module.exports = router;
