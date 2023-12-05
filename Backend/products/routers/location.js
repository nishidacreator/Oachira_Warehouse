const express = require('express');
const Location = require('../models/location');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');
const {Op} = require('sequelize');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {locationName} = req.body;

            const location = new Location({locationName});

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

module.exports = router;