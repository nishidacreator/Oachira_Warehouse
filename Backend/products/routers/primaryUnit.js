const express = require('express');
const PrimaryUnit = require('../models/primayUnit');
const SecondaryUnit = require('../models/secondaryUnit');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {primaryUnitName, factor, secondaryUnits} = req.body;

            const primaryUnit = new PrimaryUnit({primaryUnitName, factor});

            await primaryUnit.save();

            if(secondaryUnits){
              const unitId = primaryUnit.id;
              for(let i = 0; i < secondaryUnits.length; i++) {
                secondaryUnits[i].primaryUnitId = unitId;
              }
              const sU = await SecondaryUnit.bulkCreate(secondaryUnits)
              const response = {
                pu: primaryUnit,
                su: sU
              }
              res.send(response)
            }else{
              res.send(primaryUnit);
            }
            


    } catch (error) {
      res.send(error.message);
    }
})

router.get('/', authenticateToken, async(req,res)=>{
    try {
        const primaryUnit = await PrimaryUnit.findAll({order:['id']});
        res.send(primaryUnit);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await PrimaryUnit.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Unit with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
          res.send(error.message);
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        PrimaryUnit.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Primary Unit was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Primary Unit with id=${id}. Maybe Primary Unit was not found or req.body is empty!`
                });
              }
            })
      } catch (error) {
        res.send(error.message);
      }
})

router.patch('/statusupdate/:id', authenticateToken, async(req,res)=>{
  try {

    let status = req.body.status;
    let result = await PrimaryUnit.findByPk(req.params.id);
    result.status = status

    await result.save();
    res.send(result);
    } catch (error) {
      res.send(error.message);
    }
})
module.exports = router;