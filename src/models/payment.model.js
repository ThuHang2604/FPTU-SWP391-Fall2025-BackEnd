module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define("Payment", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    member_id: { type: DataTypes.BIGINT, allowNull: false },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    transaction_type: {
      type: DataTypes.ENUM("TOP_UP", "POST_FEE", "REFUND"),
      allowNull: false,
    },
    payment_method: { type: DataTypes.STRING(50), defaultValue: "PAYPAL" },
    payment_status: {
      type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"),
      defaultValue: "PENDING",
    },
    paypal_transaction_id: { type: DataTypes.STRING(100) },
  }, {
    tableName: "payments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  });
  return Payment;
};
