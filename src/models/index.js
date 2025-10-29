// models/index.js
const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ====== IMPORT MODELS ======
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

// ====== ASSOCIATIONS ======

// User ↔ Member
db.User.hasOne(db.Member, { foreignKey: "user_id", as: "member", onDelete: "CASCADE" });
db.Member.belongsTo(db.User, { foreignKey: "user_id", as: "user" });

// Member ↔ Payment
db.Member.hasMany(db.Payment, { foreignKey: "member_id", as: "payments", onDelete: "CASCADE" });
db.Payment.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

// Payment ↔ PaymentHistory
db.Payment.hasMany(db.PaymentHistory, { foreignKey: "payment_id", as: "history", onDelete: "CASCADE" });
db.PaymentHistory.belongsTo(db.Payment, { foreignKey: "payment_id", as: "payment" });

// Member ↔ Product
db.Member.hasMany(db.Product, { foreignKey: "member_id", as: "products", onDelete: "CASCADE" });
db.Product.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

// Category ↔ Product
db.Category.hasMany(db.Product, { foreignKey: "category_id", as: "products", onDelete: "CASCADE" });
db.Product.belongsTo(db.Category, { foreignKey: "category_id", as: "category" });

// Product ↔ ProductMedia
db.Product.hasMany(db.ProductMedia, { foreignKey: "product_id", as: "media", onDelete: "CASCADE" });
db.ProductMedia.belongsTo(db.Product, { foreignKey: "product_id", as: "product" });

// Review ↔ Member & Product
db.Member.hasMany(db.Review, { foreignKey: "member_id", as: "reviews", onDelete: "CASCADE" });
db.Product.hasMany(db.Review, { foreignKey: "product_id", as: "reviews", onDelete: "CASCADE" });
db.Review.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });
db.Review.belongsTo(db.Product, { foreignKey: "product_id", as: "product" });

// Notification
db.Member.hasMany(db.Notification, { foreignKey: "member_id", as: "notifications", onDelete: "CASCADE" });
db.Notification.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

// Chat modules
db.Member.hasMany(db.Chatbox, { foreignKey: "host_id", as: "chatboxes", onDelete: "CASCADE" });
db.Chatbox.belongsTo(db.Member, { foreignKey: "host_id", as: "host" });

db.Chatbox.hasMany(db.ChatMessage, { foreignKey: "chatbox_id", as: "messages", onDelete: "CASCADE" });
db.ChatMessage.belongsTo(db.Chatbox, { foreignKey: "chatbox_id", as: "chatbox" });

db.Member.hasMany(db.ChatMessage, { foreignKey: "sender_id", as: "sentMessages", onDelete: "CASCADE" });
db.ChatMessage.belongsTo(db.Member, { foreignKey: "sender_id", as: "sender" });

module.exports = db;
