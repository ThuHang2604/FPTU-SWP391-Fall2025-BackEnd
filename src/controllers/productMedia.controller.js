const db = require("../models");
const ProductMedia = db.ProductMedia;

// Không cần đăng nhập
exports.getMediaByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const media = await ProductMedia.findAll({ where: { product_id: productId } });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

// Cần đăng nhập
exports.createMedia = async (req, res) => {
  try {
    const { product_id, media_url, media_type } = req.body;
    const media = await ProductMedia.create({ product_id, media_url, media_type });
    res.status(201).json(media);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

exports.updateMediaByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const { media_url, media_type } = req.body;

    const media = await ProductMedia.findOne({ where: { product_id: productId } });
    if (!media) return res.status(404).json({ message: "Media not found" });

    media.media_url = media_url || media.media_url;
    media.media_type = media_type || media.media_type;
    await media.save();

    res.json(media);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

exports.deleteMediaByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await ProductMedia.destroy({ where: { product_id: productId } });
    if (!result) return res.status(404).json({ message: "Media not found" });
    res.json({ message: "Media deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};
