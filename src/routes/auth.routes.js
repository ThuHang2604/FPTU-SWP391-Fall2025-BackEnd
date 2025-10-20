// src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs (Register, Login, Profile, Password)
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới (MEMBER hoặc ADMIN)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - password
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *               role:
 *                 type: string
 *                 enum: [MEMBER, ADMIN]
 *                 example: MEMBER
 *               address:
 *                 type: string
 *                 example: "Số 12 Nguyễn Trãi"
 *               city:
 *                 type: string
 *                 example: "Hà Nội"
 *               country:
 *                 type: string
 *                 example: "Vietnam"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             example:
 *               message: "Đăng ký thành công."
 *               user:
 *                 id: 1
 *                 email: "user@example.com"
 *                 role: "MEMBER"
 *                 memberId: 3
 *       400:
 *         description: Email đã tồn tại
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công (trả về JWT token)
 *         content:
 *           application/json:
 *             example:
 *               message: "Đăng nhập thành công."
 *               token: "eyJhbGciOiJIUzI1NiIs..."
 *               user:
 *                 id: 1
 *                 email: "user@example.com"
 *                 role: "MEMBER"
 *                 memberId: 3
 *       401:
 *         description: Sai thông tin đăng nhập
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Lấy thông tin cá nhân (phải đăng nhập)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng hiện tại
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               full_name: "Nguyễn Văn A"
 *               email: "user@example.com"
 *               phone: "0987654321"
 *               avatar: "https://example.com/avatar.jpg"
 *               role: "MEMBER"
 *               status: "ACTIVE"
 *               member:
 *                 id: 3
 *                 address: "Số 12 Nguyễn Trãi"
 *                 city: "Hà Nội"
 *                 country: "Vietnam"
 *                 wallet_balance: 500000
 *       401:
 *         description: Token không hợp lệ hoặc hết hạn
 */
router.get("/profile", authMiddleware, authController.getUserProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Cập nhật thông tin cá nhân (MEMBER có thể đổi địa chỉ, thành phố, quốc gia)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Nguyễn Văn B
 *               phone:
 *                 type: string
 *                 example: "0912345678"
 *               avatar:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *               address:
 *                 type: string
 *                 example: "12 Trần Hưng Đạo"
 *               city:
 *                 type: string
 *                 example: "TP. Hồ Chí Minh"
 *               country:
 *                 type: string
 *                 example: "Vietnam"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin thành công
 *         content:
 *           application/json:
 *             example:
 *               message: "Cập nhật thông tin cá nhân thành công."
 *       401:
 *         description: Token không hợp lệ hoặc hết hạn
 */
router.put("/profile", authMiddleware, authController.updateUserProfile);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Đổi mật khẩu (phải đăng nhập)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: 123456
 *               newPassword:
 *                 type: string
 *                 example: newpass789
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *       400:
 *         description: Mật khẩu cũ không chính xác
 */
router.put("/change-password", authMiddleware, authController.changePassword);

module.exports = router;
