const sequelize = require('./db');
const bcrypt = require('bcrypt');
const { JSON } = require('sequelize');


const Role = require('../users/models/role');
const User = require('../users/models/user');

const Category = require('../products/models/category');
const Product = require('../products/models/product');
const PrimaryUnit = require('../products/models/primayUnit');
const SecondaryUnit = require('../products/models/secondaryUnit');
const Brand = require('../products/models/brand');
const SubCategory = require('../products/models/subCategory');
const Gst = require('../products/models/gst');
const Location = require('../products/models/location');
const Hsn = require('../products/models/hsn');
const Distributor = require('../products/models/distributor');
const ProductDistributor = require('../products/models/productDistributor');
const Store = require('../store/models/store');
const Request = require('../purchases/models/request');
const RequestDetails = require('../purchases/models/requestDetails');
const Order = require('../purchases/models/order');
const OrderDetails = require('../purchases/models/orderDetails');
const Coolie = require('../purchases/models/coolie');
const Entry = require('../purchases/models/entry');
const EntryDetails = require('../purchases/models/entryDetails');

const Customer = require('../sales/models/customer');
const CustomerCategory = require('../sales/models/customerCategory');
const CustomerGrade = require('../sales/models/customerGrade');
const LoyaltyPoint = require('../sales/models/loyaltyPoint');
const RouteSO = require('../sales/models/routeSO');
const RouteSODetails = require('../sales/models/routeSODetails');
const RouteSE = require('../sales/models/routeSE');
const RouteSEDetails = require('../sales/models/routeSEDetails');

// const RouteSO = require('../sales/models/routeSO');
// const RouteSODetails = require('../sales/models/routeSODetails');
// const RouteSE = require('../sales/models/routeSE');
// const RouteSEDetails = require('../sales/models/routeSEDetails');

const Warehouse = require('../store/models/warehouse');
const CustomerPhone = require('../sales/models/customerPhone');
const VehicleType = require('../sales/models/vehicleType');
const Vehicle = require('../sales/models/vehicle');
const Route = require('../sales/models/route');
const RouteDay = require('../sales/models/routeDays');
const RouteDetails = require('../sales/models/routeDetails');
const Trip = require('../sales/models/trip');
const TripDay = require('../sales/models/tripDays');
const TripDetails = require('../sales/models/tripDetails');
const Slip = require('../purchases/models/slip');

// // BULK CREATE
const userData = require('./dataSource/user.json');
const brandData = require('./dataSource/products/brandFirst.json');
const categoryData = require('./dataSource/products/categoryFirst.json');
const subCategoryData = require('./dataSource/products/subCategory.json');
const hsnData = require('./dataSource/products/hsn.json');
const gstData = require('./dataSource/products/gst.json');
const locationData = require('./dataSource/products/location.json');
const productData = require('./dataSource/products/productsOachiraFirst.json');
const customerCategoryData = require('./dataSource/routeSale/customerCategory.json');
const customerGradeData = require('./dataSource/routeSale/customerGrade.json');
const vehicleTypeData = require('./dataSource/vehicleType.json');
const vehilceData = require('./dataSource/vehicle.json');
const Bank = require('../company/bank');
const Company = require('../company/company');
const Team=require('../company/team');
const TeamMember = require("../company/teamMember");




