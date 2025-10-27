module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define("Payment", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    member_id: { type: DataTypes.BIGINT, allowNull: false },
    product_id: { type: DataTypes.BIGINT, allowNull: true }, // optional FK
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    payment_method: { type: DataTypes.STRING(50) },
    payment_status: {
      type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"),
      defaultValue: "PENDING",
    },
    paypal_order_id: { type: DataTypes.STRING(255) }, // đồng bộ với DB
  }, {
    tableName: "payments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false, // nếu muốn dùng updated_at thì đổi thành "updated_at"
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Member, { foreignKey: "member_id", as: "member" });
    Payment.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
    Payment.hasMany(models.PaymentHistory, { foreignKey: "payment_id", as: "history" });
  };

  return Payment;
};
