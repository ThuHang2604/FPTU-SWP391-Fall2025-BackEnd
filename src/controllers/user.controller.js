const bcrypt = require("bcrypt");
const db = require("../models");
const { User, Member, Admin } = db;

/**
 * @desc Lấy danh sách tất cả người dùng
 * @route GET /api/users
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
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

/**
 * @desc Lấy thông tin chi tiết người dùng
 * @route GET /api/users/:id
 * @access Admin
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        { model: Member, as: "member" },
        { model: Admin, as: "admin" },
      ],
      attributes: { exclude: ["password"] },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng." });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

/**
 * @desc Phê duyệt người dùng (kích hoạt tài khoản)
 * @route PATCH /api/users/:id/approve
 * @access Admin
 */
exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng." });

    if (user.status === "ACTIVE")
      return res
        .status(400)
        .json({ success: false, message: "Người dùng đã được kích hoạt." });

    user.status = "ACTIVE";
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Phê duyệt người dùng thành công.",
        data: user,
      });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

/**
 * @desc Khóa người dùng (vô hiệu hóa tài khoản)
 * @route PATCH /api/users/:id/block
 * @access Admin
 */
exports.blockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng." });

    if (user.status === "INACTIVE")
      return res
        .status(400)
        .json({ success: false, message: "Người dùng đã bị khóa trước đó." });

    user.status = "INACTIVE";
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Khóa người dùng thành công.",
        data: user,
      });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

/**
 * @desc Xóa người dùng
 * @route DELETE /api/users/:id
 * @access Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng." });

    await user.destroy();

    res
      .status(200)
      .json({ success: true, message: "Xóa người dùng thành công." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

/**
 * @desc Tạo người dùng mới với role = ADMIN
 * @route POST /api/users/admin
 * @access Admin
 */
exports.createAdmin = async (req, res) => {
  try {
    const { full_name, email, password, phone, avatar } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ họ tên, email và mật khẩu.",
      });
    }

    // Kiểm tra trùng email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email này đã được sử dụng.",
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user (role = ADMIN)
    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
      phone,
      avatar,
      role: "ADMIN",
      status: "ACTIVE",
    });

    // Tạo bản ghi trong bảng Admin
    await Admin.create({ user_id: newUser.id });

    res.status(201).json({
      success: true,
      message: "Tạo tài khoản quản trị viên thành công.",
      data: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

/**
 * @desc Tìm kiếm người mua theo email hoặc số điện thoại
 * @route GET /api/users/search-buyer?query=
 * @access Member (người bán)
 */
exports.searchBuyer = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email hoặc số điện thoại để tìm kiếm.",
      });
    }

    // Tìm theo email hoặc phone
    const buyer = await User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ email: query }, { phone: query }],
      },
      include: [
        {
          model: Member,
          as: "member",
          attributes: ["id", "wallet_balance", "status", "created_at"],
        },
      ],
      attributes: ["id", "full_name", "email", "phone", "status", "role"],
    });

    if (!buyer || !buyer.member) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người mua phù hợp.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tìm thấy người mua.",
      data: {
        buyer_id: buyer.member.id,
        full_name: buyer.full_name,
        email: buyer.email,
        phone: buyer.phone,
        status: buyer.status,
      },
    });
  } catch (error) {
    console.error("❌ Error searching buyer:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tìm kiếm người mua.",
      error: error.message,
    });
  }
};
