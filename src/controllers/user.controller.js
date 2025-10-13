const bcrypt = require('bcrypt');
const db = require('../models');
const { User, Admin, Member } = db;

/**
 * [GET] /api/users
 * → Chỉ ADMIN được phép xem tất cả user
 */
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Member, attributes: ['address'] },
        { model: Admin, attributes: [] },
      ],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * [PUT] /api/users/:id/status
 * → Cập nhật trạng thái ACTIVE/INACTIVE (chỉ ADMIN)
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'INACTIVE'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.status = status;
    await user.save();

    res.json({ message: 'User status updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

/**
 * [POST] /api/admins/create
 * → Tạo user admin mới (chỉ ADMIN)
 */
exports.createAdminUser = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      email,
      password: hashedPassword,
      phone,
      role: 'ADMIN',
      status: 'ACTIVE',
    });

    await Admin.create({ user_id: newUser.id });

    res.status(201).json({ message: 'Admin user created successfully', newUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
