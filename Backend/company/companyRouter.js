const express = require('express');
const Company = require('../company/company');
const router = express.Router();

router.post('/', async (req, res) => {
    try {


            const { companyName,apiKey, companyCode, locationName, companyInChargeId, isStore, gstId, isWarehouse} = req.body;

            const company = new Company({companyName,apiKey, companyCode, locationName, companyInChargeId,isStore,isWarehouse, gstId});

            await company.save();

            res.send(company);

    } catch (error) {
      res.send(error.message);
    }
})

router.get('/', async (req, res) => {
  try {
    const company = await Company.findAll({order:['id'], include: ['companyInCharge']})

    res.send(company);
  } catch (error) {
    res.send(error.message);
  }
})

router.get('/:id', async (req, res) => {
  try {
    console.log("compannyyyyyyyyy");
    const company = await Company.findOne({
      where: {id: req.params.id}, 
      order:['id'],
      include: ['companyInCharge']
    })
  
    res.send(company);
  } catch (error) {
    res.send(error.message);
  }
  
})

router.delete('/:id', async(req,res)=>{
    try {

        const result = await Company.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Company with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
          res.send(error.message);
    }
    
})

router.patch('/:id', async(req,res)=>{
    try {
        Company.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Company was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Company with id=${id}. Maybe Store was not found or req.body is empty!`
                });
              }
            })
      } catch (error) {
        res.send(error.message);
      }
})


module.exports = router;