const express = require('express');
const router = express.Router();

const authenticateToken = require('../../middleware/authorization');

const Entry = require('../models/entry')
const EntryDetails = require('../models/entryDetails');
const User = require('../../users/models/user');
const Distributor = require('../../products/models/distributor');
const Order = require('../../purchases/models/order');
const Slip = require('../models/slip');
const DistributorLedger = require('../models/distributorLedger')
const EntryCheque = require('../models/entryCheque');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { distributorId, purchaseAmount, status, userId, entryStatus, chequeNo, advanceAmount, purchaseInvoiceNo, 
            chequeClearenceDate, invoiceDate, purchaseDate } = req.body;

        // Check if the chequeNo already exists
        // const entryExist = await Entry.findOne({ chequeNo });
        // if (entryExist) {
        //     return res.status(400).send("Cheque number already used");
        // }

        // Validate input data (customize based on your requirements)
        // if (!distributorId || !purchaseAmount || !status || !chequeNo || !userId) {
        //     return res.status(400).send({ error: 'Incomplete data provided.' });
        // }

        const entry = new Entry({distributorId, purchaseAmount, status, userId, entryStatus, purchaseInvoiceNo, updatedDate: new Date(), invoiceDate, advanceAmount, purchaseDate });
        await entry.save();

        let distributorLedger = new DistributorLedger({
            distributorId:distributorId,

            date:new Date(),
            description:`Invoice  No : ${purchaseInvoiceNo}`,
            amount:purchaseAmount,
            transactionType: "Debit",
        })

        await distributorLedger.save()

        if(status === 'AdvanceIssued'){
            let entryId = entry.id;
            const cheque = new EntryCheque({ entryId, chequeNo, amount: advanceAmount, chequeIssuedDate: new Date(), distributorId,
                description: 'Advance to distributor', chequeClearenceDate:  chequeClearenceDate, status: false, type: 'advance'});
            console.log(cheque);
            await cheque.save();
        }else if(status === 'ChequeIssued'){
            let entryId = entry.id;
            const cheque = new EntryCheque({ entryId, chequeNo, amount: purchaseAmount, chequeIssuedDate: new Date(), distributorId,
                description: 'Purchase amount to distributor', chequeClearenceDate: chequeClearenceDate, status: false, type: 'purchase'});
                console.log(cheque);
            await cheque.save();
        }

        // Uncomment and customize the following if you have additional code related to entryDetails
        // const entryId = entry.id;
        // for (let i = 0; i < entryDetails.length; i++) {
        //     entryDetails[i].entryId = entryId;
        // }
        // const entryDetailsResult = await EntryDetails.bulkCreate(entryDetails);

        res.send(entry);
    } catch (error) {
        console.error(error);
        res.send(error.message);
    }
});

router.patch('/:id',authenticateToken ,async (req,res)=>{
   
    let { eWayBillNo, chequeIssuedDate, invoiceDate, transportation,unloading,commission,paymentMode,orderId,remarks}= req.body
    const entry = await Entry.findOne({ where :{ id : req.params.id}});
    if(!entry){
        return res.status(400).json({msg:"Entry not found"})
    }
    entry.eWayBillNo = eWayBillNo,
    entry.transportation = transportation,
    entry.unloading = unloading,
    entry.commission = commission,
    entry.paymentMode = paymentMode,
    entry.orderId = orderId,
    entry.remarks = remarks

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
            include: [Distributor, Order, {model: EntryCheque, attributes:['chequeNo', 'status', 'chequeIssuedDate', 'type']}],
            order:[['updatedDate', 'DESC']],
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
            include: [EntryDetails, Distributor, Order, {model: EntryCheque, attributes:['chequeNo', 'type', 'amount', 'chequeClearenceDate']}],
           })
       
           res.send(entry);
    } catch (error) {
        res.send(error.message);
    }
   
})

router.patch('/statusupdate/:id', authenticateToken, async(req,res)=>{
    try {
        const{status, chequeNo, purchaseInvoiceNo, chequeClearenceDate, amount, invoiceDate} = req.body;

        let pe = await Entry.findByPk(req.params.id);
        pe.status = status
        pe.chequeIssuedDate = new Date();
        pe.purchaseInvoiceNo = purchaseInvoiceNo;
        pe.updatedDate = new Date();
        pe.invoiceDate = invoiceDate;

        if(status === 'ChequeIssued'){
            let entryId = pe.id;
            const cheque = new EntryCheque({ entryId, chequeNo, amount, date : new Date(),
                description: 'Purchase amount to distributor', chequeClearenceDate, status: true});
            await cheque.save();
        }

        await pe.save();

        // let slip = await Slip.findOne({where: {entryId: req.params.id}})
        // slip.status = 'closed';

        // await slip.save();
        
        res.send(pe);
      } catch (error) {
        res.send(error.message);
      }
})

router.patch('/editentry/:id',authenticateToken ,async (req,res)=>{
   try {
            console.log(req.body);
            let { distributorId, purchaseAmount, status, userId, entryStatus, chequeNo, amount, purchaseInvoiceNo, 
                chequeClearenceDate, invoiceDate, purchaseDate} = req.body
            const entry = await Entry.findByPk(req.params.id);
            console.log(entry);
            if(!entry){
                return res.status(400).json({msg:"Entry not found"})
            }

            entry.distributorId = distributorId,
            entry.purchaseAmount = purchaseAmount,
            entry.status = status,
            entry.advanceAmount = amount,
            entry.purchaseInvoiceNo = purchaseInvoiceNo,
            entry.invoiceDate = invoiceDate,
            entry.purchaseDate = purchaseDate,
            entry.updatedDate = new Date()
            
            console.log(entry);
            await entry.save();
            // let dl = await DistributorLedger.findOne({});
            // dl.

            // if(status === 'AdvanceIssued'){
                let entryId = entry.id;
                const cheque = await EntryCheque.findOne({entryId: entryId});
                console.log(cheque);
                cheque.chequeClearenceDate = chequeClearenceDate;
                cheque.chequeNo = chequeNo;
                cheque.amount = amount;
                cheque.distributorId = distributorId;
                await cheque.save();
            // }else if(status === 'ChequeIssued'){
            //     let entryId = entry.id;
            //     const cheque = new EntryCheque({ entryId, chequeNo, amount: purchaseAmount, chequeIssuedDate: new Date(), distributorId,
            //         description: 'Purchase amount to distributor', chequeClearenceDate: chequeClearenceDate, status: false, type: 'purchase'});
            //         console.log(cheque);
            //     await cheque.save();
            // }

            res.send(entry);

   } catch (error) {
    res.send(error.message);
   }
    
});

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {
        const entry = await Entry.findOne({
            where: {id: req.params.id}
        });
  
        const result = await entry.destroy({
            force: true
        });
  
        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Entry with that ID not found",
            });
        }
      
        res.status(204).json();
        }  catch (error) {
          res.send(error.message);
    }
    
  })
module.exports = router;
