const express = require('express');

const router = express.Router();
const Slip = require('../models/slip')
const Distributor = require('../../products/models/distributor');
const Entry = require('../models/entry');

const authenticateToken = require('../../middleware/authorization');

router.post('/', async (req, res) => {
    try {
    
    const { entryId, distributorId, purchaseInvoice, amount,invoiceNo, description , date, contactPerson , status  } = req.body;

            const slip = new Slip({ entryId, distributorId, purchaseInvoice, amount , invoiceNo, description , date, contactPerson , status  });

            await slip.save();

            res.send(slip);

    } catch (error) {
        res.send(error.message);
    }
})

router.get('/', async (req, res) => {
    try {
        const slip = await Slip.findAll({order:['id']})

        res.send(slip);
    } catch (error) {
        res.send(error.message);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const slip = await Slip.findOne({
            where: {id: req.params.id}, 
            order:['id'],
            include: [Distributor]
        })
        
        res.send(slip);
    } catch (error) {
        res.send(error.message)
    }
  
})

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {
      const slip = await Slip.findOne({
        where: {id: req.params.id},
        order: ["id"]
      });

  
    const result = await slip.destroy({
        force: true
    });

    if (result === 0) {
        return res.status(404).json({
            status: "fail",
            message: "Slip with that ID not found",
        });
        }
    
        res.status(204).json();
    }  catch (error) {
        res.send(error.message);
    }
    
})
  
router.patch('/:id', authenticateToken, async(req,res)=>{   
    try {
      const slip = await Slip.findOne({where: {id: req.params.id}})
      console.log(req.body);
      slip.description = req.body.description;
      slip.contactPerson = req.body.contactPerson;
    
      await slip.save();
      res.send(slip);
      } catch (error) {
        res.send(error.message);
      }
})

module.exports = router;