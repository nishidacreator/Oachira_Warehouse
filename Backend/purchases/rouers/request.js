const express = require('express');
const router = express.Router();
const easyInvoice = require('easyinvoice');
const fs = require('fs');
const path = require('path');
const puppeteer = require("puppeteer");
const { Sequelize, Op } = require('sequelize');

const authenticateToken = require('../../middleware/authorization');

const Request = require('../models/request');
const RequestDetails = require('../models/requestDetails');
const User = require('../../users/models/user');
// const Store = require('../../store/models/store');
const Product = require('../../products/models/product');
const SecondaryUnit = require('../../products/models/secondaryUnit');
const Company = require('../../company/company');

const downloadsDir = path.join(__dirname, "../invoices");
fs.mkdirSync(downloadsDir, { recursive: true });

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { requestNo, companyId, userId, date, status, requestDetails } = req.body;
        // Validate input data
        console.log('reqqqqqqqqq',req.body)
        if (!requestNo || !userId || !companyId || !requestDetails) {
            return res.status(400).send({ error: 'Incomplete data provided.' });
        }

        const pr = await Request.findOne({where: {requestNo: requestNo} })
        if(pr){
            return res.status(400).send({ error: 'Purchase Request already saved with same request no' });
        }

        // Create a new Request instance
        const purchaseRequest = new Request({ requestNo, companyId, userId, date, status });
        // Save the request to the database
        await purchaseRequest.save();

        // Get the ID of the newly created request
        const requestId = purchaseRequest.id;

        // Assign the requestId to each requestDetail
        for (let i = 0; i < requestDetails.length; i++) {
            requestDetails[i].requestId = requestId;
        }

        // Bulk create requestDetails associated with the request
        const pRequestDetails = await RequestDetails.bulkCreate(requestDetails);

        // Send the created request as a response
        res.status(201).send(pRequestDetails);
    } catch (error) {
      res.send(error.message);
    }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const request = await Request.findAll({
      order :[['id', 'DESC']],
      include : [User, RequestDetails, Company]
    })

    res.send(request);
  } catch (error) {
    res.send(error.message);
  }
})

router.get('/byid/:id', authenticateToken, async (req, res) => {

  try {
    const request = await Request.findOne({
      where : {id : req.params.id},
      order :['id'],
      include : [
          {model: User}, {model: Company},  
          {model: RequestDetails, 
              include: [
              { model: Product }, {model: SecondaryUnit},
          ]}
        ]
    })

    res.send(request);
  } catch (error) {
    res.send(error.message);
  }

})

router.patch('/:id', authenticateToken, async(req,res)=>{
  try {
    Request.update(req.body, {
        where: { id: req.params.id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Request was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Request with id=${id}. Maybe Request was not found or req.body is empty!`
            });
          }
        })

        const rqstId = req.params.id;

        const result = await RequestDetails.destroy({
          where: { requestId: rqstId},
          force: true,
        });

        let details = req.body.requestDetails;
        for(let i = 0; i < details.length; i++){
          details[i].requestId = rqstId;
        }

        let rd = await RequestDetails.bulkCreate(details)
        
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
})

router.delete('/:id', authenticateToken, async(req,res)=>{
  try {

      const result = await Request.destroy({
          where: { id: req.params.id },
          force: true,
      });

      if (result === 0) {
          return res.status(404).json({
            status: "fail",
            message: "Purchase Request with that ID not found",
          });
        }
    
        res.status(204).json();
      }  catch (error) {
      res.send({error: error.message})
  }
  
})

router.get('/details', async (req, res) => {

  const request = await RequestDetails.findAll({
      order :[['id', 'DESC']]
  })

  res.send(request);
})
module.exports = router;
