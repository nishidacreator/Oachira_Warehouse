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

router.post('/', authenticateToken, async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const { routeSOId, invoiceNo, totalAmount, userId, paymentMode, invoiceDate, routeSEDetails } = data;
  
        const se = await RouteSE.create( {routeSOId, invoiceNo, totalAmount, userId, paymentMode, invoiceDate} );
  
        const seId = se.id
  
        for(let i = 0; i < routeSEDetails.length; i++){
          routeSEDetails[i].routeSEId = seId;
        }
  
        let seDetails = await RouteSEDetails.bulkCreate(routeSEDetails)

        const so = await RouteSO.findByPk(routeSOId)
        const customerId = so.customerId;

        const ledger = await CustomerLedger.create( {customerId, invoiceNo, date: new Date(), debit: 0, credit: totalAmount} );

        res.send(se, seDetails, ledger);

    } catch (error) {
      res.send(error.message);
    }   
})

router.get('/', authenticateToken, async (req, res) => {
  try {
    const request = await RouteSE.findAll({})

    res.send(request);
  } catch (error) {
    res.send(error.message);
  }
})

module.exports = router;