const express = require('express');
const SecondaryUnit = require('../models/secondaryUnit');
const router = express.Router();
const PrimaryUnit = require('../models/primayUnit');
const authenticateToken = require('../../middleware/authorization');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {secondaryUnitName, primaryUnitId, primaryFactor, secondaryFactor, loadingCharge} = req.body;

            const secondaryUnit = new SecondaryUnit({secondaryUnitName, primaryUnitId, primaryFactor, secondaryFactor, loadingCharge});

            await secondaryUnit.save();

            res.send(secondaryUnit);

    } catch (error) {
        res.send(error.message);
    }
})

router.get('/', authenticateToken, async(req,res)=>{
    try {
        const secondaryUnit = await SecondaryUnit.findAll({include: [PrimaryUnit], order:['id']});
        res.send(secondaryUnit);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/byname/:name', authenticateToken, async(req,res)=>{
  try {
      const secondaryUnit = await SecondaryUnit.findOne({
        where: {secondaryUnitName: req.params.name}
      });
      res.send(secondaryUnit);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.get('/byid/:id', authenticateToken, async(req,res)=>{
  try {
      const secondaryUnit = await SecondaryUnit.findOne({
        where: {id: req.params.id}
      });
      res.send(secondaryUnit);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await SecondaryUnit.destroy({
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
        SecondaryUnit.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "SecondaryUnit was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update SecondaryUnit with id=${id}. Maybe SecondaryUnit was not found or req.body is empty!`
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
    let result = await SecondaryUnit.findByPk(req.params.id);
    result.status = status

    await result.save();
    res.send(result);
    } catch (error) {
      res.send(error.message);
    }
})
module.exports = router;