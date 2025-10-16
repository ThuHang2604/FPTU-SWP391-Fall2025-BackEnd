module.exports = (sequelize, DataTypes) => {
  const PaymentHistory = sequelize.define("PaymentHistory", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    payment_id: { type: DataTypes.BIGINT, allowNull: false },
    status: { type: DataTypes.ENUM("INITIATED", "PROCESSING", "SUCCESS", "FAILED"), allowNull: false },
    note: { type: DataTypes.TEXT },
  }, { tableName: "payment_history", timestamps: true, createdAt: "created_at", updatedAt: false });
  return PaymentHistory;
};
