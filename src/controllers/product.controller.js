const db = require("../models");
const {
  Product,
  ProductMedia,
  Member,
  ProductApproval,
  Admin,
  Category,
  Sequelize,
} = db;
const { Op } = Sequelize;

// ========================
// Lấy tất cả sản phẩm
// ========================
exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: { include: ["is_paid"] },
      include: [
        { model: ProductMedia, as: "media" },
        { model: Category, as: "category" },
        { model: Member, as: "member" },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json(products);
  } catch (err) {
    console.error("getAllProduct error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ========================
// Lấy sản phẩm theo Category ID
// ========================
exports.getProductByCateId = async (req, res) => {
  try {
    const { cateId } = req.params;
    const products = await Product.findAll({
      where: { category_id: cateId },
      attributes: { include: ["is_paid"] },
      include: [
        { model: ProductMedia, as: "media" },
        { model: Category, as: "category" },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json(products);
  } catch (err) {
    console.error("getProductByCateId error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ========================
// Tìm kiếm sản phẩm theo tên
// ========================
exports.search = async (req, res) => {
  try {
    const { name } = req.query;
    const products = await Product.findAll({
      where: {
        title: { [Op.like]: `%${name || ""}%` },
        status: "APPROVED", // chỉ tìm sản phẩm đã duyệt
      },
      attributes: { include: ["is_paid"] },
      include: [{ model: ProductMedia, as: "media" }],
      order: [["created_at", "DESC"]],
    });
    res.json(products);
  } catch (err) {
    console.error("search error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ========================
// Chi tiết sản phẩm
// ========================
exports.getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      attributes: { include: ["is_paid"] },
      include: [
        { model: ProductMedia, as: "media" },
        { model: Category, as: "category" },
        { 
          model: Member, 
          as: "member",
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["id", "full_name", "avatar", "phone", "email"]
            }
          ]
        },
      ],
    });

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("getProductDetail error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ========================
// Thành viên tạo sản phẩm
// ========================
exports.createProduct = async (req, res) => {
const transaction = await db.sequelize.transaction();
  try {
    const memberId = req.user.memberId;
    if (!memberId) {
      return res.status(400).json({ message: "Không tìm thấy memberId trong token." });
    }

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
      product_type: req.body.product_type,

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
      // is_paid: false, // không cần set vì DB đã default 0/false
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
      attributes: { include: ["is_paid"] },
      include: [{ model: ProductMedia, as: "media" }],
    });

    res.status(201).json(full);
  } catch (err) {
    await transaction.rollback();
    console.error("createProduct error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
// ========================
// Cập nhật sản phẩm (Member)
// ========================
exports.updateProductInfo = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product || product.member_id !== req.user.memberId) {
      return res.status(403).json({ message: "Không có quyền chỉnh sửa sản phẩm này." });
    }

    // Chặn user tự ý chỉnh is_paid nếu muốn (optional):
    // const { is_paid, ...payload } = req.body;
    // Object.assign(product, payload, { status: "PENDING" });

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
      attributes: { include: ["is_paid"] },
      include: [{ model: ProductMedia, as: "media" }],
    });

    res.json(updated);
  } catch (err) {
    await transaction.rollback();
    console.error("updateProductInfo error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ========================
// Cập nhật trạng thái sản phẩm (Member)
// ========================
exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, buyer_id } = req.body;
    const memberId = req.user.memberId;

    if (!["SOLD", "INACTIVE"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ." });
    }

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm." });

    if (product.member_id !== memberId) {
      return res.status(403).json({ message: "Bạn không có quyền cập nhật sản phẩm này." });
    }

    if (status === "SOLD") {
      if (!buyer_id) {
        return res.status(400).json({ message: "Cần cung cấp buyer_id khi đánh dấu ĐÃ BÁN." });
      }

      const buyer = await Member.findByPk(buyer_id);
      if (!buyer) return res.status(404).json({ message: "Buyer không tồn tại." });
      if (buyer.id === memberId)
        return res.status(400).json({ message: "Người bán không thể là người mua chính mình." });

      await product.update({ status: "SOLD", buyer_id });
    } else {
      await product.update({ status: "INACTIVE", buyer_id: null });
    }

    // Reload để đảm bảo trả về đủ thuộc tính (kèm is_paid)
    const withIsPaid = await Product.findByPk(id, {
      attributes: { include: ["is_paid"] },
      include: [
{ model: ProductMedia, as: "media" },
        { model: Category, as: "category" },
      ],
    });

    res.json({ message: "Cập nhật trạng thái thành công.", product: withIsPaid });
  } catch (err) {
    console.error("updateProductStatus error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ========================
// Duyệt bài (Admin)
// ========================
exports.updateModerateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const admin = await Admin.findOne({ where: { user_id: req.user.userId } });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    await product.update({ status });

    await ProductApproval.create({
      product_id: product.id,
      admin_id: admin.id,
      action: status,
      reason,
    });

    // Trả về sản phẩm có is_paid
    const refreshed = await Product.findByPk(id, {
      attributes: { include: ["is_paid"] },
      include: [
        { model: ProductMedia, as: "media" },
        { model: Category, as: "category" },
        { model: Member, as: "member" },
      ],
    });

    res.json({ message: "Moderation updated successfully", product: refreshed });
  } catch (err) {
    console.error("updateModerateStatus error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ========================
// Lấy sản phẩm theo memberId (Member)
// ========================
exports.getProductByMemberId = async (req, res) => {
  try {
    const memberId = req.user.memberId;
    if (!memberId)
      return res.status(400).json({ message: "Không tìm thấy memberId trong token." });

    const products = await Product.findAll({
      where: { member_id: memberId },
      attributes: { include: ["is_paid"] },
      include: [
        { model: ProductMedia, as: "media" },
        { model: Category, as: "category" },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json({
      message: "Lấy danh sách sản phẩm thành công.",
      total: products.length,
      data: products,
    });
  } catch (err) {
    console.error("getProductByMemberId error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};