const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Brand = sequelize.define('brand',{
    brandName : {type : DataTypes.STRING, allowNull : false},
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = Brand;


