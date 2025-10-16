module.exports = (sequelize, DataTypes) => {
  const ProductApproval = sequelize.define("ProductApproval", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    product_id: { type: DataTypes.BIGINT, allowNull: false },
    admin_id: { type: DataTypes.BIGINT, allowNull: false },
    action: { type: DataTypes.ENUM("APPROVED", "REJECTED"), allowNull: false },
    reason: { type: DataTypes.TEXT },
  }, { tableName: "product_approvals", timestamps: true, createdAt: "created_at", updatedAt: false });
  return ProductApproval;
};
