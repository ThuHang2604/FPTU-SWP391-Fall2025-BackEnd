module.exports = (sequelize, DataTypes) => {
  const ProductApproval = sequelize.define(
    'ProductApproval',
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      admin_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      action: {
        type: DataTypes.ENUM('APPROVED', 'REJECTED'),
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'product_approvals',
      timestamps: false,
    }
  );

  return ProductApproval;
};