async function syncModel(){

    //USER
    Role.hasMany(User,{foreignKey : 'roleId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    User.belongsTo(Role)

    //PRODUCT
    
    PrimaryUnit.hasMany(SecondaryUnit,{foreignKey : 'primaryUnitId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    SecondaryUnit.belongsTo(PrimaryUnit)

    Category.hasMany(SubCategory,{foreignKey : 'categoryId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    SubCategory.belongsTo(Category)
    
    Category.hasMany(Product,{foreignKey : 'categoryId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Product.belongsTo(Category)

    SubCategory.hasMany(Product,{foreignKey : 'subCategoryId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Product.belongsTo(SubCategory)
    
    Brand.hasMany(Product,{foreignKey : 'brandId', onDelete : 'CASCADE', onUpdate : 'CASCADE'}) 
    Product.belongsTo(Brand)
    
    Location.hasMany(Product,{foreignKey : 'locationId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Product.belongsTo(Location)

    Gst.hasMany(Product,{foreignKey : 'gstId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Product.belongsTo(Gst)

    Hsn.hasMany(Product,{foreignKey : 'hsnId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Product.belongsTo(Hsn)

    PrimaryUnit.hasMany(Product,{foreignKey : 'baseUnitId', as: 'baseUnit',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Product.belongsTo(PrimaryUnit, {foreignKey : 'baseUnitId', as: 'baseUnit'})

    Product.hasMany(ProductDistributor,{foreignKey : 'productId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    ProductDistributor.belongsTo(Product)

    Distributor.hasMany(ProductDistributor,{foreignKey : 'distributorId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    ProductDistributor.belongsTo(Distributor)

    // STORE
    User.hasMany(Company,{foreignKey : 'companyInChargeId', as: 'companyInCharge',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Company.belongsTo(User, {foreignKey : 'companyInChargeId', as: 'companyInCharge'})

    // Store.hasMany(Warehouse,{foreignKey : 'warehouseId',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // Warehouse.belongsTo(Store, {foreignKey : 'warehouseId'})

    Warehouse.hasMany(User,{foreignKey : 'warehouseInChargeId', as: 'warehouseInCharge',  onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    User.belongsTo(Warehouse, {foreignKey : 'warehouseInChargeId', as: 'warehouseInCharge'})
   
    // PURCHASES
    Company.hasMany(Request, {foreignKey : 'companyId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Request.belongsTo(Company)

    User.hasMany(Request, {foreignKey : 'userId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Request.belongsTo(User)

    Request.hasMany(RequestDetails, {foreignKey : 'requestId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RequestDetails.belongsTo(Request)

    Product.hasMany(RequestDetails, {foreignKey : 'productId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RequestDetails.belongsTo(Product)

    SecondaryUnit.hasMany(RequestDetails, {foreignKey : 'secondaryUnitId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RequestDetails.belongsTo(SecondaryUnit)

    Distributor.hasMany(Order, {foreignKey : 'distributorId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Order.belongsTo(Distributor)

    User.hasMany(Order, {foreignKey : 'userId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Order.belongsTo(User)

    Order.hasMany(OrderDetails, {foreignKey : 'orderId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    OrderDetails.belongsTo(Order)

    Entry.hasMany(EntryDetails, {foreignKey : 'entryId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    EntryDetails.belongsTo(Entry)

    Product.hasMany(OrderDetails, {foreignKey : 'productId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    OrderDetails.belongsTo(Product)

    PrimaryUnit.hasMany(OrderDetails, {foreignKey : 'primaryUnitId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    OrderDetails.belongsTo(PrimaryUnit)

    SecondaryUnit.hasMany(Coolie, {foreignKey : 'secondaryUnitId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Coolie.belongsTo(SecondaryUnit)

    Distributor.hasMany(Slip, {foreignKey : 'distributorId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Slip.belongsTo(Distributor, {foreignKey : 'distributorId'})

    Entry.hasMany(Slip, {foreignKey : 'entryId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Slip.belongsTo(Entry, {foreignKey : 'entryId'})

    Distributor.hasMany(Entry, {foreignKey : 'distributorId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Entry.belongsTo(Distributor, {foreignKey : 'distributorId'})

    Order.hasMany(Entry, {foreignKey : 'orderId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Entry.belongsTo(Order, {foreignKey : 'orderId'})

    // Distributor.hasMany(Order, {foreignKey : 'distributorId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // Order.belongsTo(Store)

    // User.hasMany(Order, {foreignKey : 'userId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // Order.belongsTo(User)

    // Order.hasMany(OrderDetails, {foreignKey : 'orderId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // OrderDetails.belongsTo(Order)

    // Product.hasMany(OrderDetails, {foreignKey : 'productId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // OrderDetails.belongsTo(Product)

    // PrimaryUnit.hasMany(OrderDetails, {foreignKey : 'primaryUnitId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // OrderDetails.belongsTo(PrimaryUnit)

    //ROUTE SALE 
    Bank.hasMany(Company, {foreignKey : 'companyId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Company.belongsTo(Bank)


    Customer.hasMany(LoyaltyPoint, {foreignKey : 'customerId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    LoyaltyPoint.belongsTo(Customer)

    CustomerCategory.hasMany(Customer, {foreignKey : 'customerCategoryId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Customer.belongsTo(CustomerCategory)

    CustomerGrade.hasMany(Customer, {foreignKey : 'customerGradeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Customer.belongsTo(CustomerGrade)

    Customer.hasMany(CustomerPhone, {foreignKey : 'customerId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    CustomerPhone.belongsTo(Customer)

    VehicleType.hasMany(Vehicle, {foreignKey : 'vehicleTypeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Vehicle.belongsTo(VehicleType)

    Vehicle.hasMany(Route, {foreignKey : 'vehicleId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Route.belongsTo(Vehicle)

    User.hasMany(Route, {foreignKey : 'driverId', as: 'driver', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Route.belongsTo(User, {foreignKey : 'driverId', as: 'driver'})

    User.hasMany(Route, {foreignKey : 'salesExecutiveId', as: 'salesExecutive', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Route.belongsTo(User, {foreignKey : 'salesExecutiveId', as: 'salesExecutive'})

    User.hasMany(Route, {foreignKey : 'salesManId', as: 'salesMan', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Route.belongsTo(User, {foreignKey : 'salesManId', as: 'salesMan'})

    Route.hasMany(RouteDay, {foreignKey : 'routeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RouteDay.belongsTo(Route)

    Route.hasMany(RouteDetails, {foreignKey : 'routeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RouteDetails.belongsTo(Route)

    Customer.hasMany(RouteDetails, {foreignKey : 'customerId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RouteDetails.belongsTo(Customer)

    Route.hasMany(Trip, {foreignKey : 'routeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    Trip.belongsTo(Route)

    Trip.hasMany(TripDetails, {foreignKey : 'tripId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    TripDetails.belongsTo(Trip)

    Customer.hasMany(TripDetails, {foreignKey : 'customerId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    TripDetails.belongsTo(Customer)

    Route.hasMany(TripDay, {foreignKey : 'routeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    TripDay.belongsTo(Route)

    User.hasMany(RouteSO, {foreignKey : 'salesExecutiveId', as: 'pickSalesExecutive', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RouteSO.belongsTo(User, {foreignKey : 'salesExecutiveId', as: 'pickSalesExecutive'})

    Route.hasMany(RouteSO, {foreignKey : 'routeId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RouteSO.belongsTo(Route, {foreignKey : 'routeId'})

    Customer.hasMany(RouteSO, {foreignKey : 'customerId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RouteSO.belongsTo(Customer, {foreignKey : 'customerId'})

    RouteSO.hasMany(RouteSODetails, {foreignKey : 'routeSOId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RouteSODetails.belongsTo(RouteSO, {foreignKey : 'routeSOId'})

    Product.hasMany(RouteSODetails, {foreignKey : 'productId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RouteSODetails.belongsTo(Product, {foreignKey : 'productId'})

    SecondaryUnit.hasMany(RouteSODetails, {foreignKey : 'secondaryUnitId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RouteSODetails.belongsTo(SecondaryUnit, {foreignKey : 'secondaryUnitId'})

    RouteSO.hasMany(RouteSE, {foreignKey : 'routeSOId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RouteSE.belongsTo(RouteSO, {foreignKey : 'routeSOId'})

    RouteSE.hasMany(RouteSEDetails, {foreignKey : 'routeSEId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RouteSEDetails.belongsTo(RouteSE, {foreignKey : 'routeSEId'})

    User.hasMany(RouteSE, {foreignKey : 'userId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RouteSE.belongsTo(User, {foreignKey : 'userId'})

    Product.hasMany(RouteSEDetails, {foreignKey : 'productId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RouteSEDetails.belongsTo(Product, {foreignKey : 'productId'})

    SecondaryUnit.hasMany(RouteSEDetails, {foreignKey : 'secondaryUnitId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    RouteSEDetails.belongsTo(SecondaryUnit, {foreignKey : 'secondaryUnitId'})


    // Hsn.hasMany(RouteSEDetails, {foreignKey : 'hsnId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // RouteSEDetails.belongsTo(Hsn, {foreignKey : 'hsnId'})

    // Gst.hasMany(RouteSEDetails, {foreignKey : 'hsnId', onDelete : 'CASCADE', onUpdate : 'CASCADE'})
    // RouteSEDetails.belongsTo(Gst, {foreignKey : 'hsnId'})
    
    Team.belongsTo(User, {
        foreignKey: "userId",
        as: "leader",
      });

    Team.hasMany(TeamMember, { foreignKey: "teamId" });
    TeamMember.belongsTo(Team);
  
    Team.hasMany(Company, { foreignKey: "teamId" });
    Company.belongsTo(Team);

    
  User.hasMany(TeamMember, { foreignKey: "userId", as: "register"});
  TeamMember.belongsTo(User, { foreignKey: "userId", as: "register"});

    await sequelize.sync({alter: true})

    const role = await Role.findAll({})
    if(role.length === 0){
        Role.bulkCreate([
            {roleName : 'Admin', status: true},
            {roleName : 'Counter', status: true},
            {roleName : 'Salesman', status: true},
            {roleName : 'Driver', status: true},
            {roleName : 'SalesExecutive', status: true},
            {roleName : 'BranchManager', status: true},
            {roleName : 'Supervisor', status: true},
        ])
    }

    const user = await User.findAll({})
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt)
    if(user.length === 0){
        for(let i = 0; i < userData.length; i++){
            const name = userData[i].phoneNumber;
            userData[i].password = hashedPassword
            userData[i].userName = name
            
            User.bulkCreate([userData[i]])
        }
    }

    const pUnit = await PrimaryUnit.findAll({})
    if(pUnit.length === 0){
        PrimaryUnit.bulkCreate([
            {primaryUnitName : 'Nos', factor : 1},
            {primaryUnitName : 'KG', factor : 1},
            {primaryUnitName : 'Litre', factor : 1},
            {primaryUnitName : 'Meter', factor : 1},
            {primaryUnitName : 'Gram', factor : 1},
        ])
    }
 
    const brand = await Brand.findAll({})
    if(brand.length == 0){
        for(let i = 0; i < brandData.length; i++){
            Brand.bulkCreate([brandData[i]])
        }
    }

    const category = await Category.findAll({})
    if(category.length == 0) {
        for(let i = 0; i < categoryData.length; i++){
            Category.bulkCreate([categoryData[i]])
        }
    }

    const subCategory = await SubCategory.findAll({})
    if(subCategory.length == 0) {
        for(let i = 0; i < subCategoryData.length; i++){
            SubCategory.bulkCreate([subCategoryData[i]])
        }
    }

    const gst = await Gst.findAll({})
    if(gst.length == 0){
        for(let i = 0; i < gstData.length; i++){
            Gst.bulkCreate([gstData[i]])
        }
    }

    const hsn = await Hsn.findAll({})
    if(hsn.length == 0){
        for(let i = 0; i < hsnData.length; i++){
            Hsn.bulkCreate([hsnData[i]])
        }
    }

    const location = await Location.findAll({})
    if(location.length == 0){
        for(let i = 0; i < locationData.length; i++){
            Location.bulkCreate([locationData[i]])
        }
    }

    const product = await Product.findAll({})
    if (product.length === 0) {
        for(let i = 0; i < productData.length; i++){
            Product.bulkCreate([productData[i]])
        }
    }

    const customerCategory = await CustomerCategory.findAll({})
    if(customerCategory.length === 0){
        for(let i = 0; i < customerCategoryData.length; i++){
            CustomerCategory.bulkCreate([customerCategoryData[i]])
        }
    }

    const customerGarde = await CustomerGrade.findAll({})
    if(customerGarde.length === 0){
        for(let i = 0; i < customerGradeData.length; i++){
            CustomerGrade.bulkCreate([customerGradeData[i]])
        }
    }
    

    const vehicleType = await VehicleType.findAll({})
    if(vehicleType.length === 0){
        for(let i = 0; i < vehicleTypeData.length; i++){
            VehicleType.bulkCreate([vehicleTypeData[i]])
        }
    }

    const vehicle = await Vehicle.findAll({})
    if(vehicle.length === 0){
        for(let i = 0; i < vehilceData.length; i++){
            Vehicle.bulkCreate([vehilceData[i]])
        }
    }

    // const bankAccount = await BankAccount.findAll({})
    // if(bankAccount.length === 0){
    //     for(let i = 0; i < bankAccountData.length; i++){
    //         BankAccount.bulkCreate([bankAccountData[i]])
    //     }
    // }
}



module.exports = syncModel