module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    full_name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(20), unique: true },
    avatar: { type: DataTypes.STRING(255) },
    role: { type: DataTypes.ENUM("MEMBER", "ADMIN"), defaultValue: "MEMBER" },
    status: { type: DataTypes.ENUM("ACTIVE", "INACTIVE"), defaultValue: "ACTIVE" },
  }, { tableName: "users", timestamps: true, createdAt: "created_at", updatedAt: "updated_at" });
  return User;
};
