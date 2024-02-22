const express = require('express')
const router = express.Router()
const Banking = require('../company/bank')
const Company = require('../company/company')


router.post('/',async(req,res)=>{
    try {
    const{companyId,accountNumber,accountHolderName, bankName,bankAddress,ibanNumber,swiftCode,vat,remarks} = req.body;

    const banking = new Banking({companyId,accountNumber,accountHolderName,ibanNumber,bankName,bankAddress,vat,swiftCode,remarks})
    await banking.save()
     res.send(banking)
        
    } catch (error) {
        res.send(error)
        
    }
})
    router.get('/', async (req, res) => {
        try {
            const banking = await Banking.findAll({ include: Company });
            res.send(banking);
        } catch (error) {
            // Handle error appropriately, e.g., logging or sending an error response
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
    


router.get('/:id', async(req,res)=>{
    try {
        
        const bank= await Banking.findOne ( {where : { companyId:req.params.id}})
        res.send(bank)   
        
    } catch (error) {
        res.send(error)
    }
  })
module.exports = router;