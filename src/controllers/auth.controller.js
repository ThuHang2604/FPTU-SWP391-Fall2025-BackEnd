const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { User, Member, Admin } = db;
const { Op } = db.Sequelize;

/**
 * [POST] /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, role, address, city, country } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ message: "Thiếu thông tin đăng ký bắt buộc." });
    }

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { phone }] },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email hoặc số điện thoại đã tồn tại." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email,
      password: hashedPassword,
      phone,
      role: role || "MEMBER",
    });

    let memberRecord = null;
    if (user.role === "MEMBER") {
      memberRecord = await Member.create({
        user_id: user.id,
        address: address || null,
        city: city || null,
        country: country || "Vietnam",
      });
    } else if (user.role === "ADMIN") {
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
    console.error("❌ Register Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

/**
 * [POST] /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Email hoặc mật khẩu không hợp lệ." });

    if (user.status !== "ACTIVE") {
      return res.status(403).json({ message: "Tài khoản đã bị khóa hoặc chưa được kích hoạt." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Email hoặc mật khẩu không hợp lệ." });

    let memberId = null;
    if (user.role === "MEMBER") {
      const member = await Member.findOne({ where: { user_id: user.id } });
      if (member?.status !== "ACTIVE") {
        return res.status(403).json({ message: "Tài khoản thành viên tạm bị đình chỉ." });
      }
      memberId = member?.id || null;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, memberId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Đăng nhập thành công.",
      token,
      user: { id: user.id, email: user.email, role: user.role, memberId },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

// [POST] /api/auth/google-login
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body; // Đây là ACCESS TOKEN gửi từ Frontend
    
    if (!token) {
        return res.status(400).json({ message: "Thiếu Google Access Token." });
    }

    // 1. Dùng Access Token để lấy thông tin User từ Google API
    // Sử dụng fetch (có sẵn trong Node 18+). Nếu Node thấp hơn, hãy dùng axios hoặc node-fetch
    const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!googleResponse.ok) {
        return res.status(400).json({ message: "Token Google không hợp lệ hoặc đã hết hạn." });
    }

    const payload = await googleResponse.json();
    // Payload trả về: { sub, name, given_name, picture, email, ... }
    const { sub: googleId, email, name, picture } = payload;

    console.log("✅ Google User Verified:", email);

    // 2. Tìm User trong DB (theo Google ID hoặc Email)
    let user = await User.findOne({ 
        where: { 
            [Op.or]: [{ google_id: googleId }, { email: email }] 
        } 
    });

    // 3. Xử lý Logic User
    if (!user) {
      // === TẠO USER MỚI (Đăng ký) ===
      user = await User.create({
        full_name: name,
        email,
        google_id: googleId,
        avatar: picture,
        login_provider: "GOOGLE",
        role: "MEMBER",
        status: "ACTIVE"
      });
      
      // Tạo Member profile mặc định
      await Member.create({ user_id: user.id, country: "Vietnam" });

    } else {
      // === CẬP NHẬT USER CŨ (Đăng nhập) ===
      // Link tài khoản nếu trước đó đăng ký bằng email/pass
      let hasUpdate = false;
      
      if (!user.google_id) {
          user.google_id = googleId;
          user.login_provider = "GOOGLE"; 
          hasUpdate = true;
      }
      // Cập nhật avatar mới nhất từ Google (tuỳ chọn)
      if (picture && user.avatar !== picture) {
          user.avatar = picture;
          hasUpdate = true;
      }
      
      if (hasUpdate) await user.save();
    }

    // 4. Kiểm tra trạng thái khóa
    if (user.status !== "ACTIVE") {
        return res.status(403).json({ message: "Tài khoản đã bị khóa." });
    }

    // 5. Lấy hoặc tạo Member (đề phòng dữ liệu cũ bị thiếu)
    let member = await Member.findOne({ where: { user_id: user.id } });
    if (!member && user.role === "MEMBER") {
         member = await Member.create({ user_id: user.id, country: "Vietnam" });
    }

    // 6. Tạo JWT Token của hệ thống
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, memberId: member?.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 7. Trả về Client
    res.json({
      message: "Đăng nhập Google thành công.",
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar: user.avatar,
        role: user.role,
        memberId: member?.id,
      },
    });

  } catch (error) {
    console.error("❌ Google Login Error:", error);
    res.status(500).json({ message: "Lỗi xác thực Google (Backend)." });
  }
};

/**
 * [GET] /api/auth/profile
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ["id", "full_name", "email", "phone", "avatar", "role", "status", "created_at"],
      include: [
        { model: Member, as: "member", attributes: ["id", "address", "city", "country", "wallet_balance"] },
      ],
    });

    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng." });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

/**
 * [PUT] /api/auth/profile
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const { full_name, phone, avatar, address, city, country } = req.body;
    const user = await User.findByPk(req.user.userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng." });
    if (user.status !== "ACTIVE") return res.status(403).json({ message: "Tài khoản bị khóa." });

    Object.assign(user, { full_name, phone, avatar });
    await user.save();

    if (user.role === "MEMBER") {
      const member = await Member.findOne({ where: { user_id: user.id } });
      if (member) {
        Object.assign(member, { address, city, country });
        await member.save();
      }
    }

    res.json({ message: "Cập nhật thông tin thành công.", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

/**
 * [PUT] /api/auth/change-password
 */
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ mật khẩu cũ và mới." });
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng." });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu cũ không chính xác." });

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};
