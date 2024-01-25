const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const EntryDetails = sequelize.define('entryDetails',{
    requestId : {type : DataTypes.INTEGER, allowNull : false},
    productId : {type : DataTypes.INTEGER, allowNull : false},
    quantity : {type : DataTypes.FLOAT, allowNull : false},
    unitId : {type : DataTypes.INTEGER}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = EntryDetails;


