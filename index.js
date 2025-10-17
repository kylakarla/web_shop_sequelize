const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const sequelize = require('./util/db');

const models = require('./models/index');
sequelize.models = models;

app.use((req, res, next) => {
    models.User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
    })
        .catch(err => {
            console.log(err);
        })
})

const productAdminRoutes = require('./routers/admin/products');
app.use('/admin', productAdminRoutes);

const productRoutes = require('./routers/products');
app.use(productRoutes);

const shopRoutes = require('./routers/shop');
app.use(shopRoutes);

const orderRoutes = require('./routers/order');
app.use(orderRoutes);

sequelize
    .sync()
    .then(() => {
        return models.User.findByPk(1)
    })
    .then(user => {
        if (!user) {
            return models.User.create({
                name: 'user',
                email: 'user@local.com'
            })
        }
        return user;
    })
    .then((user) => {
        return user.createCart()
    })
    .then((cart) => {
        console.log(cart);
        app.listen(3002);
    })
    .catch(err => {
        console.log(err);
    })