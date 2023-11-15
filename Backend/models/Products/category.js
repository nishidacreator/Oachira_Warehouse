const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Category = sequelize.define('category',{
    // category_image: {type : DataTypes.STRING},
    categoryName : {type: DataTypes.STRING, allowNull : false, unique : true},
    taxable : {type: DataTypes.BOOLEAN, defaultValue : false},

    cloudinary_id : {type:DataTypes.STRING},
    file_url : {type:DataTypes.STRING} 
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = Category
