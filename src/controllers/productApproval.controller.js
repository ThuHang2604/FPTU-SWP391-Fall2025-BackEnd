const db = require("../models");
const ProductApproval = db.ProductApproval;

// Admin only
exports.getAllApproval = async (req, res) => {
  try {
    const approvals = await ProductApproval.findAll();
    res.json(approvals);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

exports.getApprovalByAdminId = async (req, res) => {
  try {
    const { adminId } = req.params;
    const approvals = await ProductApproval.findAll({ where: { admin_id: adminId } });
    res.json(approvals);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

exports.getApprovalByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const approvals = await ProductApproval.findAll({ where: { product_id: productId } });
    res.json(approvals);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};
