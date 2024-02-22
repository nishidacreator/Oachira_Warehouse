const express = require('express');
const router = express.Router();

const authenticateToken = require('../../middleware/authorization');

const Entry = require('../models/entry')
const EntryDetails = require('../models/entryDetails');
const User = require('../../users/models/user');
const Distributor = require('../../products/models/distributor');
const Order = require('../../purchases/models/order');
const Slip = require('../models/slip');

router.post('/', authenticateToken, async (req, res) => {
    try {

        const { purchaseInvoice,purachseDate,distributorId,purchaseAmount,status,chequeNo,userId,entryStatus = 'pending'} = req.body;

        const EntryExist = await  Entry.findOne({ chequeNo: req.userId });
        // if (EntryExist){
            
        //     return res.send("Cheque number already used");
        // }
        // Validate input data
        // if (!orderNo || !distributorId || !userId || !warehouseId || !status || !orderDetails) {
        //     return res.status(400).send({ error: 'Incomplete data provided.' });
        // }
        if(chequeNo != null){
            this.chequeIssuedDate = purachseDate
        }

    
        const entry = new Entry({purchaseInvoice,purachseDate,distributorId,purchaseAmount,status,userId, chequeNo, entryStatus, chequeIssuedDate: this.chequeIssuedDate });
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

router.patch('/:id',authenticateToken ,async (req,res)=>{
   
    let {eWayBillNo,chequeIssuedDate,invoiceDate,transportation,unloading,commission,paymentMode,orderId,remarks}= req.body
    const entry = await Entry.findOne({ where :{ id : req.params.id}});
    if(!entry){
        return res.status(400).json({msg:"Entry not found"})
    }
    entry.eWayBillNo = eWayBillNo,
    entry.invoiceDate = invoiceDate,
    entry.transportation = transportation,
    entry.unloading = unloading,
    entry.commission = commission,
    entry.paymentMode = paymentMode,
    entry.orderId = orderId,
    entry.remarks = remarks
    entry.entryStatus = 'completed'

    await entry.save();
    res.send(entry);

});
   
router.get('/', async (req, res) => {

    try {
        let whereClause = {};
        let limit;
        let offset;

        if (req.query.pageSize && req.query.page) {
        limit = parseInt(req.query.pageSize, 10) || 10; // Default to 10 if not a valid number
        offset = (parseInt(req.query.page, 10) - 1) * limit || 0;
    }

        const entry = await Entry.findAll({
            where: whereClause,
            include: [Distributor, Order],
            order: ["id"],
            limit, 
            offset
           })
       
           res.send(entry);
    } catch (error) {
        res.send(error.message);
    }
   
})

router.get('/:id', async (req, res) => {

    try {
        const entry = await Entry.findOne({
            where: {id: req.params.id},
            include: [Distributor, Order],
           })
       
           res.send(entry);
    } catch (error) {
        res.send(error.message);
    }
   
})

router.patch('/statusupdate/:id', authenticateToken, async(req,res)=>{
    try {
        const{status, chequeNo} = req.body;

        let pe = await Entry.findByPk(req.params.id);
        pe.status = status
        pe.chequeNo = chequeNo;
        pe.chequeIssuedDate = new Date();

        await pe.save();

        let slip = await Slip.findOne({where: {entryId: req.params.id}})
        slip.status = 'closed';

        await slip.save();
        
        res.send(pe);
      } catch (error) {
        res.send(error.message);
      }
  })
module.exports = router;
