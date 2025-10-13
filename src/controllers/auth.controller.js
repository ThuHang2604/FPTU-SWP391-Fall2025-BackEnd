const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const Member = db.Member;
const Admin = db.Admin;

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, role, address } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: 'Email already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await User.create({
      full_name,
      email,
      password: hashedPassword,
      phone,
      role: role || 'MEMBER',
    });

    // If Member → insert into members
    if (user.role === 'MEMBER') {
      await Member.create({ user_id: user.id, address });
    }

    // If Admin → insert into admins
    if (user.role === 'ADMIN') {
      await Admin.create({ user_id: user.id });
    }

    res
      .status(201)
      .json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * [GET] /api/auth/profile
 * → Lấy thông tin người dùng đang đăng nhập
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: [
        { model: Member, attributes: ['address'] },
        { model: Admin, attributes: [] },
      ],
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * [PUT] /api/auth/profile
 * → Cập nhật thông tin cá nhân (chỉ người đã đăng nhập)
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const { full_name, phone, address } = req.body;

    const user = await User.findByPk(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.full_name = full_name || user.full_name;
    user.phone = phone || user.phone;
    await user.save();

    // Nếu là member thì cập nhật địa chỉ
    if (user.role === 'MEMBER') {
      const member = await Member.findOne({ where: { user_id: user.id } });
      if (member) {
        member.address = address || member.address;
        await member.save();
      }
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

