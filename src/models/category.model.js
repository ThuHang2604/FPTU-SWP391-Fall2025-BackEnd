module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
  }, { tableName: "categories", timestamps: true, createdAt: "created_at", updatedAt: "updated_at" });
  return Category;
};
