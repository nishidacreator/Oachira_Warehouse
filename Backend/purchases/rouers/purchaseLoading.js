const express = require('express');

const router = express.Router();
const PurchaseLoading = require('../models/purchaseLoading')
const Distributor = require('../../products/models/distributor');
const Entry = require('../models/entry');
const Brocker = require('../models/brocker');
const Product = require('../../products/models/product');
const Loading = require('../models/loading');

const authenticateToken = require('../../middleware/authorization');

router.post('/', async (req, res) => {
    try {  
            const { invoiceNo, entryId, brockerId, loadingId, noOfBags, noOfBox, amount, date, status, closedDate  } = req.body;

            const exist = await PurchaseLoading.findOne({where: {entryId: entryId}})
            if(exist){
            res.send("Loading Slip already exists for this purchase entry");
            }

            const purchaseloading = new PurchaseLoading({  invoiceNo, entryId, brockerId, loadingId, noOfBags, noOfBox, amount, date, status, closedDate });

            await purchaseloading.save();

            res.send(purchaseloading);

    } catch (error) {
        res.send(error.message);
    }
})

router.get('/', async (req, res) => {
    try {
        const purchaseloading = await PurchaseLoading.findAll({
            order:[['date', 'DESC']],

            include: [Loading, Entry]
        })

        res.send(purchaseloading);
    } catch (error) {
        res.send(error.message);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const purchaseloading = await PurchaseLoading.findOne({
            where: {id: req.params.id}, 
            order:['id'],
            include: [Loading, Entry]
        })
        
        res.send(purchaseloading);
    } catch (error) {
        res.send(error.message)
    }
  
})

router.get('/byentryid/:id', async (req, res) => {
    try {
        const purchaseloading = await PurchaseLoading.findOne({
            where: {entryId: req.params.id}, 
            include: [Loading, Entry]
        })
        
        res.send(purchaseloading);
    } catch (error) {
        res.send(error.message)
    } 
})

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {
      const purchaseloading = await PurchaseLoading.findOne({
        where: {id: req.params.id},
        order: ["id"]
      });

  
    const result = await purchaseloading.destroy({
        force: true
    });

    if (result === 0) {
        return res.status(404).json({
            status: "fail",
            message: "PurchaseLoading with that ID not found",
        });
        }
    
        res.status(204).json();
    }  catch (error) {
        res.send(error.message);
    }
    
})
  
router.patch('/:id', authenticateToken, async(req,res)=>{   
    try {
      const purchaseloading = await PurchaseLoading.findOne({where: {id: req.params.id}})

      purchaseloading.loadingId = req.body.loadingId;
      purchaseloading.noOfBags = req.body.noOfBags;
      purchaseloading.noOfBox = req.body.noOfBox;
      purchaseloading.amount = req.body.amount;
      purchaseloading.date = req.body.date;
      console.log(req.body);
      purchaseloading.description = req.body.description;
      purchaseloading.contactPerson = req.body.contactPerson;

    
      await purchaseloading.save();
      res.send(purchaseloading);
      } catch (error) {
        res.send(error.message);
      }
})

router.patch('/statusupdate/:id', authenticateToken, async(req,res)=>{
    try {
  
      let status = req.body.status;
      let purchaseloading = await PurchaseLoading.findByPk(req.params.id);
      purchaseloading.status = status
  
      await purchaseloading.save();
      res.send(purchaseloading);
      } catch (error) {
        res.send(error.message);
      }
})

module.exports = router;