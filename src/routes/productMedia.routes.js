const express = require("express");
const router = express.Router();
const mediaController = require("../controllers/productMedia.controller");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: ProductMedia
 *   description: Product media APIs
 */

/**
 * @swagger
 * /api/product-media/{productId}:
 *   get:
 *     summary: Lấy media theo product id
 *     tags: [ProductMedia]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách media
 */
router.get("/:productId", mediaController.getMediaByProductId);

/**
 * @swagger
 * /api/product-media:
 *   post:
 *     summary: Thêm media cho sản phẩm (MEMBER)
 *     tags: [ProductMedia]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               media_url:
 *                 type: string
 *               media_type:
 *                 type: string
 *                 enum: [IMAGE, VIDEO]
 *     responses:
 *       201:
 *         description: Media created
 */
router.post("/", authMiddleware, mediaController.createMedia);

/**
 * @swagger
 * /api/product-media/{productId}:
 *   put:
 *     summary: Cập nhật media theo product id (MEMBER)
 *     tags: [ProductMedia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               media_url:
 *                 type: string
 *               media_type:
 *                 type: string
 *                 enum: [IMAGE, VIDEO]
 *     responses:
 *       200:
 *         description: Media updated
 */
router.put("/:productId", authMiddleware, mediaController.updateMediaByProductId);

/**
 * @swagger
 * /api/product-media/{productId}:
 *   delete:
 *     summary: Xóa media theo product id (MEMBER)
 *     tags: [ProductMedia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Media deleted
 */
router.delete("/:productId", authMiddleware, mediaController.deleteMediaByProductId);

module.exports = router;
