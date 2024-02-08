const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const RouteDay = sequelize.define('routeDay',{
    routeId : {type : DataTypes.INTEGER, allowNull : false},
    weekDay : {type : DataTypes.STRING, allowNull : false},
    status : {type : DataTypes.BOOLEAN, defaultValue : true}
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = RouteDay;


