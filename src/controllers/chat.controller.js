// src/controllers/chat.controller.js
const db = require("../models");
const Chatbox = db.Chatbox;
const ChatMessage = db.ChatMessage;
const Member = db.Member;
const User = db.User;

// 🧠 [POST] /api/chat/chatbox
exports.createChatbox = async (req, res) => {
  try {
    const { host_id } = req.body;
    if (!host_id) return res.status(400).json({ message: "Thiếu thông tin host_id." });

    const existing = await Chatbox.findOne({ where: { host_id } });
    if (existing) return res.status(200).json(existing);

    const chatbox = await Chatbox.create({ host_id });
    res.status(201).json(chatbox);
  } catch (error) {
    console.error("❌ Lỗi tạo Chatbox:", error);
    res.status(500).json({ message: "Lỗi tạo Chatbox", error: error.message });
  }
};

// 🗨️ [POST] /api/chat/messages
exports.sendMessage = async (req, res) => {
  try {
    const { chatbox_id, sender_id, message } = req.body;
    if (!chatbox_id || !sender_id || !message) {
      return res.status(400).json({ message: "Thiếu thông tin gửi tin nhắn." });
    }

    const newMsg = await ChatMessage.create({ chatbox_id, sender_id, message });
    res.status(201).json({
      message: "Đã gửi tin nhắn thành công.",
      data: newMsg,
    });
  } catch (error) {
    console.error("❌ Lỗi gửi tin nhắn:", error);
    res.status(500).json({ message: "Lỗi gửi tin nhắn", error: error.message });
  }
};

// 📥 [GET] /api/chat/messages/:chatbox_id
exports.getMessagesByChatbox = async (req, res) => {
  try {
    const { chatbox_id } = req.params;

    const messages = await ChatMessage.findAll({
      where: { chatbox_id },
      include: [
        {
          model: Member,
          as: "sender",
          attributes: ["id"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["full_name", "avatar"],
            },
          ],
        },
      ],
      order: [["created_at", "ASC"]],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Lỗi lấy tin nhắn:", error);
    res.status(500).json({ message: "Lỗi lấy tin nhắn", error: error.message });
  }
};

// 📦 [GET] /api/chat/chatboxes/:member_id
exports.getChatboxesByMember = async (req, res) => {
  try {
    const { member_id } = req.params;

    const chatboxes = await Chatbox.findAll({
      where: { host_id: member_id },
      include: [
        {
          model: ChatMessage,
          as: "messages",
          include: [
            {
              model: Member,
              as: "sender",
              attributes: ["id"],
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["full_name", "avatar"],
                },
              ],
            },
          ],
          order: [["created_at", "DESC"]],
          limit: 1,
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json(chatboxes);
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách chatbox:", error);
    res.status(500).json({ message: "Lỗi lấy danh sách chatbox", error: error.message });
  }
};

// 🗑️ [DELETE] /api/chat/messages/:message_id
// Thu hồi (xóa) tin nhắn người dùng đã gửi
exports.deleteMessage = async (req, res) => {
  try {
    const { message_id } = req.params;
    const memberId = req.user.memberId; // từ middleware xác thực

    const message = await ChatMessage.findByPk(message_id);

    if (!message) {
      return res.status(404).json({ message: "Không tìm thấy tin nhắn." });
    }

    // Kiểm tra quyền sở hữu
    if (message.sender_id !== memberId) {
      return res.status(403).json({ message: "Bạn không có quyền thu hồi tin nhắn này." });
    }

    await message.destroy();

    res.status(200).json({ message: "Thu hồi tin nhắn thành công." });
  } catch (error) {
    console.error("❌ Lỗi thu hồi tin nhắn:", error);
    res.status(500).json({ message: "Lỗi thu hồi tin nhắn", error: error.message });
  }
};
