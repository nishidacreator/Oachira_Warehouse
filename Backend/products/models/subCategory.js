const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const SubCategory = sequelize.define('subCategory',{
    subCategoryName: {type: DataTypes.STRING, allowNull : false, unique : true},
    categoryId: {type: DataTypes.INTEGER, allowNull : false},
    status: {type: DataTypes.BOOLEAN, defaultValue : false},
    hsnCode: {type: DataTypes.STRING, defaultValue : 'NA'},
    
    cloudinary_id : {type:DataTypes.STRING},
    file_url : {type:DataTypes.STRING} 
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = SubCategory
