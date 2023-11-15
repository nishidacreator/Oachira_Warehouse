const express = require('express');
const PrimaryUnit = require('../../models/Products/primayUnit');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {primaryUnitName, value} = req.body;

            const primaryUnit = new PrimaryUnit({primaryUnitName, value});

            await primaryUnit.save();

            res.send(primaryUnit);

    } catch (error) {
        res.send(error);
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
        res.send({error: error.message})
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
        res.status(500).json({
          status: "error",
          message: error.message,
        });
      }
})
module.exports = router;