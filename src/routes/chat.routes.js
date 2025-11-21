const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: APIs quản lý chat giữa các thành viên
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Chatbox:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         host_id:
 *           type: integer
 *           example: 2
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-10-23T03:12:45.000Z"
 *
 *     ChatMessage:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         chatbox_id:
 *           type: integer
 *           example: 1
 *         sender_id:
 *           type: integer
 *           example: 2
 *         message:
 *           type: string
 *           example: "Xin chào, bạn còn sản phẩm này không?"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-10-23T03:25:10.000Z"
 *         sender:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 2
 *             user:
 *               type: object
 *               properties:
 *                 full_name:
 *                   type: string
 *                   example: "Nguyễn Văn A"
 *                 avatar:
 *                   type: string
 *                   example: "https://example.com/avatar.jpg"
 */

/**
 * @swagger
 * /api/chat/chatbox:
 *   post:
 *     summary: Tạo chatbox mới với composite key (product_id, seller_id, buyer_id)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - seller_id
 *               - buyer_id
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               seller_id:
 *                 type: integer
 *                 example: 2
 *               buyer_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Chatbox được tạo thành công
 *       200:
 *         description: Chatbox đã tồn tại
 *       500:
 *         description: Lỗi tạo chatbox
 */
router.post("/chatbox", authMiddleware, chatController.createChatbox);

/**
 * @swagger
 * /api/chat/chatbox/{member_id}:
 *   get:
 *     summary: Lấy danh sách chatbox của một thành viên
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: member_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thành viên
 *     responses:
 *       200:
 *         description: Danh sách chatbox của thành viên
 *       500:
 *         description: Lỗi lấy danh sách chatbox
 */
router.get("/chatbox/:member_id", authMiddleware, chatController.getChatboxesByMember);

/**
 * @swagger
 * /api/chat/chatboxes/product/{product_id}:
 *   get:
 *     summary: Lấy tất cả chatbox của một sản phẩm
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Danh sách chatbox của sản phẩm
 *       500:
 *         description: Lỗi lấy danh sách chatbox
 */
router.get("/chatboxes/product/:product_id", authMiddleware, chatController.getChatboxesByProduct);

/**
 * @swagger
 * /api/chat/messages:
 *   get:
 *     summary: Lấy toàn bộ tin nhắn theo composite key (query params)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của sản phẩm
 *       - in: query
 *         name: seller_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người bán
 *       - in: query
 *         name: buyer_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người mua
 *     responses:
 *       200:
 *         description: Danh sách tin nhắn
 *       404:
 *         description: Không tìm thấy chatbox
 *       500:
 *         description: Lỗi lấy tin nhắn
 *   post:
 *     summary: Gửi tin nhắn mới với composite key
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - seller_id
 *               - buyer_id
 *               - sender_id
 *               - message
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               seller_id:
 *                 type: integer
 *                 example: 2
 *               buyer_id:
 *                 type: integer
 *                 example: 3
 *               sender_id:
 *                 type: integer
 *                 example: 3
 *               message:
 *                 type: string
 *                 example: "Xin chào, bạn còn xe này không?"
 *     responses:
 *       201:
 *         description: Tin nhắn được gửi thành công
 *       400:
 *         description: Thiếu thông tin gửi tin nhắn
 *       404:
 *         description: Chatbox không tồn tại
 *       500:
 *         description: Lỗi gửi tin nhắn
 */
router.get("/messages", authMiddleware, chatController.getMessagesByChatbox);
router.post("/messages", authMiddleware, chatController.sendMessage);

/**
 * @swagger
 * /api/chat/messages/{message_id}:
 *   delete:
 *     summary: Thu hồi (xóa) tin nhắn đã gửi
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: message_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của tin nhắn cần thu hồi
 *     responses:
 *       200:
 *         description: Tin nhắn đã được thu hồi thành công
 *         content:
 *           application/json:
 *             example:
 *               message: "Thu hồi tin nhắn thành công."
 *       403:
 *         description: Không có quyền thu hồi tin nhắn
 *       404:
 *         description: Không tìm thấy tin nhắn
 *       500:
 *         description: Lỗi thu hồi tin nhắn
 */
router.delete("/messages/:message_id", authMiddleware, chatController.deleteMessage);

module.exports = router;
