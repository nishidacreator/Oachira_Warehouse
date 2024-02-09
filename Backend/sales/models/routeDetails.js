const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const RouteDetails = sequelize.define('routeDetails',{
    routeId : {type : DataTypes.INTEGER, allowNull : false},
    customerId : {type : DataTypes.INTEGER, allowNull : false},
    routeIndex : {type : DataTypes.INTEGER, allowNull : false},
    status : {type : DataTypes.BOOLEAN, defaultValue : true},
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = RouteDetails;


