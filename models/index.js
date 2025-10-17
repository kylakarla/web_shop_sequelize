const path = require('path');
const fs = require('fs');
const sequelize = require('../util/db');
const models = {};

module.exports = (() => {
    if (!Object.keys(models).length) {
        const files = fs.readdirSync(__dirname);
        const excludedFiles = ['.', '..', 'index.js'];

        for (const fileName of files) {
            if (!excludedFiles.includes(fileName) && (path.extname(fileName) === '.js')) {
                const modelFile = require(path.join(__dirname, fileName));
                models[modelFile.getTableName()] = modelFile;
            }
        }

        Object
            .values(models)
            .forEach(model => {
                if (typeof model.associate === 'function') {
                    model.associate(models);
                }
            });

        models.sequelize = sequelize;
    }

    models.User = require('./user');
    models.Product = require('./product');
    models.Cart = require('./cart');
    models.CartItem = require('./cart-item');
    models.Order = require('./order-items.js');
    models.OrderItem = require('./order-items');

    models.User.hasMany(models.Product)
    models.User.hasOne(models.Cart);
    models.User.hasMany(models.Order);
    models.Product.belongsTo(models.User, {constraints: true, onDelete: 'CASCADE'})
    models.Product.belongsToMany(models.Cart, {through: models.CartItem});
    models.Product.belongsToMany(models.Order, {through: models.OrderItem});
    models.Cart.belongsTo(models.User);
    models.Cart.belongsToMany(models.Product, {through: models.CartItem});

    return models;
})();