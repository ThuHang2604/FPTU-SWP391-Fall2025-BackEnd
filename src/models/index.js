const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require("./user.model")(sequelize, Sequelize.DataTypes);
db.Member = require("./member.model")(sequelize, Sequelize.DataTypes);
db.Admin = require("./admin.model")(sequelize, Sequelize.DataTypes);
db.Category = require("./category.model")(sequelize, Sequelize.DataTypes);
db.Product = require("./product.model")(sequelize, Sequelize.DataTypes);
db.ProductMedia = require("./productMedia.model")(sequelize, Sequelize.DataTypes);
db.Payment = require("./payment.model")(sequelize, Sequelize.DataTypes);
db.PaymentHistory = require("./paymentHistory.model")(sequelize, Sequelize.DataTypes);
db.Review = require("./review.model")(sequelize, Sequelize.DataTypes);
db.Chatbox = require("./chatbox.model")(sequelize, Sequelize.DataTypes);
db.ChatMessage = require("./chatMessage.model")(sequelize, Sequelize.DataTypes);
db.Notification = require("./notification.model")(sequelize, Sequelize.DataTypes);
db.ProductApproval = require("./productApproval.model")(sequelize, Sequelize.DataTypes);

// ==================== ASSOCIATIONS ====================

// User ↔ Member / Admin
db.User.hasOne(db.Member, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Member.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasOne(db.Admin, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Admin.belongsTo(db.User, { foreignKey: "user_id" });

// Category ↔ Product
db.Category.hasMany(db.Product, { foreignKey: "category_id", onDelete: "CASCADE" });
db.Product.belongsTo(db.Category, { foreignKey: "category_id" });

// Member ↔ Product
db.Member.hasMany(db.Product, { foreignKey: "member_id", onDelete: "CASCADE" });
db.Product.belongsTo(db.Member, { foreignKey: "member_id" });

// Product ↔ ProductMedia
db.Product.hasMany(db.ProductMedia, { foreignKey: "product_id", as: "media", onDelete: "CASCADE" });
db.ProductMedia.belongsTo(db.Product, { foreignKey: "product_id", as: "product" });

// Product ↔ ProductApproval ↔ Admin
db.Product.hasMany(db.ProductApproval, { foreignKey: "product_id", onDelete: "CASCADE" });
db.ProductApproval.belongsTo(db.Product, { foreignKey: "product_id" });

db.Admin.hasMany(db.ProductApproval, { foreignKey: "admin_id", onDelete: "CASCADE" });
db.ProductApproval.belongsTo(db.Admin, { foreignKey: "admin_id" });

// Member ↔ Payment ↔ Product
db.Member.hasMany(db.Payment, { foreignKey: "member_id", onDelete: "CASCADE" });
db.Payment.belongsTo(db.Member, { foreignKey: "member_id" });

db.Product.hasMany(db.Payment, { foreignKey: "product_id", onDelete: "CASCADE" });
db.Payment.belongsTo(db.Product, { foreignKey: "product_id" });

// Payment ↔ PaymentHistory
db.Payment.hasMany(db.PaymentHistory, { foreignKey: "payment_id", onDelete: "CASCADE" });
db.PaymentHistory.belongsTo(db.Payment, { foreignKey: "payment_id" });

// Member ↔ Review ↔ Product
db.Member.hasMany(db.Review, { foreignKey: "member_id", onDelete: "CASCADE" });
db.Review.belongsTo(db.Member, { foreignKey: "member_id" });

db.Product.hasMany(db.Review, { foreignKey: "product_id", onDelete: "CASCADE" });
db.Review.belongsTo(db.Product, { foreignKey: "product_id" });

// Chatbox ↔ Messages ↔ Member
db.Member.hasMany(db.Chatbox, { foreignKey: "host_id", onDelete: "CASCADE" });
db.Chatbox.belongsTo(db.Member, { foreignKey: "host_id" });

db.Chatbox.hasMany(db.ChatMessage, { foreignKey: "chatbox_id", onDelete: "CASCADE" });
db.ChatMessage.belongsTo(db.Chatbox, { foreignKey: "chatbox_id" });

db.Member.hasMany(db.ChatMessage, { foreignKey: "sender_id", onDelete: "CASCADE" });
db.ChatMessage.belongsTo(db.Member, { foreignKey: "sender_id" });

// Member ↔ Notification
db.Member.hasMany(db.Notification, { foreignKey: "member_id", onDelete: "CASCADE" });
db.Notification.belongsTo(db.Member, { foreignKey: "member_id" });

module.exports = db;
