const express = require('express');

const router = express.Router();
const Brocker = require('../models/brocker')
const Distributor = require('../../products/models/distributor');
const Entry = require('../models/entry');
const Product = require('../../products/models/product');

const authenticateToken = require('../../middleware/authorization');

router.post('/', async (req, res) => {
    try {
    
    const { productId, brokerName, rate  } = req.body;

            const brocker = new Brocker({  productId, brokerName, rate  });

            await brocker.save();

            res.send(brocker);

    } catch (error) {
        res.send(error.message);
    }
})

router.get('/', async (req, res) => {
    try {
        const brocker = await Brocker.findAll({
            order:['id'],
            include: [Product]
        })

        res.send(brocker);
    } catch (error) {
        res.send(error.message);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const brocker = await Brocker.findOne({
            where: {id: req.params.id}, 
            order:['id'],
            include: [Product]
        })
        
        res.send(brocker);
    } catch (error) {
        res.send(error.message)
    }
  
})

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {
      const brocker = await Brocker.findOne({
        where: {id: req.params.id},
        order: ["id"]
      });

  
    const result = await brocker.destroy({
        force: true
    });

    if (result === 0) {
        return res.status(404).json({
            status: "fail",
            message: "Brocker with that ID not found",
        });
        }
    
        res.status(204).json();
    }  catch (error) {
        res.send(error.message);
    }
    
})
  
router.patch('/:id', authenticateToken, async(req,res)=>{   
    try {
      const brocker = await Brocker.findOne({where: {id: req.params.id}})

      brocker.brokerName = req.body.brokerName;
      brocker.productId = req.body.productId;
      brocker.rate = req.body.rate;
    
      await brocker.save();
      res.send(brocker);
      } catch (error) {
        res.send(error.message);
      }
})

module.exports = router;