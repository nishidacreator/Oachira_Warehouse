const express = require('express');
const router = express.Router();

const authenticateToken = require('../../middleware/authorization');

const Entry = require('../models/entry')
const EntryDetails = require('../models/entryDetails');
const User = require('../../users/models/user');

router.post('/', authenticateToken, async (req, res) => {
    try {

        const { purchaseInvoice,purachseDate,distributorId,purchaseAmount,status,chequeNo,userId} = req.body;

        const EntryExist = await  Entry.findOne({ chequeNo: req.userId });
        // if (EntryExist){
            
        //     return res.send("Cheque number already used");
        // }
        // Validate input data
        // if (!orderNo || !distributorId || !userId || !warehouseId || !status || !orderDetails) {
        //     return res.status(400).send({ error: 'Incomplete data provided.' });
        // }

    
        const entry = new Entry({purchaseInvoice,purachseDate,distributorId,purchaseAmount,status,userId,chequeNo });
        console.log(entry);
       
        await entry.save();

    //    const entryId = entry.id

    //     // Assign the orderId to each orderDetail
    //     for (let i = 0; i < entryDetails.length; i++) {
    //         entryDetails[i].entryId = entryId;
    //     }

    //     const eDetails = await EntryDetails.bulkCreate(entryDetails);

    
        res.status(201).send(entry);
    } catch (error) {
      res.send(error.message)
    }
});

router.patch('/',authenticateToken ,async (req,res)=>{
   
    let {id,eWayBillNo,chequeIssuedDate,invoiceDate,transportation,unloading,commission,paymentMode,purchaseOrderId,remarks}= req.body
    const entry = await Entry.findOne({ where :{ id : id}});
    if(!entry){
        return res.status(400).json({msg:"Entry not found"})
    }
    entry.eWayBillNo = eWayBillNo,
    entry.chequeIssuedDate = chequeIssuedDate,
    entry.invoiceDate = invoiceDate,
    entry.transportation = transportation,
    entry.unloading = unloading,
    entry.commission = commission,
    entry.paymentMode = paymentMode,
    entry.purchaseOrderId = purchaseOrderId,
    entry.remarks = remarks

    await entry.save();
    res.send(entry);

});
   

router.get('/', async (req, res) => {

    const entry = await Entry.findAll({
     
    })

    res.json(201).send(entry);
})
module.exports = router;
