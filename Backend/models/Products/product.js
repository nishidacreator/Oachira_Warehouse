const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Product = sequelize.define('product',{
    productName : {type : DataTypes.STRING, allowNull : false},
    code : {type : DataTypes.STRING},
    barCode : {type : DataTypes.STRING},
    primaryUnitId : {type : DataTypes.INTEGER, allowNull : false},
    categoryId : {type : DataTypes.INTEGER, allowNull : false},
    brandId : {type : DataTypes.INTEGER, allowNull : false},
    reorderQuantity : {type : DataTypes.FLOAT},
    loyaltyPoint : {type : DataTypes.FLOAT},
    product_image: {type : DataTypes.STRING}
},
{
    freezeTableName: true
})

module.exports = Product;