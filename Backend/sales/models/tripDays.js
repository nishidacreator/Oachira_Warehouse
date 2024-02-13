const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const TripDay = sequelize.define('tripDay',{
    routeId : {type : DataTypes.INTEGER, allowNull : false},
    weekDay : {type : DataTypes.STRING, allowNull : false},
    status : {type : DataTypes.BOOLEAN, defaultValue : true}
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = TripDay;


