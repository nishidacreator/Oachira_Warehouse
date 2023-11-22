const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwtTokens = require('../../utils/jsonWebToken');



router.post('/', async(req, res)=> {
    try {

        const { phoneNumber, password } = req.body;

        const user = await User.findOne({where: { phoneNumber: phoneNumber }});

        if(!user){
            return res.status(404).send({ message: 'User not found' });            
        }
        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword){
            return res.status(401).send({ message: 'incorrect password' });
        }
        
        let userToken = {id:user.id, name:user.name, phoneNumber: user.phoneNumber, role: user.roleId, branch: user.branchId};

        let token = jwtTokens(userToken);

        res.cookie('refreshtoken', token.refreshToken, {httpOnly : true})

        return res.status(200).send({"token" : token, "role": user.roleId, "name" : user.name, "id" : user.id, "branch": user.branchId});

    } catch (error) {
        res.send(error);
    }    
})


module.exports = router;