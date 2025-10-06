const db = require("../models");
const Category = db.Category;

// Lấy tất cả category (không cần đăng nhập)
exports.getAllCategory = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

// Tạo mới (Admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

// Update category
exports.updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.name = name || category.name;
    category.description = description || category.description;
    await category.save();

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

// Delete category
exports.deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Category.destroy({ where: { id } });
    if (!result) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};
