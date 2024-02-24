const express = require('express');

const router = express.Router();
const PurchaseAccount = require('../models/purchaseAccount')
const Distributor = require('../../products/models/distributor');
const Entry = require('../models/entry');
const Brocker = require('../models/brocker');
const Product = require('../../products/models/product');

const authenticateToken = require('../../middleware/authorization');

router.post('/', async (req, res) => {
    try {
    
    const { brockerId, loadingId, noOfBags, noOfBox, amount, date, status, closedDate  } = req.body;

            const purchaseaccount = new PurchaseAccount({  brockerId, entryId, date, bagNo, amount, status, invoiceNo  });

            await purchaseaccount.save();

            res.send(purchaseaccount);

    } catch (error) {
        res.send(error.message);
    }
})

router.get('/', async (req, res) => {
    try {
        const purchaseaccount = await PurchaseAccount.findAll({
            order:['id'],
            include: [{model: Brocker, include: [Product]}, Entry]
        })

        res.send(purchaseaccount);
    } catch (error) {
        res.send(error.message);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const purchaseaccount = await PurchaseAccount.findOne({
            where: {id: req.params.id}, 
            order:['id'],
            include: [{model: Brocker, include: [Product]}, Entry]
        })
        
        res.send(purchaseaccount);
    } catch (error) {
        res.send(error.message)
    }
  
})

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {
      const purchaseaccount = await PurchaseAccount.findOne({
        where: {id: req.params.id},
        order: ["id"]
      });

  
    const result = await purchaseaccount.destroy({
        force: true
    });

    if (result === 0) {
        return res.status(404).json({
            status: "fail",
            message: "PurchaseAccount with that ID not found",
        });
        }
    
        res.status(204).json();
    }  catch (error) {
        res.send(error.message);
    }
    
})
  
router.patch('/:id', authenticateToken, async(req,res)=>{   
    try {
      const purchaseaccount = await PurchaseAccount.findOne({where: {id: req.params.id}})
      console.log(req.body);
      purchaseaccount.description = req.body.description;
      purchaseaccount.contactPerson = req.body.contactPerson;
    
      await purchaseaccount.save();
      res.send(purchaseaccount);
      } catch (error) {
        res.send(error.message);
      }
})

router.patch('/statusupdate/:id', authenticateToken, async(req,res)=>{
    try {
  
      let status = req.body.status;
      let purchaseaccount = await PurchaseAccount.findByPk(req.params.id);
      purchaseaccount.status = status
  
      await purchaseaccount.save();
      res.send(purchaseaccount);
      } catch (error) {
        res.send(error.message);
      }
  })

module.exports = router;