const express = require('express');

const router = express.Router();
const BrockerAccount = require('../models/brockerAccount')
const Distributor = require('../../products/models/distributor');
const Entry = require('../models/entry');
const Brocker = require('../models/brocker');

const authenticateToken = require('../../middleware/authorization');

router.post('/', async (req, res) => {
    try {
    
    const { brockerId, entryId, date, bagNo, amount, status  } = req.body;

            const brockeraccount = new BrockerAccount({  brockerId, entryId, date, bagNo, amount, status  });

            await brockeraccount.save();

            res.send(brockeraccount);

    } catch (error) {
        res.send(error.message);
    }
})

router.get('/', async (req, res) => {
    try {
        const brockeraccount = await BrockerAccount.findAll({
            order:['id'],
            include: [Brocker, Entry]
        })

        res.send(brockeraccount);
    } catch (error) {
        res.send(error.message);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const brockeraccount = await BrockerAccount.findOne({
            where: {id: req.params.id}, 
            order:['id'],
            include: [Distributor]
        })
        
        res.send(brockeraccount);
    } catch (error) {
        res.send(error.message)
    }
  
})

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {
      const brockeraccount = await BrockerAccount.findOne({
        where: {id: req.params.id},
        order: ["id"]
      });

  
    const result = await brockeraccount.destroy({
        force: true
    });

    if (result === 0) {
        return res.status(404).json({
            status: "fail",
            message: "BrockerAccount with that ID not found",
        });
        }
    
        res.status(204).json();
    }  catch (error) {
        res.send(error.message);
    }
    
})
  
router.patch('/:id', authenticateToken, async(req,res)=>{   
    try {
      const brockeraccount = await BrockerAccount.findOne({where: {id: req.params.id}})
      console.log(req.body);
      brockeraccount.description = req.body.description;
      brockeraccount.contactPerson = req.body.contactPerson;
    
      await brockeraccount.save();
      res.send(brockeraccount);
      } catch (error) {
        res.send(error.message);
      }
})

module.exports = router;