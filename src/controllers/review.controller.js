const db = require("../models");
const Review = db.Review;
const Product = db.Product;
const Member = db.Member;
const Payment = db.Payment;
const { Op, fn, col } = require("sequelize");

/**
 * 🟢 [1] Tạo đánh giá sản phẩm (chỉ khi người dùng đã mua hàng)
 */
exports.createReview = async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;
    const member_id = req.user?.id || req.body.member_id;

    // ✅ Kiểm tra người dùng đã mua sản phẩm chưa
    const hasPurchased = await Payment.findOne({
      where: {
        member_id,
        product_id,
        status: { [Op.eq]: "COMPLETED" },
      },
    });

    if (!hasPurchased) {
      return res.status(403).json({ message: "Bạn chưa mua sản phẩm này hoặc giao dịch chưa hoàn tất." });
    }

    // ✅ Kiểm tra đã đánh giá trước đó chưa
    const existing = await Review.findOne({ where: { member_id, product_id } });
    if (existing) {
      return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này rồi." });
    }

    const review = await Review.create({ member_id, product_id, rating, comment });
    res.status(201).json({ message: "Đánh giá thành công", review });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo đánh giá", error: error.message });
  }
};

/**
 * 🟡 [2] Lấy tất cả đánh giá của một sản phẩm + trung bình rating động
 */
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;

    const reviews = await Review.findAll({
      where: { product_id },
      include: [
        {
          model: Member,
          as: "member",
          attributes: ["id", "user_id"],
          include: [{ model: db.User, as: "user", attributes: ["full_name", "avatar"] }],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // ✅ Tính trung bình rating ngay tại thời điểm gọi
    const avgData = await Review.findOne({
      where: { product_id },
      attributes: [[fn("AVG", col("rating")), "average_rating"]],
      raw: true,
    });

    res.json({
      product_id,
      average_rating: parseFloat(avgData?.average_rating || 0).toFixed(2),
      total_reviews: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách đánh giá", error: error.message });
  }
};

/**
 * 🟣 [3] Tổng hợp tất cả đánh giá dành cho người bán (qua các sản phẩm của họ)
 */
exports.getReviewsBySeller = async (req, res) => {
  try {
    const { seller_id } = req.params;

    const products = await Product.findAll({
      where: { member_id: seller_id },
      attributes: ["id", "name"],
      include: [
        {
          model: Review,
          as: "reviews",
          include: [
            {
              model: Member,
              as: "member",
              include: [{ model: db.User, as: "user", attributes: ["full_name", "avatar"] }],
            },
          ],
        },
      ],
    });

    // ✅ Tính trung bình toàn bộ đánh giá sản phẩm của seller
    let totalRating = 0;
    let count = 0;
    products.forEach((p) => {
      p.reviews.forEach((r) => {
        totalRating += r.rating;
        count++;
      });
    });

    const averageRating = count ? (totalRating / count).toFixed(2) : null;

    res.json({
      seller_id,
      seller_average_rating: averageRating,
      total_reviews: count,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy đánh giá người bán", error: error.message });
  }
};

/**
 * 🟠 [4] Lấy tất cả đánh giá của người dùng (những gì họ đã viết)
 */
exports.getUserReviews = async (req, res) => {
  try {
    const member_id = req.user?.id || req.params.member_id;

    const reviews = await Review.findAll({
      where: { member_id },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách đánh giá của người dùng", error: error.message });
  }
};

/**
 * 🔵 [5] Cập nhật đánh giá
 */
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const member_id = req.user?.id || req.body.member_id;

    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá" });

    if (review.member_id !== member_id)
      return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa đánh giá này" });

    await review.update({ rating, comment });
    res.json({ message: "Cập nhật đánh giá thành công", review });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật đánh giá", error: error.message });
  }
};

/**
 * 🔴 [6] Xóa đánh giá
 */
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const member_id = req.user?.id || req.body.member_id;

    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá" });

    if (review.member_id !== member_id)
      return res.status(403).json({ message: "Bạn không có quyền xóa đánh giá này" });

    await review.destroy();
    res.json({ message: "Đã xóa đánh giá thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa đánh giá", error: error.message });
  }
};
