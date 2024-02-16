const express = require('express');
const router = express.Router();
const Entry = require('../models/entry')
const authenticateToken = require('../../middleware/authorization');
const EntryDetails = require('../models/entryDetails');


router.post('/', authenticateToken, async (req, res) => {
    try {
            const {
               entryId,
                productId ,
                mrp,
                rate,
                gross,
                discount ,
                sgst ,
                cgst ,
                net,
                rent,
                commision,
                profit ,
                salePrice,
                quantity,
                unitId

            } = req.body;
            

            const entryDetails = await EntryDetails.bulkCreate(
                entryId,
                productId ,
                mrp,
                rate,
                gross,
                discount ,
                sgst ,
                cgst ,
                net,
                rent,
                commision,
                profit ,
                salePrice,
                quantity,
                unitId

            )

            await entryDetails.save();
          
            res.send(entryDetails);

    } catch (error) {
        res.send(error.message);
    }
})

router.get('/:id', authenticateToken, async(req,res)=>{
    try {
        const entryDetails = await EntryDetails.findAll({
            where:{entryId: req.params.id}, 
            // include : [PurchaseOrder, Product], order:['id']
        });
        res.send(entryDetails);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/', authenticateToken, async(req,res)=>{

    try {
        const entryDetails = await EntryDetails.findAll();
        res.send(entryDetails);
        
    } catch (error) {
        res.send(error.message);
    }  
})


module.exports = router;