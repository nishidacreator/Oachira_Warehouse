const express = require('express');
const Tax = require('../../models/Products/tax');
const router = express.Router();
const authorization = require('../../middleware/authorization')
const authenticateToken = require('../../middleware/authorization');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {taxName, igst, cgst, sgst} = req.body;

            const tax = new Tax({taxName, igst, cgst, sgst});

            await tax.save();

            res.send(tax);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', authenticateToken, async(req,res)=>{

    try {
        const tax = await Tax.findAll({});
        res.send(tax);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.get('/:id', authenticateToken, async(req,res)=>{

  try {
      const tax = await Tax.findOne({where: {id: req.params.id}, order:['id']});
      res.send(tax);
      
  } catch (error) {
      res.send(error.message);
  }  
})


router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await Tax.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Tax with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        Tax.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Tax was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Tax with id=${id}. Maybe Tax was not found or req.body is empty!`
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