const express = require('express');
const Gst = require('../models/gst');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {gstName, igst, cgst, sgst} = req.body;

            const gst = new Gst({gstName, igst, cgst, sgst});

            await gst.save();

            res.send(gst);

    } catch (error) {
        res.send(error.message);
    }
})

router.get('/', authenticateToken, async(req,res)=>{

    try {
        const gst = await Gst.findAll({});
        res.send(gst);
        
    } catch (error) {
      res.send(error.message);
    }  
})

router.get('/:id', authenticateToken, async(req,res)=>{

  try {
      const gst = await Gst.findOne({where: {id: req.params.id}, order:['id']});
      res.send(gst);
      
  } catch (error) {
    res.send(error.message);
  }  
})


router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await Gst.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Gst with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
          res.send(error.message);
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        Gst.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Gst was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Gst with id=${id}. Maybe Gst was not found or req.body is empty!`
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
    let result = await Gst.findByPk(req.params.id);
    result.status = status

    await result.save();
    res.send(result);
    } catch (error) {
      res.send(error.message);
    }
})

module.exports = router;