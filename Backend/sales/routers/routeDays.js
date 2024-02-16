const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');

const Route = require('../models/route');
const RouteDay = require('../models/routeDays');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {routeId, weekDays} = req.body;

            const weekDaysCopy = weekDays.slice();
            for(i = 0; i < weekDaysCopy.length; i++) {
                
                const weekDay = weekDays.pop()

                const result = new RouteDay({routeId, weekDay})

                await result.save()
 
            }

            res.status(200).json({message: "Success"})
            
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
        status : true
      }
    }
    const route = await RouteDay.findAll({
      where: whereClause,
      order: ["id"],
      limit,
      offset,
      include: [ Route ]
    });

    let totalCount;
    totalCount = await RouteDay.count({
      where: {status: true}
    });


    if (req.query.page && req.query.pageSize) {
      const response = {
        count: totalCount,
        items: route,
      };

      res.json(response);
    } else {
      res.send(route);
    }
  } catch (error) {
    res.send(error.message);
  }
});

router.get('/:id', authenticateToken,async(req,res)=>{

  try {
      const result = await RouteDay.findOne({
        where: {id: req.params.id},
        include : Route});
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.get('byrouteid/:id', authenticateToken,async(req,res)=>{

  try {
      const result = await RouteDay.findAll({
        where: {routeId: req.params.id},
        include : Route});
      res.send(result);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await RouteDay.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "RouteDay with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
          res.send(error.message);
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
      console.log(req.body);
      const {routeId, weekDays} = req.body;

      let day = await RouteDay.findOne({id: req.params.id})
      console.log(day);
      day.routeId = routeId;
      day.weekDays = weekDays;
      console.log(day);
      await day.save();
      res.send(day);
      } catch (error) {
        res.send(error.message);
      }
})

module.exports = router;