const db = require("../models");
const Product = db.Product;

// Không cần đăng nhập
exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

exports.getProductByCateId = async (req, res) => {
  try {
    const { cateId } = req.params;
    const products = await Product.findAll({ where: { category_id: cateId } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

exports.search = async (req, res) => {
  try {
    const { name } = req.query;
    const products = await Product.findAll({
      where: { title: { [db.Sequelize.Op.like]: `%${name}%` } },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

exports.getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

// Yêu cầu đăng nhập
exports.createProduct = async (req, res) => {
  try {
    const {
      category_id,
      title,
      description,
      price,
      usage_duration,
      warranty_info,
      location,
      brand,
      model,
      year,
      mileage,
      battery_type,
      capacity,
      cycle_count,
      compatible_with
    } = req.body;

    const product = await Product.create({
      member_id: req.user.userId,
      category_id,
      title,
      description: description || null,
      price,
      usage_duration: usage_duration || null,
      warranty_info: warranty_info || null,
      location: location || null,
      brand: brand || null,
      model: model || null,
      year: year || null,
      mileage: mileage || null,
      battery_type: battery_type || null,
      capacity: capacity || null,
      cycle_count: cycle_count || null,
      compatible_with: compatible_with || null,
      status: "PENDING",
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

exports.getProductByMemberId = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { member_id: req.user.userId } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

exports.updateProductInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product || product.member_id !== req.user.userId)
      return res.status(403).json({ message: "Not authorized" });

    Object.assign(product, req.body, { status: "PENDING" });
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["SOLD", "INACTIVE"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const product = await Product.findByPk(id);
    if (!product || product.member_id !== req.user.userId)
      return res.status(403).json({ message: "Not authorized" });

    product.status = status;
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

// Chỉ Admin
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

    // tạo record trong product_approvals
    await db.ProductApproval.create({
      product_id: id,
      admin_id: req.user.userId,
      action: status,
      reason,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};