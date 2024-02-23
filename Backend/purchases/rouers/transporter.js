const express = require('express')
const Transporter = require('../../purchases/models/transporter');

// const Register = require('../models/register');
const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { name, address, contactNumber } = req.body;

        const transporter = new Transporter({ name, address, contactNumber })
        await transporter.save()
        res.send(transporter)

    } catch (error) {
        res.send(error.message)

    }



})

router.get('/', async (req, res) => {
    try {
        const transporter = await Transporter.findAll({});
        res.send(transporter)

    } catch (error) {
        res.send(error.message)
    }

})

router.get('/:id', async (req, res) => {
    try {

        const transporter = await Transporter.findOne({ where: { id: req.params.id } })
        res.send(transporter)

    } catch (error) {
        res.send(error)
    }
})



router.delete('/:id', async(req,res)=>{
    try {

        const result = await Transporter.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Transporter with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
          res.send(error.message);
    }
    
})

router.patch('/:id', async(req,res)=>{
    try {
        Transporter.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Transporter was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Transporter with id=${id}. Maybe Store was not found or req.body is empty!`
                });
              }
            })
      } catch (error) {
        res.send(error.message);
      }
})

module.exports = router;