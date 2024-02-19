const express = require('express');

const router = express.Router();
const Slip = require('../models/slip')


router.post('/', async (req, res) => {
    try {
    
    const { purchaseEntryId , amount,InvoiceNo, description , date, contactPerson , status  } = req.body;

            const slip = new Slip({ purchaseEntryId ,amount , InvoiceNo, description , date, contactPerson , status  });

            await slip.save();

            res.send(slip);

    } catch (error) {
        res.send(error.message);
    }
})

router.get('/', async (req, res) => {

    const slip = await Slip.findAll({order:['id']})

    res.send(slip);
})



router.get('/:id', async (req, res) => {

  const slip = await Slip.findOne({where: {id: req.params.id}, order:['id']})

  res.send(slip);
})




module.exports = router;