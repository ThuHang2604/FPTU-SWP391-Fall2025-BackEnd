const db = require("../models");
const Notification = db.Notification;
const Member = db.Member;

/**
 * 🧩 Tạo thông báo mới
 * @param {number} member_id - ID của thành viên nhận thông báo
 * @param {string} message - Nội dung thông báo
 */
exports.createNotification = async (req, res) => {
  try {
    const { member_id, message } = req.body;

    if (!member_id || !message) {
      return res.status(400).json({ message: "member_id và message là bắt buộc." });
    }

    const member = await Member.findByPk(member_id);
    if (!member) {
      return res.status(404).json({ message: "Không tìm thấy thành viên." });
    }

    const notification = await Notification.create({
      member_id,
      message,
      is_read: false,
    });

    res.status(201).json({
      message: "Tạo thông báo thành công.",
      data: notification,
    });
  } catch (error) {
    console.error("❌ Lỗi tạo thông báo:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};

/**
 * 🔔 Lấy tất cả thông báo của thành viên
 */
exports.getNotificationsByMember = async (req, res) => {
  try {
    const { member_id } = req.params;

    const notifications = await Notification.findAll({
      where: { member_id },
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      message: "Lấy danh sách thông báo thành công.",
      data: notifications,
    });
  } catch (error) {
    console.error("❌ Lỗi lấy thông báo:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};

/**
 * 📩 Lấy chi tiết 1 thông báo theo ID
 */
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id, {
      include: [{ model: Member, as: "member" }],
    });

    if (!notification) {
      return res.status(404).json({ message: "Không tìm thấy thông báo." });
    }

    res.status(200).json({
      message: "Lấy thông báo thành công.",
      data: notification,
    });
  } catch (error) {
    console.error("❌ Lỗi lấy thông báo chi tiết:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};

/**
 * ✅ Đánh dấu thông báo là đã đọc
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({ message: "Không tìm thấy thông báo." });
    }

    notification.is_read = true;
    await notification.save();

    res.status(200).json({
      message: "Đã đánh dấu thông báo là đã đọc.",
      data: notification,
    });
  } catch (error) {
    console.error("❌ Lỗi đánh dấu đọc:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};

/**
 * 🗑️ Xóa thông báo
 */
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({ message: "Không tìm thấy thông báo." });
    }

    await notification.destroy();

    res.status(200).json({ message: "Đã xóa thông báo thành công." });
  } catch (error) {
    console.error("❌ Lỗi xóa thông báo:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};

/**
 * 🚀 Đánh dấu tất cả thông báo của thành viên là đã đọc
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const { member_id } = req.params;

    await Notification.update(
      { is_read: true },
      { where: { member_id } }
    );

    res.status(200).json({ message: "Tất cả thông báo đã được đánh dấu là đã đọc." });
  } catch (error) {
    console.error("❌ Lỗi đánh dấu tất cả là đã đọc:", error);
    res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};
