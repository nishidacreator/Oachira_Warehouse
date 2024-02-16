const express = require('express');
const CustomerCategory = require('../models/customerCategory');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const { categoryName } = req.body;

            const customerCategory = new CustomerCategory({categoryName});

            await customerCategory.save();

            res.send(customerCategory);

    } catch (error) {
      res.send(error.message);
    }
})

router.get('/', authenticateToken, async (req, res) => {
  try {
    const customerCategory = await CustomerCategory.findAll({})

    res.send(customerCategory);
  } catch (error) {
    res.send(error.message);
  }
    
})

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await CustomerCategory.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Category with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
          res.send(error.message);
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        CustomerCategory.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Customer Category was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Customer Category with id=${id}. Maybe Customer Category was not found or req.body is empty!`
                });
              }
            })
      } catch (error) {
        res.send(error.message);
      }
})


module.exports = router;