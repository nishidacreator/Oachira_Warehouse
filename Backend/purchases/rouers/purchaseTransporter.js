const express = require('express');
const PurchaseTransporter = require('../models/purchaseTransporter');
const router = express.Router();

const Transporter = require('../models/transporter');
const Entry = require('../models/entry');
const Distributor = require('../../products/models/distributor');

const authenticateToken = require('../../middleware/authorization');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const { transporterId, amount, date, vehicleNo, from, noOfBags, advance, entryId, status, chequeNo, invoiceNo, chequeClearenceDate } = req.body;

            const exist = await PurchaseTransporter.findOne({where: {entryId: entryId}})
            if(exist){
              res.send("Transporter Slip already exists for this purchase entry");
            }
            console.log(req.body);
            // if(chequeNo != ''){
            //   const cheque = new EntryCheque({ entryId, chequeNo, amount: advance, chequeIssuedDate: new Date(), description: 'Advance to transporter', chequeClearenceDate: chequeClearenceDate, status: false});
            //   await cheque.save();
            // }

            const purchasetransporter = new PurchaseTransporter({transporterId, amount, date, vehicleNo, from, 
                noOfBags, advance, entryId, status, chequeNo, invoiceNo});

            await purchasetransporter.save();
              console.log(purchasetransporter);
            res.send(purchasetransporter);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', async (req, res) => {
  try {
      const pt = await PurchaseTransporter.findAll({
        order:[['date', 'DESC']],

          include: [Transporter, {model: Entry, include: [Distributor]}]
      })

      res.send(pt);
  } catch (error) {
      res.send(error.message);
  }
})

router.get('/:id', authenticateToken, async (req, res) => {

  const purchasetransporter = await PurchaseTransporter.findOne({
    where: {id: req.params.id},
    include: [Transporter, {model: Entry, include: [Distributor]}]
  })

  res.send(purchasetransporter);
})

router.get('/byentryid/:id', authenticateToken, async (req, res) => {

  const purchasetransporter = await PurchaseTransporter.findOne({
    where: {entryId: req.params.id},
    include: [Transporter, {model: Entry, include: [Distributor]}]
  })

  res.send(purchasetransporter);
})

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await PurchaseTransporter.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "PurchaseTransporter with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        PurchaseTransporter.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "PurchaseTransporter was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update PurchaseTransporter with id=${id}. Maybe PurchaseTransporter was not found or req.body is empty!`
                });
              }
            })
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: error.message,
        });
      }
})

router.patch('/statusupdate/:id', authenticateToken, async(req,res)=>{
  try {

    let status = req.body.status;
    let purchasetransporter = await PurchaseTransporter.findByPk(req.params.id);
    purchasetransporter.status = status

    await purchasetransporter.save();
    res.send(purchasetransporter);
    } catch (error) {
      res.send(error.message);
    }
})
module.exports = router;