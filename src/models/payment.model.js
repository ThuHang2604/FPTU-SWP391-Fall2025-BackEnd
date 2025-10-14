module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define("Payment", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    member_id: { type: DataTypes.BIGINT, allowNull: false },
    product_id: { type: DataTypes.BIGINT, allowNull: false },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    payment_method: { type: DataTypes.STRING(50) },
    payment_status: { type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"), defaultValue: "PENDING" },
  }, { tableName: "payments", timestamps: true, createdAt: "created_at", updatedAt: false });
  return Payment;
};
