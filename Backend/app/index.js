
const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const syncModel = require('../utils/association');

const app = express();

app.use(cors({orgin:'*'}))

app.use(express.json());

syncModel()

const auth = require('../users/routers/auth');
const user = require('../users/routers/user');
const role = require('../users/routers/role');

app.use('/login', auth);
app.use('/register', user);
app.use('/role', role);

const product = require('../products/routers/product');
const category = require('../products/routers/category');
const brand = require('../products/routers/brand');
const hsn = require('../products/routers/hsn');
const location = require('../products/routers/location');
const primaryUnit = require('../products/routers/primaryUnit');
const secondaryUnit = require('../products/routers/secondaryUnit');
const subCategory = require('../products/routers/subCategory');
const gst = require('../products/routers/gst');
const distributor = require('../products/routers/distributor');
const productDistributor = require('../products/routers/productDistributor');


app.use('/product', product);
app.use('/product/category',category);
app.use('/product/brand',brand);
app.use('/product/hsn',hsn);
app.use('/product/location',location);
app.use('/product/primaryunit',primaryUnit);
app.use('/product/secondaryunit',secondaryUnit);
app.use('/product/subcategory',subCategory);
app.use('/product/gst',gst);
app.use('/product/distributor',distributor);
app.use('/product/productdistributor',productDistributor);

const company = require('../company/companyRouter');
const warehouse = require('../store/routers/warehouse');
// app.use('/store', store);
// app.use('/store/warehouse', warehouse);

app.use('/company',company);

const request = require('../purchases/rouers/request');
const order = require('../purchases/rouers/order');
const entry = require('../purchases/rouers/entry');
const entryDetails = require('../purchases/rouers/entryDetails')
// const requestDetails = require('../purchases/rouers/');
const orderDetails = require('../purchases/rouers/orderDetails');
const coolie = require('../purchases/rouers/coolie');
const slip = require('../purchases/rouers/slip')
const transporter = require('../purchases/rouers/transporter');
const purchaseTransporter = require('../purchases/rouers/purchaseTransporter');
const broker = require('../purchases/rouers/brocker');
const brokerAccount = require('../purchases/rouers/brockerAccount');
const loading = require('../purchases/rouers/loading');
const purchaseLoading = require('../purchases/rouers/purchaseLoading');
const entryCheque = require('../purchases/rouers/entryCheque');


app.use('/purchases/request',request);
app.use('/purchases/order',order);
app.use('/purchases/entry', entry)
// app.use('/purchases/requestdetails',requestDetails);
app.use('/purchases/orderdetails',orderDetails);
app.use('/purchases/pentrydetails',entryDetails);
app.use('/purchases/coolie',coolie);
app.use('/purchases/slip',slip)
app.use('/purchases/transporter',transporter)
app.use('/purchases/purchasetransporter',purchaseTransporter)
app.use('/purchases/broker',broker)
app.use('/purchases/brokeraccount',brokerAccount)
app.use('/purchases/loadingteam',loading)
app.use('/purchases/purchaseloading',purchaseLoading)
app.use('/purchases/entrycheque', entryCheque)


const customer = require('../sales/routers/customer');
const customerCategory = require('../sales/routers/customerCategory');
const customerGrade = require('../sales/routers/customerGrade');
const loyaltyPoint = require('../sales/routers/loyaltyPoint');
const vehicleType = require('../sales/routers/vehicleType');
const vehicle = require('../sales/routers/vehicle');
const route = require('../sales/routers/route');
const routeDay = require('../sales/routers/routeDays');
const routeDetails = require('../sales/routers/routeDetails');;
const trip = require('../sales/routers/trip');
const tripDays = require('../sales/routers/tripDays');
const tripDetails = require('../sales/routers/tripDetails');
const routeSO = require('../sales/routers/routeSO');
const routeSODetails = require('../sales/routers/routeSODetails');
const routeSE = require('../sales/routers/routeSE');
const cl = require('../sales/routers/customerLedger');

const dailyCollection = require('../sales/routers/dailyCollection')
app.use('/sales/customer',customer);
app.use('/sales/loyaltypoint',loyaltyPoint);
app.use('/sales/customercategory',customerCategory);
app.use('/sales/customergrade',customerGrade);
app.use('/sales/ledger',cl);

app.use('/sales/vehicletype',vehicleType);
app.use('/sales/vehicle',vehicle);
app.use('/sales/route',route);
app.use('/sales/routedays',routeDay);
app.use('/sales/routedetails',routeDetails);
app.use('/sales/trip',trip);
app.use('/sales/tripdays', tripDays);
app.use('/sales/tripdetails',tripDetails);
app.use('/sales/routeorder', routeSO);
app.use('/sales/routeorderdetails', routeSODetails);
app.use('/sales/routeentry', routeSE);
app.use('/sales/dailyCollection',dailyCollection)


const bank = require('../company/bankRouter');
app.use('/company/bank', bank)

const team = require('../company/teamRouter');
app.use('/team', team)

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`server started on port ${port}`);
})
