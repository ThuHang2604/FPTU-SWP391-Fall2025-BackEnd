module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define("Member", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    address: { type: DataTypes.STRING(255), allowNull: true },
    city: { type: DataTypes.STRING(100), allowNull: true },
    country: { type: DataTypes.STRING(100), allowNull: true, defaultValue: "Vietnam" },
    wallet_balance: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0.00 },
    status: { type: DataTypes.ENUM("ACTIVE", "SUSPENDED", "PENDING"), allowNull: false, defaultValue: "ACTIVE" },
  }, {
    tableName: "members",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  return Member;
};
