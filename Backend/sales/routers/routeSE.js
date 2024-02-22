const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');

const multer = require('../../utils/multer');
const cloudinary = require('../../utils/cloudinary');

const authenticateToken = require('../../middleware/authorization');

const RouteSE = require('../models/routeSE');
const RouteSEDetails = require('../models/routeSEDetails');
const CustomerLedger = require('../models/customerLedger');
const RouteSO = require('../models/routeSO');
const Route = require('../models/route');
const Customer = require('../models/customer');
const User = require('../../users/models/user');
const Product = require('../../products/models/product');
const SecondaryUnit = require('../../products/models/secondaryUnit');
const CustomerCategory = require('../../sales/models/customerCategory');
const CustomerGrade = require('../../sales/models/customerGrade');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const data = req.body;

        const { routeSOId, invoiceNo, totalAmount, userId, paymentMode, invoiceDate, routeSEDetails, creditBalance } = data;
  
        const se = await RouteSE.create( {routeSOId, invoiceNo, totalAmount, userId, paymentMode, invoiceDate, creditBalance} );
  
        const seId = se.id
  
        for(let i = 0; i < routeSEDetails.length; i++){
          routeSEDetails[i].routeSEId = seId;
        }
  
        let seDetails = await RouteSEDetails.bulkCreate(routeSEDetails)

        const so = await RouteSO.findByPk(routeSOId)
        const customerId = so.customerId;

        const ledger = await CustomerLedger.create( {customerId, invoiceNo, date: new Date(), debit: 0, credit: totalAmount} );

        const rso = await RouteSO.findByPk(routeSOId)
        rso.status = 'InvoiceIssued';
        await rso.save();

        res.send(se, seDetails, ledger, rso);

    } catch (error) {
      res.send(error.message);
    }   
})

router.get('/', authenticateToken, async (req, res) => {
  try {
    const request = await RouteSE.findAll({
      include: [
        {model: RouteSO, include:[Route, {model: Customer, include: [CustomerCategory, CustomerGrade]}]},
        User
      ], order: [['invoiceNo', 'DESC']]
  })

    res.send(request);
  } catch (error) {
    res.send(error.message);
  }
})

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const request = await RouteSE.findOne({
      where: {id: req.params.id},
      include: [
        {model: RouteSO, include:[Route, {model: Customer, include: [CustomerCategory, CustomerGrade]}]},
        User, 
        {model: RouteSEDetails, include: [Product, SecondaryUnit]}
      ], order: [['invoiceNo', 'DESC']]
  })

    res.send(request);
  } catch (error) {
    res.send(error.message);
  }
})

router.delete('/:id', authenticateToken, async(req,res)=>{
  try {

      const result = await RouteSE.destroy({
          where: { id: req.params.id },
          force: true,
      });

      if (result === 0) {
          return res.status(404).json({
            status: "fail",
            message: "RouteSE with that ID not found",
          });
        }    
        res.status(204).json();
      }  catch (error) {
        res.send(error.message);
  }
  
})

router.patch('/:id', authenticateToken, async(req,res)=>{
try {
  RouteSE.update(req.body, {
      where: { id: req.params.id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "RouteSE was updated successfully."
          });
        } else {
          res.send(
            `Cannot update RouteSE with id=${id}. Maybe RouteSE was not found or req.body is empty!`
          );
        }
      })

      const seId = req.params.id;

      const result = await RouteSEDetails.destroy({
        where: { routeSEId: seId},
        force: true,
      });

      let list = req.body.routeSEDetails;
      for(let i = 0; i < list.length; i++){
        list[i].routeSEId = seId;
      }

      let pd = await RouteSEDetails.bulkCreate(list)
      
} catch (error) {
  res.send(error.message);
}
})

module.exports = router;