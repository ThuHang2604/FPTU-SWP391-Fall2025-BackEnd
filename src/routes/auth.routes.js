const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API xác thực và quản lý tài khoản người dùng
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - full_name
 *         - email
 *         - password
 *       properties:
 *         full_name:
 *           type: string
 *           example: Nguyễn Văn A
 *         email:
 *           type: string
 *           example: user@example.com
 *         password:
 *           type: string
 *           example: 123456
 *         phone:
 *           type: string
 *           example: "0900000001"
 *         role:
 *           type: string
 *           enum: [MEMBER, ADMIN]
 *           example: MEMBER
 *         address:
 *           type: string
 *           example: "12 Nguyễn Trãi"
 *         city:
 *           type: string
 *           example: "Hà Nội"
 *         country:
 *           type: string
 *           example: "Vietnam"
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: user@example.com
 *         password:
 *           type: string
 *           example: 123456
 *
 *     AuthUser:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: user@example.com
 *         role:
 *           type: string
 *           example: MEMBER
 *         memberId:
 *           type: integer
 *           nullable: true
 *           example: 3
 *
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         full_name:
 *           type: string
 *           example: Nguyễn Văn A
 *         email:
 *           type: string
 *           example: user@example.com
 *         phone:
 *           type: string
 *           example: "0900000001"
 *         avatar:
 *           type: string
 *           example: "https://example.com/avatar.jpg"
 *         role:
 *           type: string
 *           example: MEMBER
 *         status:
 *           type: string
 *           example: ACTIVE
 *         created_at:
 *           type: string
 *           example: "2025-10-29T10:20:00.000Z"
 *         member:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 3
 *             address:
 *               type: string
 *               example: "12 Nguyễn Trãi"
 *             city:
 *               type: string
 *               example: "Hà Nội"
 *             country:
 *               type: string
 *               example: "Vietnam"
 *             wallet_balance:
 *               type: number
 *               example: 500000
 *
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - oldPassword
 *         - newPassword
 *       properties:
 *         oldPassword:
 *           type: string
 *           example: "123456"
 *         newPassword:
 *           type: string
 *           example: "newpass789"
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
 *             $ref: "#/components/schemas/RegisterRequest"
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
 *         description: Email hoặc số điện thoại đã tồn tại
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập tài khoản người dùng
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginRequest"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
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
 *         description: Email hoặc mật khẩu không hợp lệ
 *       403:
 *         description: Tài khoản bị khóa hoặc chưa kích hoạt
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Lấy thông tin hồ sơ người dùng hiện tại
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng hiện tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserProfile"
 *       401:
 *         description: Token không hợp lệ hoặc hết hạn
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.get("/profile", authMiddleware, authController.getUserProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Cập nhật thông tin cá nhân
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
 *                 example: "0909888777"
 *               avatar:
 *                 type: string
 *                 example: "https://example.com/avatar2.jpg"
 *               address:
 *                 type: string
 *                 example: "123 Hai Bà Trưng"
 *               city:
 *                 type: string
 *                 example: "TP. Hồ Chí Minh"
 *               country:
 *                 type: string
 *                 example: "Vietnam"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             example:
 *               message: "Cập nhật thông tin thành công."
 *       403:
 *         description: Tài khoản bị khóa
 *       401:
 *         description: Token không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.put("/profile", authMiddleware, authController.updateUserProfile);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Đổi mật khẩu người dùng
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ChangePasswordRequest"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             example:
 *               message: "Đổi mật khẩu thành công."
 *       400:
 *         description: Mật khẩu cũ không chính xác hoặc mật khẩu mới không hợp lệ
 *       401:
 *         description: Token không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.put("/change-password", authMiddleware, authController.changePassword);

module.exports = router;
