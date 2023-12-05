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
        res.send(error);
    }
})

router.get("/", authenticateToken, async (req, res) => {
    try {
      let whereClause = {};
      if (req.query.search) {
        whereClause = {
          [Op.or]: [{ hsnName: { [Op.iLike]: `%${req.query.search}%` } }],
        };
      }
  
      let limit;
      let offset;
      if (req.query.pageSize && req.query.page) {
        limit = req.query.pageSize;
        offset = (req.query.page - 1) * req.query.pageSize;
      }
      const hsn = await Hsn.findAll({
        where: whereClause,
        order: ["id"],
        limit,
        offset,
      });
  
      let totalCount;
  
      if (req.query.search) {
        totalCount = await Hsn.count({
          where: whereClause,
        });
      } else {
        totalCount = await Hsn.count();
      }
  
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
      res.status(500).json({ error: error.message });
    }
});

module.exports = router;