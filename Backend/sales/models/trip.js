const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Trip = sequelize.define('trip',{
    routeId : {type : DataTypes.INTEGER, allowNull : false},
    date  : {type : DataTypes.DATEONLY},
    driverId : {type : DataTypes.INTEGER, allowNull : false},
    salesManId : {type : DataTypes.INTEGER, allowNull : false},
    status : {type : DataTypes.STRING, defaultValue : true}
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = Trip;


