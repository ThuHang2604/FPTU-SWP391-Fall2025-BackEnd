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
 *           description: ID chatbox
 *         host_id:
 *           type: integer
 *           description: ID của thành viên chủ chatbox
 *         created_at:
 *           type: string
 *           format: date-time
 *     ChatMessage:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         chatbox_id:
 *           type: integer
 *         sender_id:
 *           type: integer
 *         message:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/chat/chatbox:
 *   post:
 *     summary: Tạo chatbox mới (nếu chưa tồn tại)
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               host_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Chatbox được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chatbox'
 *       500:
 *         description: Lỗi tạo chatbox
 */
router.post("/chatbox", authMiddleware, chatController.createChatbox);

/**
 * @swagger
 * /api/chat/chatbox/{member_id}:
 *   get:
 *     summary: Lấy danh sách chatbox của thành viên
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chatbox'
 *       500:
 *         description: Lỗi lấy danh sách chatbox
 */
router.get("/chatbox/:member_id", authMiddleware, chatController.getChatboxesByMember);

/**
 * @swagger
 * /api/chat/messages/{chatbox_id}:
 *   get:
 *     summary: Lấy toàn bộ tin nhắn trong chatbox
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatbox_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của chatbox
 *     responses:
 *       200:
 *         description: Danh sách tin nhắn
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChatMessage'
 *       500:
 *         description: Lỗi lấy tin nhắn
 */
router.get("/messages/:chatbox_id", authMiddleware, chatController.getMessagesByChatbox);

/**
 * @swagger
 * /api/chat/message:
 *   post:
 *     summary: Gửi tin nhắn mới
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatbox_id:
 *                 type: integer
 *                 example: 1
 *               sender_id:
 *                 type: integer
 *                 example: 2
 *               message:
 *                 type: string
 *                 example: "Xin chào, bạn còn xe này không?"
 *     responses:
 *       201:
 *         description: Tin nhắn được gửi thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatMessage'
 *       500:
 *         description: Lỗi gửi tin nhắn
 */
router.post("/message", authMiddleware, chatController.sendMessage);

module.exports = router;
