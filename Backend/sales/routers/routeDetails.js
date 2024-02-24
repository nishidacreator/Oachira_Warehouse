const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');

const Route = require('../models/route');
const Customer = require('../models/customer');
const RouteDetails = require('../models/routeDetails');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {routeId, customerId, routeIndex, status} = req.body;

            const indexExist = await RouteDetails.findAll({
              where: { routeId, routeIndex }
            });
          
            if (indexExist && indexExist.length > 0) {
              return res.send("Customer already exists in the same route index");
            }

            const routeDetails = new RouteDetails({routeId, customerId, routeIndex, status})
            await routeDetails.save();

            res.send(routeDetails);

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
    const route = await RouteDetails.findAll({
      where: whereClause,
      order: ["id"],
      limit,
      offset,
      include: [Customer, Route ]
    });

    let totalCount;
    totalCount = await RouteDetails.count({
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

router.get('/:id', authenticateToken, async(req,res)=>{
  try {
      const routeDetails = await RouteDetails.findOne({
        where: {id: req.params.id},
        include: [Route, Customer]});
      res.send(routeDetails);
      
  } catch (error) {
      res.send(error.message);
  }  
})

router.get('/byrouteid/:id', authenticateToken, async(req,res)=>{

  try {
      const routeDetails = await RouteDetails.findAll({
        where: {routeId: req.params.id},
        include: [Route, Customer]});
      res.send(routeDetails);
      
  } catch (error) {
      res.send(error.message);
  }  
})


router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await RouteDetails.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "RouteDetails with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
          res.send(error.message);
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        RouteDetails.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "RouteDetails was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update RouteDetails with id=${id}. Maybe RouteDetails was not found or req.body is empty!`
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
    let route = await RouteDetails.findByPk(req.params.id);
    route.status = status

    await route.save();
    res.send(route);
    } catch (error) {
      res.send(error.message);
    }
})



module.exports = router;