const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');

const CustomerLedger = require('../models/customerLedger');
const Customer = require('../models/customer');

router.get("/", authenticateToken, async (req, res) => {
    try {


      const customerLedger = await CustomerLedger.findAll({order: ['id']})
      res.send(customerLedger);

    //   let whereClause = {};
      
    //   let limit;
    //   let offset;
    //   if (req.query.pageSize && req.query.page) {
    //     limit = req.query.pageSize;
    //     offset = (req.query.page - 1) * req.query.pageSize;
    //   }
    //   else {
    //     whereClause = {
    //       status : true
    //     }
    //   }
    //   const cl = await CustomerLedger.findAll({
    //     where: whereClause,
    //     order: ["id"],
    //     limit,
    //     offset,
    //     include: [ Customer ]
    //   });
  
    //   let totalCount;
    //   totalCount = await CustomerLedger.count({
    //     where: {status: true}
    //   });
  
  
    //   if (req.query.page && req.query.pageSize) {
    //     const response = {
    //       count: totalCount,
    //       items: cl,
    //     };
  
    //     res.json(response);
    //   } else {
    //     res.send(cl);
    //   }
    } catch (error) {
      res.send(error.message);
   }
   });


router.get('/cutomer/:id', authenticateToken, async (req, res) => {
    try {
    const cl = await CustomerLedger.findAll({
    where: {customerId: req.params.id},
    order: ["id"]
    });

    res.send(cl);
    } catch (error) {
    res.send(error.message);
    }
});

  module.exports = router;