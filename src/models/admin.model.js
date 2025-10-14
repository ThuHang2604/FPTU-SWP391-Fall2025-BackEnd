module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define("Admin", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
  }, { tableName: "admins", timestamps: true, createdAt: "created_at", updatedAt: false });
  return Admin;
};
