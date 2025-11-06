const db = require("../models");
const { User, Member, Product, Review, ProductMedia } = db;
const { Op } = require("sequelize");

// 🧾 Lấy thông tin chi tiết người bán
exports.getSellerProfile = async (req, res) => {
  try {
    const sellerId = req.params.id;

    // 🔹 Tìm member (người bán)
    const seller = await Member.findOne({
      where: { id: sellerId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["full_name", "avatar", "phone"],
        },
        {
          model: Product,
          as: "products",
          where: {
            status: { [Op.in]: ["SOLD", "APPROVED"] },
          },
          required: false,
          include: [
            {
              model: ProductMedia,
              as: "media",
              attributes: ["id", "media_url", "media_type"],
            },
            {
              model: Review,
              as: "reviews",
              include: [
                {
                  model: Member,
                  as: "member",
                  include: [{ model: User, as: "user", attributes: ["full_name", "avatar"] }],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!seller) {
      return res.status(404).json({ message: "Không tìm thấy người bán." });
    }

    // 🔹 Tính trung bình đánh giá tất cả sản phẩm SOLD của người bán
    let totalRating = 0;
    let totalReviews = 0;

    seller.products.forEach((product) => {
      product.reviews.forEach((r) => {
        totalRating += r.rating;
        totalReviews++;
      });
    });

    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : null;

    // 🔹 Chuẩn hóa dữ liệu phản hồi
    const response = {
      seller_id: seller.id,
      full_name: seller.user?.full_name,
      phone: seller.user?.phone || null,
      city: seller.city,
      avatar: seller.user?.avatar,
      average_rating: averageRating,
      total_reviews: totalReviews,
      products: seller.products.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        status: p.status,
        created_at: p.created_at,
        images: p.media.map((m) => ({
          id: m.id,
          url: m.media_url,
          type: m.media_type,
        })),
        reviews: p.reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          created_at: r.created_at,
          reviewer: {
            id: r.member_id,
            name: r.member?.user?.full_name,
            avatar: r.member?.user?.avatar,
          },
        })),
      })),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("❌ Lỗi getSellerProfile:", error);
    return res.status(500).json({ message: "Lỗi máy chủ.", error: error.message });
  }
};
