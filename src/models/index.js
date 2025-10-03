const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user.model')(sequelize, Sequelize.DataTypes);
db.Member = require('./member.model')(sequelize, Sequelize.DataTypes);
db.Admin = require('./admin.model')(sequelize, Sequelize.DataTypes);
db.Category = require('./category.model')(sequelize, Sequelize.DataTypes);
db.Product = require('./product.model')(sequelize, Sequelize.DataTypes);
db.ProductMedia = require('./productMedia.model')(sequelize, Sequelize.DataTypes);
db.ProductApproval = require('./productApproval.model')(sequelize, Sequelize.DataTypes);

// Associations
db.User.hasOne(db.Member, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Member.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasOne(db.Admin, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Admin.belongsTo(db.User, { foreignKey: 'user_id' });

db.Category.hasMany(db.Product, { foreignKey: 'category_id', onDelete: 'CASCADE' });
db.Product.belongsTo(db.Category, { foreignKey: 'category_id' });

db.Member.hasMany(db.Product, { foreignKey: 'member_id', onDelete: 'CASCADE' });
db.Product.belongsTo(db.Member, { foreignKey: 'member_id' });

db.Product.hasMany(db.ProductMedia, { foreignKey: 'product_id', onDelete: 'CASCADE' });
db.ProductMedia.belongsTo(db.Product, { foreignKey: 'product_id' });

db.Product.hasMany(db.ProductApproval, { foreignKey: 'product_id', onDelete: 'CASCADE' });
db.ProductApproval.belongsTo(db.Product, { foreignKey: 'product_id' });

db.Admin.hasMany(db.ProductApproval, { foreignKey: 'admin_id', onDelete: 'CASCADE' });
db.ProductApproval.belongsTo(db.Admin, { foreignKey: 'admin_id' });

module.exports = db;
