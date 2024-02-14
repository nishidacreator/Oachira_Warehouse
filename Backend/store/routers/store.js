const express = require('express');
const Store = require('../models/store');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
            const { storeName, storeLocation, counterCount, storeInChargeId, phoneNumber, gstId, storeBaseUrl, status } = req.body;

            const store = new Store({storeName, storeLocation, counterCount, storeInChargeId, phoneNumber, gstId, storeBaseUrl, status});

            await store.save();

            res.send(store);

    } catch (error) {
      res.send(error.message);
    }
})

router.get('/', async (req, res) => {
  try {
    const store = await Store.findAll({order:['id'], include: ['storeInCharge']})

    res.send(store);
  } catch (error) {
    res.send(error.message);
  }
})

router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findOne({
      where: {id: req.params.id}, 
      order:['id'],
      include: ['storeInCharge']
    })
  
    res.send(store);
  } catch (error) {
    res.send(error.message);
  }
  
})

router.delete('/:id', async(req,res)=>{
    try {

        const result = await Store.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Store with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
          res.send(error.message);
    }
    
})

router.patch('/:id', async(req,res)=>{
    try {
        Store.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Store was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Store with id=${id}. Maybe Store was not found or req.body is empty!`
                });
              }
            })
      } catch (error) {
        res.send(error.message);
      }
})
module.exports = router;