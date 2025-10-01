const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const productAdminRoutes = require('./routers/admin/products');
app.use('/admin', productAdminRoutes);

const productRoutes = require('./routers/products');
app.use(productRoutes);

const sequelize = require('./util/db');

const models = require('./models/index');
sequelize.models = models;

sequelize
    .sync()
    .then(() => {
        console.log('Tabelid on loodud');
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })