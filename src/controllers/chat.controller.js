// src/controllers/chat.controller.js
const db = require("../models");
const Chatbox = db.Chatbox;
const ChatMessage = db.ChatMessage;
const Member = db.Member;
const User = db.User;
const Product = db.Product;
const { Op } = require("sequelize");

// 🧠 [POST] /api/chat/chatbox
// Tạo hoặc lấy chatbox cho một sản phẩm cụ thể
// Body: { product_id, seller_id, buyer_id }
exports.createChatbox = async (req, res) => {
  try {
    const { product_id, seller_id, buyer_id } = req.body;
    
    // Validate input
    if (!product_id || !seller_id || !buyer_id) {
      return res.status(400).json({ 
        message: "Thiếu thông tin: product_id, seller_id, buyer_id là bắt buộc." 
      });
    }

    // Kiểm tra product có tồn tại không
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    // Kiểm tra seller_id có khớp với owner của product không
    if (product.member_id !== seller_id) {
      return res.status(400).json({ 
        message: "seller_id không khớp với chủ sở hữu của sản phẩm." 
      });
    }

    // Tìm hoặc tạo chatbox (findOrCreate with composite key)
    const [chatbox, created] = await Chatbox.findOrCreate({
      where: { product_id, seller_id, buyer_id },
      defaults: { product_id, seller_id, buyer_id }
    });

    res.status(created ? 201 : 200).json({
      message: created ? "Tạo chatbox thành công." : "Chatbox đã tồn tại.",
      data: chatbox,
      isNew: created
    });
  } catch (error) {
    console.error("❌ Lỗi tạo Chatbox:", error);
    res.status(500).json({ message: "Lỗi tạo Chatbox", error: error.message });
  }
};

// 🗨️ [POST] /api/chat/messages
// Gửi tin nhắn trong chatbox
// Body: { product_id, seller_id, buyer_id, sender_id, message }
exports.sendMessage = async (req, res) => {
  try {
    const { product_id, seller_id, buyer_id, sender_id, message } = req.body;
    
    // Validate input
    if (!product_id || !seller_id || !buyer_id || !sender_id || !message) {
      return res.status(400).json({ 
        message: "Thiếu thông tin: product_id, seller_id, buyer_id, sender_id, message là bắt buộc." 
      });
    }

    // Kiểm tra sender_id phải là seller hoặc buyer
    if (sender_id !== seller_id && sender_id !== buyer_id) {
      return res.status(403).json({ 
        message: "Bạn không có quyền gửi tin nhắn trong chatbox này." 
      });
    }

    // Kiểm tra chatbox có tồn tại không
    const chatbox = await Chatbox.findOne({
      where: { product_id, seller_id, buyer_id }
    });

    if (!chatbox) {
      return res.status(404).json({ 
        message: "Chatbox không tồn tại. Vui lòng tạo chatbox trước." 
      });
    }

    // Tạo message mới
    const newMsg = await ChatMessage.create({ 
      product_id, 
      seller_id, 
      buyer_id, 
      sender_id, 
      message 
    });

    // Cập nhật updated_at của chatbox
    await chatbox.update({ updated_at: new Date() });

    res.status(201).json({
      message: "Đã gửi tin nhắn thành công.",
      data: newMsg,
    });
  } catch (error) {
    console.error("❌ Lỗi gửi tin nhắn:", error);
    res.status(500).json({ message: "Lỗi gửi tin nhắn", error: error.message });
  }
};

// 📥 [GET] /api/chat/messages?product_id=X&seller_id=Y&buyer_id=Z
// Lấy tất cả tin nhắn trong một chatbox
exports.getMessagesByChatbox = async (req, res) => {
  try {
    const { product_id, seller_id, buyer_id } = req.query;

    // Validate input
    if (!product_id || !seller_id || !buyer_id) {
      return res.status(400).json({ 
        message: "Thiếu thông tin query: product_id, seller_id, buyer_id là bắt buộc." 
      });
    }

    const messages = await ChatMessage.findAll({
      where: { product_id, seller_id, buyer_id },
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
// Lấy tất cả chatbox mà user là seller HOẶC buyer
exports.getChatboxesByMember = async (req, res) => {
  try {
    const { member_id } = req.params;

    const chatboxes = await Chatbox.findAll({
      where: {
        [Op.or]: [
          { seller_id: member_id },
          { buyer_id: member_id }
        ]
      },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "title", "price", "status"],
        },
        {
          model: Member,
          as: "seller",
          attributes: ["id"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["full_name", "avatar"],
            },
          ],
        },
        {
          model: Member,
          as: "buyer",
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
      order: [["updated_at", "DESC"]], // Chatbox có tin nhắn mới nhất lên đầu
    });

    // Manually fetch latest message for each chatbox (due to composite key)
    const chatboxesWithMessages = await Promise.all(
      chatboxes.map(async (chatbox) => {
        const latestMessage = await ChatMessage.findOne({
          where: {
            product_id: chatbox.product_id,
            seller_id: chatbox.seller_id,
            buyer_id: chatbox.buyer_id
          },
          include: [
            {
              model: Member,
              as: "sender",
              attributes: ["id"],
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["full_name"],
                },
              ],
            },
          ],
          order: [["created_at", "DESC"]],
          limit: 1
        });

        const chatboxData = chatbox.toJSON();
        chatboxData.messages = latestMessage ? [latestMessage] : [];
        return chatboxData;
      })
    );

    res.status(200).json(chatboxesWithMessages);
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
