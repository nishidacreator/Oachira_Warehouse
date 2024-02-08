const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const CustomerPhone = sequelize.define('customerPhone',{
    customerId : {type: DataTypes.INTEGER, allowNull : false},
    phoneNumber : {type: DataTypes.STRING}
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = CustomerPhone