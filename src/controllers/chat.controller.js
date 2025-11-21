// src/controllers/chat.controller.js
const db = require("../models");
const Chatbox = db.Chatbox;
const ChatMessage = db.ChatMessage;
const Member = db.Member;
const User = db.User;
const Product = db.Product;

// 🧠 [POST] /api/chat/chatbox - Create chatbox with composite key
exports.createChatbox = async (req, res) => {
  try {
    const { product_id, seller_id, buyer_id } = req.body;
    
    console.log('📦 [createChatbox] Request:', { product_id, seller_id, buyer_id });
    
    // Validate required fields
    if (!product_id || !seller_id || !buyer_id) {
      return res.status(400).json({ 
        message: "Thiếu thông tin: product_id, seller_id, buyer_id đều bắt buộc." 
      });
    }

    // Check if chatbox already exists
    const existing = await Chatbox.findOne({ 
      where: { 
        product_id: parseInt(product_id), 
        seller_id: parseInt(seller_id), 
        buyer_id: parseInt(buyer_id) 
      } 
    });
    
    if (existing) {
      console.log('✅ [createChatbox] Chatbox already exists:', existing.toJSON());
      return res.status(200).json({
        data: existing,
        isNew: false
      });
    }

    // Create new chatbox
    const chatbox = await Chatbox.create({ 
      product_id: parseInt(product_id), 
      seller_id: parseInt(seller_id), 
      buyer_id: parseInt(buyer_id) 
    });
    
    console.log('✅ [createChatbox] New chatbox created:', chatbox.toJSON());
    res.status(201).json({
      data: chatbox,
      isNew: true
    });
  } catch (error) {
    console.error("❌ [createChatbox] Error:", error);
    res.status(500).json({ message: "Lỗi tạo Chatbox", error: error.message });
  }
};

// 🗨️ [POST] /api/chat/messages - Send message with composite key
exports.sendMessage = async (req, res) => {
  try {
    const { product_id, seller_id, buyer_id, sender_id, message } = req.body;
    
    console.log('💬 [sendMessage] Request:', { product_id, seller_id, buyer_id, sender_id, message: message?.substring(0, 50) });
    
    // Validate required fields
    if (!product_id || !seller_id || !buyer_id || !sender_id || !message) {
      return res.status(400).json({ 
        message: "Thiếu thông tin: product_id, seller_id, buyer_id, sender_id và message đều bắt buộc." 
      });
    }

    // Check if chatbox exists
    const chatbox = await Chatbox.findOne({
      where: { 
        product_id: parseInt(product_id), 
        seller_id: parseInt(seller_id), 
        buyer_id: parseInt(buyer_id) 
      }
    });

    if (!chatbox) {
      console.error('❌ [sendMessage] Chatbox not found:', { product_id, seller_id, buyer_id });
      return res.status(404).json({ message: "Chatbox not found" });
    }

    // Create message
    const newMsg = await ChatMessage.create({ 
      product_id: parseInt(product_id), 
      seller_id: parseInt(seller_id), 
      buyer_id: parseInt(buyer_id), 
      sender_id: parseInt(sender_id), 
      message 
    });
    
    console.log('✅ [sendMessage] Message created:', newMsg.id);
    
    res.status(201).json({
      message: "Đã gửi tin nhắn thành công.",
      data: newMsg,
    });
  } catch (error) {
    console.error("❌ [sendMessage] Error:", error);
    res.status(500).json({ message: "Lỗi gửi tin nhắn", error: error.message });
  }
};

// 📥 [GET] /api/chat/messages - Get messages by composite key (query params)
exports.getMessagesByChatbox = async (req, res) => {
  try {
    const { product_id, seller_id, buyer_id } = req.query;
    
    console.log('📥 [getMessagesByChatbox] Query:', { product_id, seller_id, buyer_id });

    // Validate required fields
    if (!product_id || !seller_id || !buyer_id) {
      return res.status(400).json({ 
        message: "Thiếu thông tin: product_id, seller_id, buyer_id đều bắt buộc." 
      });
    }

    // Check if chatbox exists
    const chatbox = await Chatbox.findOne({
      where: { 
        product_id: parseInt(product_id), 
        seller_id: parseInt(seller_id), 
        buyer_id: parseInt(buyer_id) 
      }
    });

    if (!chatbox) {
      console.log('⚠️ [getMessagesByChatbox] Chatbox not found - returning empty array');
      return res.status(200).json([]); // Return empty array for new chatbox
    }

    // Get messages
    const messages = await ChatMessage.findAll({
      where: { 
        product_id: parseInt(product_id), 
        seller_id: parseInt(seller_id), 
        buyer_id: parseInt(buyer_id) 
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
              attributes: ["full_name", "avatar"],
            },
          ],
        },
      ],
      order: [["created_at", "ASC"]],
    });

    console.log(`✅ [getMessagesByChatbox] Found ${messages.length} messages`);
    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ [getMessagesByChatbox] Error:", error);
    res.status(500).json({ message: "Lỗi lấy tin nhắn", error: error.message });
  }
};

// 📦 [GET] /api/chat/chatboxes/:member_id - Get chatboxes for a member
exports.getChatboxesByMember = async (req, res) => {
  try {
    const { member_id } = req.params;
    
    console.log('📦 [getChatboxesByMember] member_id:', member_id);

    // Find chatboxes where member is either seller or buyer
    const { Op } = require('sequelize');
    const chatboxes = await Chatbox.findAll({
      where: {
        [Op.or]: [
          { seller_id: parseInt(member_id) },
          { buyer_id: parseInt(member_id) }
        ]
      },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "title", "price"],
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
      order: [["updated_at", "DESC"]],
    });

    console.log(`✅ [getChatboxesByMember] Found ${chatboxes.length} chatboxes`);
    res.status(200).json(chatboxes);
  } catch (error) {
    console.error("❌ [getChatboxesByMember] Error:", error);
    res.status(500).json({ message: "Lỗi lấy danh sách chatbox", error: error.message });
  }
};

// 📦 [GET] /api/chat/chatboxes/product/:product_id - Get all chatboxes for a product
exports.getChatboxesByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    
    console.log('📦 [getChatboxesByProduct] product_id:', product_id);

    // Find all chatboxes for this product
    const chatboxes = await Chatbox.findAll({
      where: { 
        product_id: parseInt(product_id)
      },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "title", "price", "member_id"],
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
      order: [["updated_at", "DESC"]],
    });

    console.log(`✅ [getChatboxesByProduct] Found ${chatboxes.length} chatboxes`);
    res.status(200).json(chatboxes);
  } catch (error) {
    console.error("❌ [getChatboxesByProduct] Error:", error);
    res.status(500).json({ message: "Lỗi lấy danh sách chatbox của sản phẩm", error: error.message });
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
