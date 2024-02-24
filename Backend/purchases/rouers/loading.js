const express = require('express');

const router = express.Router();
const Loading = require('../models/loading')
const Distributor = require('../../products/models/distributor');
const Entry = require('../models/entry');
const Product = require('../../products/models/product');

const authenticateToken = require('../../middleware/authorization');

router.post('/', async (req, res) => {
    try {
    
    const { name  } = req.body;

            const loading = new Loading({  name  });

            await loading.save();

            res.send(loading);

    } catch (error) {
        res.send(error.message);
    }
})

router.get('/', async (req, res) => {
    try {
        const loading = await Loading.findAll({
            order:['id'],
            include: [Product]
        })

        res.send(loading);
    } catch (error) {
        res.send(error.message);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const loading = await Loading.findOne({
            where: {id: req.params.id}, 
            order:['id'],
            include: [Product]
        })
        
        res.send(loading);
    } catch (error) {
        res.send(error.message)
    }
  
})

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {
      const loading = await Loading.findOne({
        where: {id: req.params.id},
        order: ["id"]
      });

  
    const result = await loading.destroy({
        force: true
    });

    if (result === 0) {
        return res.status(404).json({
            status: "fail",
            message: "Loading with that ID not found",
        });
        }
    
        res.status(204).json();
    }  catch (error) {
        res.send(error.message);
    }
    
})
  
router.patch('/:id', authenticateToken, async(req,res)=>{   
    try {
      const loading = await Loading.findOne({where: {id: req.params.id}})

      loading.brokerName = req.body.brokerName;
      loading.productId = req.body.productId;
      loading.rate = req.body.rate;
    
      await loading.save();
      res.send(loading);
      } catch (error) {
        res.send(error.message);
      }
})

module.exports = router;