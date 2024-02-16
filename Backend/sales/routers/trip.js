const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');

const Vehicle = require('../models/vehicle');
const Trip = require('../models/trip');
const TripDetails = require('../models/tripDetails');
const Route = require('../models/route');
const Customer = require('../models/customer');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {routeId, date, driver, salesMan, status, customers} = req.body;

            const trip = new Trip({routeId, date, driver, salesMan, status});

            await trip.save();

            const id = trip.id
            console.log(customers);
            for(let i = 0; i < customers.length; i++) {           
              customers[i].tripId = id;
            }
            console.log(customers);

            const details = await TripDetails.bulkCreate(customers)
            console.log(details);

            // const delivery = deliveryDays.weekDays.slice();

            // for(let i = 0; i < delivery.length; i++) {

            //   const weekDay = deliveryDays.weekDays.pop()

            //   const result = new DeliveryDays({routeId, weekDay})

            //   await result.save()
            // }

            res.status(200).send(details)

    } catch (error) {
      res.send(error.message);
    }
})


router.get("/", authenticateToken, async (req, res) => {
  try {
    let whereClause = {};
    
    let limit;
    let offset;
    // if (req.query.pageSize && req.query.page) {
    //   limit = req.query.pageSize;
    //   offset = (req.query.page - 1) * req.query.pageSize;
    // }else {
    //   whereClause = {
    //     status : true
    //   }
    // }

    const route = await Trip.findAll({
      order: ["id"],
      limit,
      offset,
      include: [Route, TripDetails]
    });

    // let totalCount;
    // totalCount = await Trip.count({
    //   where: {status: true}
    // });


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
      const route = await Trip.findOne({
        where: {id: req.params.id},
        include: [
          {model: Route, include: [Vehicle, 'salesMan', 'driver', 'salesExecutive']}, 
          {model: TripDetails, include: [Customer]}
        ]
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

        const tripId = req.params.id;

        const result = await TripDetails.destroy({
          where: { tripId: tripId},
          force: true,
        });

        let list = req.body.customers;
        for(let i = 0; i < list.length; i++){
          list[i].tripId = tripId;
        }

        let pd = await TripDetails.bulkCreate(list)
        
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
      res.send(error.message);
    }
})

module.exports = router;