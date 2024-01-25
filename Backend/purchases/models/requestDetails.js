const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const RequestDetails = sequelize.define('requestDetails',{
    requestId : {type : DataTypes.INTEGER, allowNull : false},
    productId : {type : DataTypes.INTEGER, allowNull : false},
    quantity : {type : DataTypes.FLOAT, allowNull : false},
    secondaryUnitId : {type : DataTypes.INTEGER}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = RequestDetails;


