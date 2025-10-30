module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },

      member_id: { type: DataTypes.BIGINT, allowNull: false },
      buyer_id: { type: DataTypes.BIGINT, allowNull: true },
      category_id: { type: DataTypes.BIGINT, allowNull: false },

      title: { type: DataTypes.STRING(200), allowNull: false },
      description: { type: DataTypes.TEXT },
      price: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      location: { type: DataTypes.STRING(255) },

      usage_duration: { type: DataTypes.STRING(100) },
      warranty_info: { type: DataTypes.STRING(255) },
      condition_status: { type: DataTypes.STRING(255) },
      origin: { type: DataTypes.STRING(255) },

      product_type: {
        type: DataTypes.ENUM("BATTERY", "ELECTRIC_BIKE", "ELECTRIC_CAR"),
        allowNull: false,
      },

      // Battery info
      battery_type: { type: DataTypes.STRING(100) },
      battery_voltage: { type: DataTypes.STRING(50) },
      battery_capacity: { type: DataTypes.STRING(50) },
      battery_pack_config: { type: DataTypes.STRING(50) },
      cycle_count: { type: DataTypes.INTEGER },
      efficiency_remain: { type: DataTypes.STRING(50) },
      repaired_or_modified: { type: DataTypes.BOOLEAN, defaultValue: false },
      compatible_with: { type: DataTypes.STRING(255) },

      // Car info
      brand: { type: DataTypes.STRING(100) },
      model: { type: DataTypes.STRING(100) },
      variant: { type: DataTypes.STRING(100) },
      year_of_manufacture: { type: DataTypes.INTEGER },
      transmission: { type: DataTypes.STRING(50) },
      color: { type: DataTypes.STRING(50) },
      body_type: { type: DataTypes.STRING(100) },
      seat_count: { type: DataTypes.INTEGER },
      mileage: { type: DataTypes.INTEGER },
      license_plate: { type: DataTypes.STRING(50) },
      num_of_owners: { type: DataTypes.INTEGER },
      accessories_included: { type: DataTypes.BOOLEAN, defaultValue: false },
      registration_valid: { type: DataTypes.BOOLEAN, defaultValue: false },

      // Bike info
      bike_type: {
        type: DataTypes.ENUM("ELECTRIC_MOTORBIKE", "ELECTRIC_BICYCLE"),
      },
      motor_power: { type: DataTypes.STRING(50) },
      top_speed: { type: DataTypes.STRING(50) },
      range_per_charge: { type: DataTypes.STRING(50) },
      charging_time: { type: DataTypes.STRING(50) },
      frame_type: { type: DataTypes.STRING(100) },
      brake_type: { type: DataTypes.STRING(100) },
      tire_size: { type: DataTypes.STRING(50) },
      has_battery_included: { type: DataTypes.BOOLEAN, defaultValue: true },

      status: {
        type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED", "SOLD", "INACTIVE"),
        defaultValue: "PENDING",
      },

      // NEW: đánh dấu bài đăng đã thanh toán phí đăng tin/chọn gói, v.v.
      is_paid: {
type: DataTypes.BOOLEAN,     // maps to TINYINT(1) in MySQL
        allowNull: false,
        defaultValue: false,
        // comment: 'Đã thanh toán' // nếu bạn dùng migrations, thêm comment ở migration
      },
    },
    {
      tableName: "products",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Product;
};