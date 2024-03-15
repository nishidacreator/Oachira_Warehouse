const express = require('express');
const EntryCheque = require('../models/entryCheque');
const Entry = require('../models/entry');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const DistributorLedger = require('../models/distributorLedger');

router.get('/byentryid/:id', authenticateToken, async (req, res) => {
    try {
        const entrycheque = await EntryCheque.findAll({
            where: {entryId: req.params.id}, order:['id'],
            include:[
                {model:Entry,attributes:['status']}
            ],
        })
    
        res.send(entrycheque);
    } catch (error) {
        res.send(error.message);
    }
})

router.get('/', authenticateToken, async (req, res) => {
    try {
        const entrycheque = await EntryCheque.findAll({
            order:[['chequeClearenceDate', 'DESC']],
            include:[
                {model:Entry,attributes:['purchaseInvoiceNo']}
              ], 
        })
    
        res.send(entrycheque);
    } catch (error) {
        res.send(error.message);
    }
})

router.get('/bystatus', authenticateToken, async (req, res) => {
    try {
        let limit;
        let offset;
        if (req.query.pageSize && req.query.page) {
          limit = req.query.pageSize;
          offset = (req.query.page - 1) * req.query.pageSize;
        }
    
        const entrycheque = await EntryCheque.findAll({
            order:[['chequeClearenceDate', 'DESC']],
            include:[{model:Entry,attributes:['purchaseInvoiceNo']}], 
            where: {status: false},
            limit,
            offset,
        })
    
        let totalCount;
        totalCount = await EntryCheque.count({
          where: {status: true}
        });
    
    
        const response = {
            count: totalCount,
            items: entrycheque,
          };
    
          res.send(response);
    } catch (error) {
        res.send(error.message);
    }
})

router.patch('/statusupdate/:id', authenticateToken, async(req,res)=>{
    try {
  
      let status = req.body.status;
      let entrycheque = await EntryCheque.findByPk(req.params.id);
      console.log(entrycheque);
      entrycheque.status = status
      entrycheque.closedDate = new Date()   

      if(entrycheque.purchaseInvoiceNo){
            let distributorLedger = new DistributorLedger({
                distributorId: entrycheque.distributorId,
                date:new Date(),
                description:`Invoice  No : ${entrycheque.entry.purchaseInvoiceNo}`,
                amount: entrycheque.amount,
                transactionType: "Credit",
            })
        
            await distributorLedger.save()
      }else{
        let distributorLedger = new DistributorLedger({
            distributorId: entrycheque.distributorId,
            date:new Date(),
            description: 'Advance Cheque',
            amount: entrycheque.amount,
            transactionType: "Credit",
        })
    
        await distributorLedger.save()
      }
  
      await entrycheque.save();


      res.send(entrycheque);
      } catch (error) {
        res.send(error.message);
      }
  })

module.exports = router;