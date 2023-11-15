const jwt = require('jsonwebtoken');


function jwtTokens({id,name,phoneNumber,role,branch}){
    const user = {id,name,phoneNumber,role,branch};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'});
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '2d'});
    return({accessToken, refreshToken});    
}

module.exports = jwtTokens;