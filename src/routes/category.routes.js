const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management APIs
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lấy danh sách tất cả category
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Danh sách category
 */
router.get("/", categoryController.getAllCategory);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Tạo mới category (ADMIN)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Xe điện"
 *               description:
 *                 type: string
 *                 example: "Danh mục xe điện"
 *     responses:
 *       201:
 *         description: Category created
 */
router.post("/", authMiddleware, adminMiddleware, categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Cập nhật category (ADMIN)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 */
router.put("/:id", authMiddleware, adminMiddleware, categoryController.updateCategoryById);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Xóa category (ADMIN)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete("/:id", authMiddleware, adminMiddleware, categoryController.deleteCategoryById);

module.exports = router;
