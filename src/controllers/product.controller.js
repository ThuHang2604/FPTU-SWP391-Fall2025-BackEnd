const db = require("../models");
const { Product, ProductMedia, Member, ProductApproval } = db;
const { Op } = db.Sequelize;

// Lấy tất cả sản phẩm
exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: ProductMedia, as: "media" }],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

// Theo category
exports.getProductByCateId = async (req, res) => {
  try {
    const { cateId } = req.params;
    const products = await Product.findAll({
      where: { category_id: cateId },
      include: [{ model: ProductMedia, as: "media" }],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

// Search
exports.search = async (req, res) => {
  try {
    const { name } = req.query;
    const products = await Product.findAll({
      where: { title: { [Op.like]: `%${name}%` } },
      include: [{ model: ProductMedia, as: "media" }],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

// Chi tiết sản phẩm
exports.getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [{ model: ProductMedia, as: "media" }],
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

// Tạo sản phẩm (Member)
exports.createProduct = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const memberId = req.user.memberId; // 🧩 Sửa từ userId sang memberId

    const productData = {
      member_id: memberId,
      category_id: req.body.category_id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      location: req.body.location,
      usage_duration: req.body.usage_duration,
      warranty_info: req.body.warranty_info,
      condition_status: req.body.condition_status,
      origin: req.body.origin,
      product_type: req.body.product_type, // BATTERY / ELECTRIC_BIKE / ELECTRIC_CAR

      // battery
      battery_type: req.body.battery_type,
      battery_voltage: req.body.battery_voltage,
      battery_capacity: req.body.battery_capacity,
      battery_pack_config: req.body.battery_pack_config,
      cycle_count: req.body.cycle_count,
      efficiency_remain: req.body.efficiency_remain,
      repaired_or_modified: req.body.repaired_or_modified,
      compatible_with: req.body.compatible_with,

      // car
      brand: req.body.brand,
      model: req.body.model,
      variant: req.body.variant,
      year_of_manufacture: req.body.year_of_manufacture,
      transmission: req.body.transmission,
      color: req.body.color,
      body_type: req.body.body_type,
      seat_count: req.body.seat_count,
      mileage: req.body.mileage,
      license_plate: req.body.license_plate,
      num_of_owners: req.body.num_of_owners,
      accessories_included: req.body.accessories_included,
      registration_valid: req.body.registration_valid,

      // motorbike/bicycle
      bike_type: req.body.bike_type,
      motor_power: req.body.motor_power,
      top_speed: req.body.top_speed,
      range_per_charge: req.body.range_per_charge,
      charging_time: req.body.charging_time,
      frame_type: req.body.frame_type,
      brake_type: req.body.brake_type,
      tire_size: req.body.tire_size,
      has_battery_included: req.body.has_battery_included,

      status: "PENDING",
    };

    const product = await Product.create(productData, { transaction });

    if (Array.isArray(req.body.media)) {
      const mediaList = req.body.media.map((m) => ({
        product_id: product.id,
        media_url: m.media_url,
        media_type: m.media_type || "IMAGE",
      }));
      await ProductMedia.bulkCreate(mediaList, { transaction });
    }

    await transaction.commit();

    const full = await Product.findByPk(product.id, {
      include: [{ model: ProductMedia, as: "media" }],
    });

    res.status(201).json(full);
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error", err });
  }
};

// Cập nhật thông tin
exports.updateProductInfo = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product || product.member_id !== req.user.memberId)
      return res.status(403).json({ message: "Not authorized" });

    Object.assign(product, req.body, { status: "PENDING" });
    await product.save({ transaction });

    if (Array.isArray(req.body.media)) {
      await ProductMedia.destroy({ where: { product_id: id }, transaction });
      const newMedia = req.body.media.map((m) => ({
        product_id: id,
        media_url: m.media_url,
        media_type: m.media_type || "IMAGE",
      }));
      await ProductMedia.bulkCreate(newMedia, { transaction });
    }

    await transaction.commit();
    const updated = await Product.findByPk(id, {
      include: [{ model: ProductMedia, as: "media" }],
    });

    res.json(updated);
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error", err });
  }
};

// Cập nhật trạng thái bán (Member)
exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["SOLD", "INACTIVE"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const product = await Product.findByPk(id);
    if (!product || product.member_id !== req.user.memberId)
      return res.status(403).json({ message: "Not authorized" });

    product.status = status;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

// Admin duyệt bài
exports.updateModerateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.status = status;
    await product.save();

    await ProductApproval.create({
      product_id: id,
      admin_id: req.user.userId, // userId = admins.user_id
      action: status,
      reason,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};
