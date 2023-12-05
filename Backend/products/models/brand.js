const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Brand = sequelize.define('brand',{
    brandName : {type : DataTypes.STRING, allowNull : false},
    status: {type : DataTypes.BOOLEAN, defaultValue : true},

    cloudinary_id : {type:DataTypes.STRING},
    file_url : {type:DataTypes.STRING} 
},
{
    freezeTableName: true,
    timestamps: false
})


module.exports = Brand;


