const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Category = sequelize.define('category',{
    categoryName: {type: DataTypes.STRING, allowNull : false, unique : true},
    taxable: {type: DataTypes.BOOLEAN, defaultValue : false},
    status: {type: DataTypes.BOOLEAN, defaultValue : true},
    hsnCode: {type: DataTypes.STRING, defaultValue: 'NA'},
    
    cloudinaryId : {type:DataTypes.STRING},
    fileUrl : {type:DataTypes.STRING} 
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = Category
