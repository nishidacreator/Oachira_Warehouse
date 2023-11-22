const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const Role = require('../models/role')


router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, phoneNumber, password, roleId, status } = req.body;
        const user = await User.findOne({where: {phoneNumber:phoneNumber}});
    if (user) {
        return res.status(400).send({ message: 'User already exists in this phone number' })  
    }
    const pass = await bcrypt.hash(password, 10);
    const newUser = new User({
        name : name, 
        phoneNumber : phoneNumber, 
        password : pass, 
        roleId : roleId, 
        status : status
    });
    await newUser.save();
    res.status(200).send({id:newUser.id, name:newUser.name, pohneNumber:newUser.phoneNumber});
    } catch (error) {
        res.send({error : error.message});
    }   
})

router.get('/', authenticateToken, async(req,res)=>{
    try {
        const user = await User.findAll({include : [Role], order:['id']});
        res.send(user);
        
    } catch (error) {
        res.send(error.message);
    }  
})

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await User.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "User with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
        res.send({error: error.message})
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
  const pass = await bcrypt.hash(req.body.password, 10);

    try {
        const user = {
          name : req.body.name,
          phoneNumber : req.body.phoneNumber,
          password : pass,
          roleId : req.body.roleId,
          status: req.body.status,
         
        }

        User.update(user, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "User was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
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
 