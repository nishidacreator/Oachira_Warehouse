const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const VehicleType = sequelize.define('vehicleType',{
    typeName : {type : DataTypes.STRING, allowNull : false},
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = VehicleType;


