module.exports = (sequelize, DataTypes) => {
  const ProductMedia = sequelize.define(
    'ProductMedia',
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
      media_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      media_type: {
        type: DataTypes.ENUM('IMAGE', 'VIDEO'),
        defaultValue: 'IMAGE',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'product_media',
      timestamps: false,
    }
  );

  return ProductMedia;
};
