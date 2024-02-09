const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');

const Vehicle = require('../models/vehicle');
const User = require('../../users/models/user');
const TripDay = require('../models/routeDays');
const Trip = require('../models/trip');
// const DeliveryDays = require('../models/deliveryDays');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {routeId, date, driverId, salesManId, status, tripDetails} = req.body;

            const trip = new Trip({routeId, date, driverId, salesManId, status});

            await trip.save();

            // const routeId = route.id
            // for(let i = 0; i < routeDay.length; i++) {           
            //       routeDay[i].routeId = routeId;
            // }

            // const collDays = await TripDay.bulkCreate({routeDay})

            // const delivery = deliveryDays.weekDays.slice();

            // for(let i = 0; i < delivery.length; i++) {

            //   const weekDay = deliveryDays.weekDays.pop()

            //   const result = new DeliveryDays({routeId, weekDay})

            //   await result.save()
            // }

            res.status(200).send(route)

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

    const route = await Trip.findAll({
      where: whereClause,
      order: ["id"],
      limit,
      offset,
      include: ['tripDriver', 'tripSalesMan' ]
    });

    let totalCount;
    totalCount = await Trip.count({
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
    res.status(500).json({ error: error.message });
  }
});


router.get('/:id', authenticateToken,async(req,res)=>{

  try {
      const route = await Trip.findOne({
        where: {id: req.params.id},
        include: ['driver', 'salesMan', 'salesExecutive' , Vehicle ]
      });
      res.send(route);
      
  } catch (error) {
    res.send(error.message);
  }  
})


router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await Trip.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Trip with that ID not found",
            });
          }    
          res.status(204).json();
        }  catch (error) {
          res.send(error.message);
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        Trip.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Trip was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Trip with id=${id}. Maybe Trip was not found or req.body is empty!`
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
    let route = await Trip.findByPk(req.params.id);
    route.status = status

    await route.save();
    res.send(route);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
})

module.exports = router;