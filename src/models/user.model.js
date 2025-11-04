module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    full_name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    google_id: { type: DataTypes.STRING(255), unique: true, allowNull: true },
    password: { type: DataTypes.STRING(255), allowNull: true }, // có thể null nếu login Google
    phone: { type: DataTypes.STRING(20), unique: true },
    avatar: { type: DataTypes.STRING(255) },
    role: { type: DataTypes.ENUM("MEMBER", "ADMIN"), defaultValue: "MEMBER" },
    login_provider: { type: DataTypes.ENUM("LOCAL", "GOOGLE"), defaultValue: "LOCAL" },
    status: { type: DataTypes.ENUM("ACTIVE", "INACTIVE"), defaultValue: "ACTIVE" },
  }, {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  return User;
};
