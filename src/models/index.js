const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user.model')(sequelize, Sequelize.DataTypes);
db.Member = require('./member.model')(sequelize, Sequelize.DataTypes);
db.Admin = require('./admin.model')(sequelize, Sequelize.DataTypes);

// Associations
db.User.hasOne(db.Member, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Member.belongsTo(db.User, { foreignKey: 'user_id' });

db.User.hasOne(db.Admin, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Admin.belongsTo(db.User, { foreignKey: 'user_id' });

module.exports = db;
