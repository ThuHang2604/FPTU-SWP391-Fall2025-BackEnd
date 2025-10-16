const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");

const { User, Member, Admin } = db;

/**
 * [POST] /api/auth/register
 * Đăng ký người dùng mới (Member hoặc Admin)
 */
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, role, address } = req.body;

    // Kiểm tra email tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng." });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo bản ghi user
    const user = await User.create({
      full_name,
      email,
      password: hashedPassword,
      phone,
      role: role || "MEMBER",
    });

    // Nếu là MEMBER → tạo record trong members
    let memberRecord = null;
    if (user.role === "MEMBER") {
      memberRecord = await Member.create({
        user_id: user.id,
        address: address || null,
      });
    }

    // Nếu là ADMIN → tạo record trong admins
    if (user.role === "ADMIN") {
      await Admin.create({ user_id: user.id });
    }

    res.status(201).json({
      message: "Đăng ký thành công.",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        memberId: memberRecord ? memberRecord.id : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

/**
 * [POST] /api/auth/login
 * Đăng nhập và trả về JWT token
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra người dùng tồn tại
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không hợp lệ." });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không hợp lệ." });
    }

    // Nếu là member thì lấy member_id
    let memberId = null;
    if (user.role === "MEMBER") {
      const member = await Member.findOne({ where: { user_id: user.id } });
      memberId = member ? member.id : null;
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        memberId, // 🧩 thêm vào để dùng cho các bảng có FK = member_id
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Đăng nhập thành công.",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        memberId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

/**
 * [GET] /api/auth/profile
 * → Lấy thông tin cá nhân của user đang đăng nhập
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ["id", "full_name", "email", "phone", "avatar", "role", "status"],
      include: [
        { model: Member, attributes: ["id", "address"], required: false },
        { model: Admin, attributes: ["id"], required: false },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    res.json({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      member: user.Member || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

/**
 * [PUT] /api/auth/profile
 * → Cập nhật thông tin cá nhân (chỉ cho chính mình)
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const { full_name, phone, address, avatar } = req.body;

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    // Cập nhật thông tin cơ bản
    user.full_name = full_name || user.full_name;
    user.phone = phone || user.phone;
    user.avatar = avatar || user.avatar;
    await user.save();

    // Nếu là member thì cập nhật địa chỉ
    if (user.role === "MEMBER") {
      const member = await Member.findOne({ where: { user_id: user.id } });
      if (member) {
        member.address = address || member.address;
        await member.save();
      }
    }

    res.json({
      message: "Cập nhật thông tin cá nhân thành công.",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

/**
 * [PUT] /api/auth/change-password
 * → Đổi mật khẩu (chỉ người đang đăng nhập)
 */
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác." });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    user.password = hashedNew;
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};
