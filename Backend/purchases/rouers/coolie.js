const express = require('express');
const Coolie = require('../models/coolie');
const router = express.Router();


router.post('/', async (req, res) => {
    try {
            const { secondaryUnitId, amount } = req.body;

            const coolie = new Coolie({secondaryUnitId, amount});

            await coolie.save();

            res.send(coolie);

    } catch (error) {
        res.send(error);
    }
})

router.get('/', async (req, res) => {

    const coolie = await Coolie.findAll({order:['id']})

    res.send(coolie);
})

router.get('/:id', async (req, res) => {

  const coolie = await Coolie.findOne({where: {id: req.params.id}, order:['id']})

  res.send(coolie);
})

router.delete('/:id', async(req,res)=>{
    try {

        const result = await Coolie.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Coolie with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', async(req,res)=>{
    try {
        Coolie.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Coolie was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Coolie with id=${id}. Maybe Coolie was not found or req.body is empty!`
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