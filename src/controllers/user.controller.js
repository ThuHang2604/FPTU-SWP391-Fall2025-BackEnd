const bcrypt = require("bcrypt");
const db = require("../models");
const { User, Member, Admin } = db;
const { Op } = db.Sequelize;

/**
 * [GET] /api/users
 * @access Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Member, as: "member" },
        { model: Admin, as: "admin" },
      ],
      attributes: { exclude: ["password"] },
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

/**
 * [GET] /api/users/:id
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: Member, as: "member" },
        { model: Admin, as: "admin" },
      ],
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

/**
 * [PATCH] /api/users/:id/approve
 */
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });

    if (user.status === "ACTIVE") {
      return res.status(400).json({ success: false, message: "Người dùng đã được kích hoạt." });
    }

    user.status = "ACTIVE";
    await user.save();

    if (user.role === "MEMBER") {
      await Member.update({ status: "ACTIVE" }, { where: { user_id: user.id } });
    }

    res.json({ success: true, message: "Phê duyệt người dùng thành công.", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

/**
 * [PATCH] /api/users/:id/block
 */
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });

    if (user.status === "INACTIVE") {
      return res.status(400).json({ success: false, message: "Người dùng đã bị khóa." });
    }

    user.status = "INACTIVE";
    await user.save();

    if (user.role === "MEMBER") {
      await Member.update({ status: "SUSPENDED" }, { where: { user_id: user.id } });
    }

    res.json({ success: true, message: "Khóa người dùng thành công.", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

/**
 * [DELETE] /api/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
    await user.destroy();
    res.json({ success: true, message: "Xóa người dùng thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

/**
 * [POST] /api/users/admin
 */
exports.createAdmin = async (req, res) => {
  try {
    const { full_name, email, password, phone, avatar } = req.body;
    if (!full_name || !email || !password)
      return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc." });

    const exist = await User.findOne({ where: { [Op.or]: [{ email }, { phone }] } });
    if (exist) return res.status(400).json({ success: false, message: "Email hoặc số điện thoại đã tồn tại." });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      full_name,
      email,
      password: hashed,
      phone,
      avatar,
      role: "ADMIN",
      status: "ACTIVE",
    });
    await Admin.create({ user_id: newUser.id });

    res.status(201).json({
      success: true,
      message: "Tạo tài khoản quản trị viên thành công.",
      data: { id: newUser.id, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

/**
 * [GET] /api/users/search-buyer?query=
 * @access Member
 */
exports.searchBuyer = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập email hoặc số điện thoại." });
    }

    const buyer = await User.findOne({
      where: {
        role: "MEMBER",
        status: "ACTIVE",
        [Op.or]: [{ email: query }, { phone: query }],
      },
      include: [{ model: Member, as: "member", attributes: ["id", "wallet_balance", "status"] }],
      attributes: ["id", "full_name", "email", "phone"],
    });

    if (!buyer || !buyer.member || buyer.member.status !== "ACTIVE") {
      return res.status(404).json({ success: false, message: "Không tìm thấy người mua hợp lệ." });
    }

    res.status(200).json({
      success: true,
      data: {
        buyer_id: buyer.member.id,
        full_name: buyer.full_name,
        email: buyer.email,
        phone: buyer.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server khi tìm người mua." });
  }
};
