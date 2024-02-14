const express = require('express');
const Role = require('../models/role');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');


router.post('/',authenticateToken, async (req, res) => {
    try {
            const { roleName, status } = req.body;

            const role = new Role({roleName, status});

            await role.save();

            res.send(role);

    } catch (error) {
        res.send(error.message);
    }
})

router.get('/', authenticateToken, async (req, res) => {
  try {
    const role = await Role.findAll({order:['id']})

    res.send(role);
  } catch (error) {
    res.send(error.message);
  }


})

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const role = await Role.findOne({where: {id: req.params.id}, order:['id']})

    res.send(role);
  } catch (error) {
    res.send(error.message);
  }

  
})

router.get('/rolename', authenticateToken, async (req, res) => {
  try {
    const roles = await Role.findOne({
      where: { roleName: req.query.role }, 
      order: ["id"]
    });

    res.send(roles);
  } catch (error) {
    res.send(error.message);
  }
});


router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await Role.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Role with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
          res.send(error.message);
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        Role.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Role was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Role with id=${id}. Maybe Role was not found or req.body is empty!`
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
    let result = await Role.findByPk(req.params.id);
    result.status = status

    await result.save();
    res.send(result);
    } catch (error) {
      res.send(error.message);
    }
})
module.exports = router;