module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define("Review", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    member_id: { type: DataTypes.BIGINT, allowNull: false },
    product_id: { type: DataTypes.BIGINT, allowNull: false },
    rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.TEXT },
  }, {
    tableName: "reviews",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  });
  return Review;
};
