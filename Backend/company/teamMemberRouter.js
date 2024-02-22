const express = require('express')
const TeamMember = require('../company/teamMember');
const Team = require('../company/teamRouter');
// const Register = require('../models/register');
const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { teamId, userId } = req.body;

        const teamMember = new TeamMember({ teamId, userId })
        await teamMember.save()
        res.send(teamMember)

    } catch (error) {
        res.send(error.message)

    }



})

router.get('/', async (req, res) => {
    try {
        const teamMember = await TeamMember.findAll({
            include: [{
                model: {Team, include: 'leader'},  
            }, 'register'],
        });
        res.send(teamMember)

    } catch (error) {
        res.send(error.message)
    }

})
//---
router.get('/:id', async (req, res) => {
    try {

        const teamMember = await TeamMember.findOne({ where: { id: req.params.id } })
        res.send(teamMember)

    } catch (error) {
        res.send(error)
    }
})


module.exports = router;