const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const CustomerGrade = sequelize.define('customerGrade',{
    grade : {type: DataTypes.STRING, allowNull : false},
    gradeRemarks : {type: DataTypes.STRING}
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = CustomerGrade
