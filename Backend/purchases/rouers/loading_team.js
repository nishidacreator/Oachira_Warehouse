const express = require('express');

const router = express.Router();
const LoadingTeam = require('../models/loading_team')

const authenticateToken = require('../../middleware/authorization');

router.post('/', async (req, res) => {
    try {
    
    const { teamname } = req.body;

            const loadingteam = new LoadingTeam({ teamname });

            await loadingteam.save();

            res.send(loadingteam);

    } catch (error) {
        res.send(error.message);
    }
})

router.get('/', async (req, res) => {
    try {
        const loadingteam = await LoadingTeam.findAll({
            order:['id']
        })

        res.send(loadingteam);
    } catch (error) {
        res.send(error.message);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const loadingteam = await LoadingTeam.findOne({
            where: {id: req.params.id}, 
            order:['id']
        })
        
        res.send(loadingteam);
    } catch (error) {
        res.send(error.message)
    }
  
})

router.delete('/:id', authenticateToken, async(req,res)=>{
    try {
      const loadingteam = await LoadingTeam.findOne({
        where: {id: req.params.id},
        order: ["id"]
      });

  
    const result = await loadingteam.destroy({
        force: true
    });

    if (result === 0) {
        return res.status(404).json({
            status: "fail",
            message: "LoadingTeam with that ID not found",
        });
        }
    
        res.status(204).json();
    }  catch (error) {
        res.send(error.message);
    }
    
})
  
router.patch('/:id', authenticateToken, async(req,res)=>{   
    try {
      const loadingteam = await LoadingTeam.findOne({where: {id: req.params.id}})

      loadingteam.teamname = req.body.teamname;
    
      await loadingteam.save();
      res.send(loadingteam);
      } catch (error) {
        res.send(error.message);
      }
})

module.exports = router;