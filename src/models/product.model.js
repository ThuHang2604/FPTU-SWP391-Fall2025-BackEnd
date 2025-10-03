module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      member_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      usage_duration: {
        type: DataTypes.STRING(100),
      },
      warranty_info: {
        type: DataTypes.STRING(255),
      },
      location: {
        type: DataTypes.STRING(255),
      },
      brand: {
        type: DataTypes.STRING(100),
      },
      model: {
        type: DataTypes.STRING(100),
      },
      year: {
        type: DataTypes.INTEGER,
      },
      mileage: {
        type: DataTypes.INTEGER,
      },
      battery_type: {
        type: DataTypes.STRING(100),
      },
      capacity: {
        type: DataTypes.STRING(100),
      },
      cycle_count: {
        type: DataTypes.INTEGER,
      },
      compatible_with: {
        type: DataTypes.STRING(255),
      },
      status: {
        type: DataTypes.ENUM(
          'PENDING', // Tin vừa được đăng, chờ duyệt
          'APPROVED', // Tin đã được duyệt và hiển thị công khai
          'REJECTED', // Tin bị từ chối duyệt
          'SOLD',   // Tin đã bán và không còn hiển thị
          'INACTIVE' // Tin không còn hoạt động (có thể do người dùng ẩn hoặc hết hạn)
        ),
        defaultValue: 'PENDING',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'products',
      timestamps: false,
    }
  );

  return Product;
};

