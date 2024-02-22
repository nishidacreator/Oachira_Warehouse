const express = require('express');

const router = express.Router();
const Slip = require('../models/slip')
const Distributor = require('../../products/models/distributor');
const Entry = require('../models/entry');

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




module.exports = router;