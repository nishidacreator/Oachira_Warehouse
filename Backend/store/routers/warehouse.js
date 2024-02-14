const express = require('express');
const Warehouse = require('../models/warehouse');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
            const { warehouseName, warehouseLocation, warehouseInChargeId, phoneNumber, panNo, fssaiNo, gstIn, state, status } = req.body;

            const warehouse = new Warehouse({warehouseName, warehouseLocation, counterCount, warehouseInChargeId, phoneNumber,
                panNo, fssaiNo, gstIn, state, status});

            await warehouse.save();

            res.send(warehouse);

    } catch (error) {
      res.send(error.message);
    }
})

router.get('/', async (req, res) => {

  try {
    const warehouse = await Warehouse.findAll({order:['id'], include: ['warehouseInCharge']})

    res.send(warehouse);
  } catch (error) {
    res.send(error.message);
  }

})

router.get('/:id', async (req, res) => {
  try {
    const warehouse = await Warehouse.findOne({
      where: {id: req.params.id}, 
      order:['id'],
      // include: ['warehouseInCharge']
    })
  
    res.send(warehouse);
  } catch (error) {
    res.send(error.message);
  }
  
})

router.delete('/:id', async(req,res)=>{
    try {

        const result = await Warehouse.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Warehouse with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
          res.send(error.message);
    }
    
})

router.patch('/:id', async(req,res)=>{
    try {
        Warehouse.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Warehouse was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Warehouse with id=${id}. Maybe Warehouse was not found or req.body is empty!`
                });
              }
            })
      } catch (error) {
        res.send(error.message);
      }
})
module.exports = router;