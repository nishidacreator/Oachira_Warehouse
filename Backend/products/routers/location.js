const express = require('express');
const Location = require('../models/location');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const {Op} = require('sequelize');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {locationName, status} = req.body;

            const location = new Location({locationName, status});

            await location.save();

            res.send(location);

    } catch (error) {
        res.send(error);
    }
})

router.get("/", authenticateToken, async (req, res) => {
    try {
      let whereClause = {};
      if (req.query.search) {
        whereClause = {
          [Op.or]: [{ locationName: { [Op.iLike]: `%${req.query.search}%` } }],
        };
      }
  
      let limit;
      let offset;
      if (req.query.pageSize && req.query.page) {
        limit = req.query.pageSize;
        offset = (req.query.page - 1) * req.query.pageSize;
      }
      const location = await Location.findAll({
        where: whereClause,
        order: ["id"],
        limit,
        offset,
      });
  
      let totalCount;
  
      if (req.query.search) {
        totalCount = await Location.count({
          where: whereClause,
        });
      } else {
        totalCount = await Location.count();
      }
  
      if (req.query.page && req.query.pageSize) {
        const response = {
          count: totalCount,
          items: location,
        };
  
        res.json(response);
      } else {
        res.send(location);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.patch('/:id', authenticateToken, async(req,res)=>{
  try {
      Location.update(req.body, {
          where: { id: req.params.id }
        })
          .then(num => {
            if (num == 1) {
              res.send({
                message: "Location was updated successfully."
              });
            } else {
              res.send({
                message: `Cannot update Location with id=${id}. Maybe Location was not found or req.body is empty!`
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

router.delete('/:id', authenticateToken, async(req,res)=>{
  try {
      const location = await Location.findOne({
        where: {id: req.params.id},
        order: ["id"]
      });

      const result = await location.destroy({
          force: true
      });

      if (result === 0) {
          return res.status(404).json({
            status: "fail",
            message: "Location with that ID not found",
          });
        }
    
        res.status(204).json();
      }  catch (error) {
      res.send({error: error.message})
  }
  
})

module.exports = router;