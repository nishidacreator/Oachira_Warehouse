const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Location = sequelize.define('location',{
    locationName : {type : DataTypes.STRING, allowNull : false}
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = Location;


