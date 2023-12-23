const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Location = sequelize.define('location',{
    locationName : {type : DataTypes.STRING, allowNull : false},
    status: {type : DataTypes.BOOLEAN, defaultValue : true},
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = Location;


