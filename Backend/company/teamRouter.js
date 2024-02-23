const express = require('express')
const Team= require('../company/team');
// const Register = require('../models/register');
const TeamMember = require('../company/teamMember');
const router = express.Router()


router.post('/', async (req, res) => {
    try {
        const { teamName, userId, teamMembers } = req.body;

        const team = new Team({ teamName, userId })
        console.log('team', team)
        await team.save()

        let teamId = team.id;
        console.log('teamId', teamId)
    for (let i = 0; i < teamMembers.length; i++) {
        teamMembers[i].teamId = teamId;
    }
    const teamMembersBulkResult = await TeamMember.bulkCreate(teamMembers);
        res.send(teamMembersBulkResult)

    } catch (error) {
        res.send(error.message)

    }

})

router.get('/', async (req, res) => {
    try {
        console.log("hiiiiiii");
        const team = await Team.findAll({
            include: [ 'leader',
              {
                model: TeamMember,
                include: 'register'
              },
            ],
          });
          
          res.send(team);
          

    } catch (error) {
        res.send(error.message)
    }

})
// --
router.get('/:id', async (req, res) => {
    try {

        const team = await Team.findOne({
            include: ['leader',
                {
                    model: TeamMember,
                    include: 'register'
                },
            ], where: { id: req.params.id } })
        res.send(team)

    } catch (error) {
        res.send(error)
    }
})


router.patch('/:id', async(req,res)=>{
    try {
      Team.update(req.body, {
          where: { id: req.params.id }
        })
          .then(num => {
            if (num == 1) {
              res.send({
                message: "Team was updated successfully."
              });
            } else {
              res.send({
                message: `Cannot update Team with id=${id}. Maybe Team was not found or req.body is empty!`
              });
            }
          })
  
          const teaId = req.params.id;
  
          const result = await TeamMember.destroy({
            where: { teamId: teaId},
            force: true,
          });
  
          let details = req.body.teamMembers;
          for(let i = 0; i < details.length; i++){
            details[i].teamId = teaId;
          }
  
          let cp = await TeamMember.bulkCreate(details)
          console.log(cp);
    } catch (error) {
      res.send(error.message);
    }
  })


router.delete('/:id', async (req, res) => {
    try {

        const team = await Team.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (team === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Team with that ID not found",
            });
        }

        res.status(204).json();
    } catch (error) {
        res.send({ error: error.message })
    }

})

module.exports = router;