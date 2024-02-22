const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Product = sequelize.define('product',{
    productName : {type : DataTypes.STRING, allowNull : false},
    code : {type : DataTypes.STRING, unique : true},
    barCode : {type : DataTypes.STRING},
    categoryId : {type : DataTypes.INTEGER, allowNull : false},
    subCategoryId : {type : DataTypes.INTEGER},
    brandId : {type : DataTypes.INTEGER},
    locationId : {type : DataTypes.INTEGER},
    gstId : {type : DataTypes.INTEGER},
    hsnId : {type : DataTypes.INTEGER}, 
    baseUnitId : {type : DataTypes.INTEGER},
    reorderQuantity : {type : DataTypes.FLOAT},
    warehouseLoyalityPoint :{ type : DataTypes . FLOAT},
    retailLoyalityPoint : {type : DataTypes.FLOAT},
    isSpecial : { type : DataTypes.BOOLEAN},
    isRouteItem : { type : DataTypes.BOOLEAN},
    brokerageItem : {type:DataTypes.BOOLEAN},
    openingStock : {type:DataTypes.BOOLEAN},
    primaryUnitId : {type : DataTypes.INTEGER},
    brokerageItem : {type : DataTypes.BOOLEAN},
    status: {type : DataTypes.BOOLEAN, defaultValue : true},

    cloudinaryId : {type:DataTypes.STRING},
    fileUrl : {type:DataTypes.STRING} 
},
{
    freezeTableName: true
})

module.exports = Product;