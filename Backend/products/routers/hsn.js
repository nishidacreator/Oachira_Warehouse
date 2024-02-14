const express = require('express');
const Hsn = require('../models/hsn');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const {Op} = require('sequelize');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {hsnName} = req.body;

            const hsn = new Hsn({hsnName});

            await hsn.save();

            res.send(hsn);

    } catch (error) {
      res.send(error.message);
    }
})

router.get("/", authenticateToken, async (req, res) => {
    try {
      let whereClause = {};
  
      let limit;
      let offset;
      if (req.query.pageSize && req.query.page) {
        limit = req.query.pageSize;
        offset = (req.query.page - 1) * req.query.pageSize;
      }else {
        whereClause = {
          status: true
        };
      }
      const hsn = await Hsn.findAll({
        where: whereClause,
        order: ["id"],
        limit,
        offset,
      });
  
      let totalCount;
      totalCount = await Hsn.count();
      
      if (req.query.page && req.query.pageSize) {
        const response = {
          count: totalCount,
          items: hsn,
        };
  
        res.json(response);
      } else {
        res.send(hsn);
      }
    } catch (error) {
      res.send(error.message);
    }
});

router.get('/:id', authenticateToken, async(req,res)=>{

  try {
      const hsn = await Hsn.findOne({where: {id: req.params.id}, order:['id']});
      res.send(hsn);
      
  } catch (error) {
      res.send(error.message);
  }  
})


router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await Hsn.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Hsn with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
          res.send(error.message);
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        Hsn.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Hsn was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Hsn with id=${id}. Maybe Hsn was not found or req.body is empty!`
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
    let result = await Hsn.findByPk(req.params.id);
    result.status = status

    await result.save();
    res.send(result);
    } catch (error) {
      res.send(error.message);
    }
})

module.exports = router;