const express = require('express');
const router = express.Router();
const {Op} = require('sequelize');

const multer = require('../../utils/multer');
const cloudinary = require('../../utils/cloudinary');

const authenticateToken = require('../../middleware/authorization');

const Customer = require('../models/customer');
const CustomerCategory = require('../models/customerCategory');
const CustomerGrade = require('../models/customerGrade');

router.post('/', authenticateToken, async (req, res) => {
    try {
            const {name, phoneNumber, address1, address2, state, loyaltyPoint, customerCategoryId, 
              customerGradeId, subledgerCode, gstNo, remarks} = req.body;

            const customer = new Customer({name, phoneNumber, address1, address2, state, loyaltyPoint,
               customerCategoryId, customerGradeId, subledgerCode, gstNo, remarks});

            await customer.save();

            res.send(customer);

    } catch (error) {
        res.send(error);
    }
})

router.get("/", authenticateToken, async (req, res) => {
  try {
    let whereClause = {};
    if (req.query.search) {
      whereClause = {
        [Op.or]: [{ customerName: { [Op.iLike]: `%${req.query.search}%` } }],
      };
    }
    
    let limit;
    let offset;
    if (req.query.pageSize && req.query.page) {
      limit = req.query.pageSize;
      offset = (req.query.page - 1) * req.query.pageSize;
    }
    const customer = await Customer.findAll({
      where: whereClause,
      include: [CustomerCategory, CustomerGrade],
      order: ["id"],
      limit,
      offset,
    });

    let totalCount;

    if (req.query.search) {
      totalCount = await Customer.count({
        where: whereClause,
      });
    } else {
      totalCount = await Customer.count();
    }

    if (req.query.page && req.query.pageSize) {
      const response = {
        count: totalCount,
        items: customer,
      };

      res.json(response);
    } else {
      res.send(customer);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', authenticateToken, async(req,res)=>{
    try {
        Customer.update(req.body, {
            where: { id: req.params.id }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Customer was updated successfully."
                });
              } else {
                res.send({
                  message: `Cannot update Customer with id=${id}. Maybe Customer was not found or req.body is empty!`
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

router.post('/fileupload', multer.single('file'), async (req, res) => {
  try {
      const result = await cloudinary.uploader.upload(req.file.path);
      res.send(result);
  } catch (error) {
      res.send(error);
  }
});

router.delete('/:id', authenticateToken, async(req,res)=>{
  try {
    const customers = await Customer.findOne({
      where: {id: req.params.id},
      order: ["id"]
    });

      try {
        const file = customers.cloudinaryId;
        console.log(file);
        if(file){
          const result = await cloudinary.uploader.destroy(file);
        }
  
      } catch (error) {
        res.status(500).send(error);
        console.error(error);
      }

      const result = await customers.destroy({
          force: true
      });

      if (result === 0) {
          return res.status(404).json({
            status: "fail",
            message: "Customer with that ID not found",
          });
        }
    
        res.status(204).json();
      }  catch (error) {
      res.send({error: error.message})
  }
  
})

router.patch('/imageupdate', async (req, res) => {
  try {
    // Use the `upload` method with the `public_id` of the image you want to update
    const result = await cloudinary.uploader.upload(req.body.fileUrl, req.file.path);

    res.send(result);
  } catch (error) {
    console.error('Error updating image:', error.message);
  }
  })

router.get('/byfileurl', authenticateToken, async (req, res) => {
try {
  const customers = await Customer.findOne({
    where: {fileUrl: req.query.fileUrl},
    order: ["id"]
  });

  try {
    const file = customers.cloudinaryId;
    console.log(file);
    const result = await cloudinary.uploader.destroy(file);

    customers.fileUrl = '';
    customers.cloudinaryId = '';
    await customers.save();

    res.send(customers);
  } catch (error) {
    res.status(500).send(error);
    console.error(error);
  }
} catch (error) {
  console.error("Error in customer retrieval:", error);
  res.status(500).json({ error: "Internal Server Error" });
}
});

module.exports = router;