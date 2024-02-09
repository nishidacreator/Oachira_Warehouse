const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Route = sequelize.define('route',{
    routeName : {type : DataTypes.STRING, allowNull : false},
    vehicleId  : {type : DataTypes.INTEGER, allowNull : false},
    driverId : {type : DataTypes.INTEGER, allowNull : false},
    salesManId : {type : DataTypes.INTEGER, allowNull : false},
    salesExecutiveId : {type : DataTypes.INTEGER, allowNull : false},
    status : {type : DataTypes.BOOLEAN, defaultValue : true}
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = Route;


