const db = require("../models");
const Chatbox = db.Chatbox;
const ChatMessage = db.ChatMessage;
const Member = db.Member;

// 🧠 Tạo Chatbox mới (nếu chưa tồn tại)
exports.createChatbox = async (req, res) => {
  try {
    const { host_id } = req.body;

    const existing = await Chatbox.findOne({ where: { host_id } });
    if (existing) return res.status(200).json(existing);

    const chatbox = await Chatbox.create({ host_id });
    res.status(201).json(chatbox);
  } catch (error) {
    res.status(500).json({ message: "Lỗi tạo Chatbox", error: error.message });
  }
};

// 🗨️ Gửi tin nhắn
exports.sendMessage = async (req, res) => {
  try {
    const { chatbox_id, sender_id, message } = req.body;

    const newMsg = await ChatMessage.create({ chatbox_id, sender_id, message });

    res.status(201).json({
      message: "Đã gửi tin nhắn thành công",
      data: newMsg,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi gửi tin nhắn", error: error.message });
  }
};

// 📥 Lấy tất cả tin nhắn trong chatbox
exports.getMessagesByChatbox = async (req, res) => {
  try {
    const { chatbox_id } = req.params;

    const messages = await ChatMessage.findAll({
      where: { chatbox_id },
      include: [{ model: Member, as: "sender", attributes: ["id", "full_name", "avatar"] }],
      order: [["created_at", "ASC"]],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy tin nhắn", error: error.message });
  }
};

// 📦 Lấy danh sách chatbox của một thành viên
exports.getChatboxesByMember = async (req, res) => {
  try {
    const { member_id } = req.params;

    const chatboxes = await Chatbox.findAll({
      where: { host_id: member_id },
      include: [
        {
          model: ChatMessage,
          as: "messages",
          include: [{ model: Member, as: "sender", attributes: ["id", "full_name", "avatar"] }],
          order: [["created_at", "DESC"]],
        },
      ],
    });

    res.status(200).json(chatboxes);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách chatbox", error: error.message });
  }
};
