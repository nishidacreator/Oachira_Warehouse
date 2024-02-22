const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Transporter = sequelize.define('transporter',{
    name : {type : DataTypes.STRING, allowNull : false},
    address : {type : DataTypes.STRING},
    contactNumber : {type : DataTypes.STRING, allowNull : false}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Transporter;


