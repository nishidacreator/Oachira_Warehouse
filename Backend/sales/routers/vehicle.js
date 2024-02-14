const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authorization');

const multer = require('../../utils/multer');
const cloudinary = require('../../utils/cloudinary');    

const Vehicle = require('../models/vehicle');
const VehicleType = require('../models/vehicleType');

router.post("/", multer.single("category_image"), authenticateToken, async (req, res) => {
  try {
    let vehicle = {
      registrationNumber: req.body.registrationNumber,
      vehicleTypeId: req.body.vehicleTypeId,
      taxExpiry: req.body.taxExpiry,
      insuranceExpiry: req.body.insuranceExpiry,
      polutionExpiry: req.body.polutionExpiry,
      capacity: req.body.capacity,
      permitExpiry: req.body.permitExpiry,
      fitnessExpiry: req.body.fitnessExpiry,
      branchId: req.body.branchId,
      vehicle_image: req.file?.path,
    };
    if (req.file) {
      const image = await cloudinary.uploader.upload(req.file.path, {
        public_id: vehicle.registrationNumber,
      });
      vehicle.vehicle_image = image.secure_url;
    }
    const result = await Vehicle.create(vehicle);
    res.send(result);
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    let whereClause = {};
    
    let limit;
    let offset;
    if (req.query.pageSize && req.query.page) {
      limit = req.query.pageSize;
      offset = (req.query.page - 1) * req.query.pageSize;
    }
    else {
      whereClause = {
        status : true
      }
    }
    const vehicle = await Vehicle.findAll({
      where: whereClause,
      order: ["id"],
      limit,
      offset,
      include: [ VehicleType ]
    });

    let totalCount;
    totalCount = await Vehicle.count({
      where: {status: true}
    });


    if (req.query.page && req.query.pageSize) {
      const response = {
        count: totalCount,
        items: vehicle,
      };

      res.json(response);
    } else {
      res.send(vehicle);
    }
  } catch (error) {
    res.send(error.message);
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: {id: req.params.id},
      order: ["id"]
    });

    res.send(vehicle);
  } catch (error) {
    res.send(error.message);
  }
  });

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {

        const result = await Vehicle.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
              status: "fail",
              message: "Vehicle with that ID not found",
            });
          }
      
          res.status(204).json();
        }  catch (error) {
          res.send(error.message);
    }
    
})

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        Vehicle.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Vehicle was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Vehicle with id=${id}. Maybe Vehicle was not found or req.body is empty!`
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
    let vehicle = await Vehicle.findByPk(req.params.id);
    vehicle.status = status

    await vehicle.save();
    res.send(vehicle);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
})

module.exports = router;