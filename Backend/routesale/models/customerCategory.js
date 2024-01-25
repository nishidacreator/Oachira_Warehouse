const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const CustomerCategory = sequelize.define('customerCategory',{
    categoryName : {type: DataTypes.STRING, allowNull : false, unique : true}
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = CustomerCategory