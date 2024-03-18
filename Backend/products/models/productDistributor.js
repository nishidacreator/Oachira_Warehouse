const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const ProductDistributor = sequelize.define('productdistributor',{
    productId : {type : DataTypes.INTEGER, allowNull : false},
    distributorId: {type : DataTypes.INTEGER, allowNull : false},
    status: {type : DataTypes.BOOLEAN, allowNull : false},
    brokerId: {type : DataTypes.INTEGER}
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = ProductDistributor;


