const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const LoyaltyPoint = sequelize.define('loyaltypoint',{
    customerId : {type : DataTypes.INTEGER, allowNull : false},
    point : {type : DataTypes.FLOAT, allowNull : false},
    date : {type : DataTypes.DATE, allowNull : false, defaultValue: Date.now()},
    total : {type : DataTypes.FLOAT},
    cash : {type : DataTypes.FLOAT}
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = LoyaltyPoint;


