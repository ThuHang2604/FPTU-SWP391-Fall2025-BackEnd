const db = require("../models");
const { Product, ProductMedia, Member, ProductApproval, Admin } = db;
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

// Cập nhật trạng thái sản phẩm (Member)
exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, buyer_id } = req.body; // 👈 Cho phép truyền buyer_id nếu status = SOLD
    const memberId = req.user.member_id;

    // ✅ Kiểm tra trạng thái hợp lệ
    if (!["SOLD", "INACTIVE"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ." });
    }

    // ✅ Tìm sản phẩm
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    // ✅ Kiểm tra quyền sở hữu
    if (product.member_id !== memberId) {
      return res.status(403).json({ message: "Bạn không có quyền cập nhật sản phẩm này." });
    }

    // ✅ Nếu là chuyển sang SOLD → yêu cầu có buyer_id
    if (status === "SOLD") {
      if (!buyer_id) {
        return res.status(400).json({ message: "Vui lòng cung cấp buyer_id khi đánh dấu sản phẩm là ĐÃ BÁN." });
      }

      // Kiểm tra buyer tồn tại
      const buyer = await db.Member.findByPk(buyer_id);
      if (!buyer) {
        return res.status(404).json({ message: "Không tìm thấy người mua (buyer_id không hợp lệ)." });
      }

      // Không cho seller tự chọn chính mình làm buyer
      if (buyer.id === memberId) {
        return res.status(400).json({ message: "Người bán không thể là người mua sản phẩm của chính mình." });
      }

      // Cập nhật trạng thái và buyer_id
      await product.update({
        status: "SOLD",
        buyer_id,
      });
    } else {
      // ✅ Nếu là INACTIVE → chỉ cập nhật status
      await product.update({ status, buyer_id: null });
    }

    return res.status(200).json({
      message: "Cập nhật trạng thái sản phẩm thành công.",
      product,
    });
  } catch (err) {
    console.error("❌ Lỗi updateProductStatus:", err);
    return res.status(500).json({
      message: "Lỗi máy chủ.",
      error: err.message,
    });
  }
};

// Admin duyệt bài
exports.updateModerateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    // Kiểm tra trạng thái hợp lệ
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔹 Lấy admin theo user_id trong token
    const admin = await Admin.findOne({ where: { user_id: req.user.userId } });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found for this user" });
    }

    // 🔹 Cập nhật trạng thái sản phẩm
    product.status = status;
    await product.save();

    // 🔹 Ghi log vào bảng product_approvals
    await ProductApproval.create({
      product_id: product.id,
      admin_id: admin.id, // Dùng admin.id trong bảng admins
      action: status,
      reason,
    });

    res.json({
      message: "Product moderation updated successfully",
      product,
    });
  } catch (err) {
    console.error("updateModerateStatus error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Lấy sản phẩm theo memberId (Member)
exports.getProductByMemberId = async (req, res) => {
  try {
    const memberId = req.user.memberId; // lấy từ token (authMiddleware)

    if (!memberId) {
      return res.status(400).json({ message: "Không tìm thấy memberId trong token." });
    }

    const products = await db.Product.findAll({
      where: { member_id: memberId },
      include: [
        {
          model: db.ProductMedia,
          as: "media",
          attributes: ["id", "media_url", "media_type"],
        },
        {
          model: db.Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      message: "Lấy danh sách sản phẩm của thành viên thành công.",
      total: products.length,
      data: products,
    });
  } catch (error) {
    console.error("getProductByMemberId error:", error);
    return res.status(500).json({ message: "Lỗi máy chủ khi lấy sản phẩm của thành viên.", error });
  }
};
