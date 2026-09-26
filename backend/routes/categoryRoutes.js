const express = require("express");
const router = express.Router();

const Category = require("../models/Category");
const authMiddleware = require("../middleware/authMiddleware");

// ADD CATEGORY
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required"
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim()
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists"
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || ""
    });

    res.status(201).json({
      message: "Category added successfully",
      category
    });
  } catch (error) {
    console.error("Add category error:", error);

    res.status(500).json({
      message: "Failed to add category",
      error: error.message
    });
  }
});

// GET ALL CATEGORIES
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { status, search } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i"
      };
    }

    const categories = await Category.find(filter)
      .sort({ name: 1 });

    res.json({
      count: categories.length,
      categories
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message
    });
  }
});

// GET SINGLE CATEGORY
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    res.json({
      category
    });
  } catch (error) {
    console.error("Get category error:", error);

    res.status(500).json({
      message: "Failed to fetch category",
      error: error.message
    });
  }
});

// UPDATE CATEGORY
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, description, status } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    if (name && name.trim() !== category.name) {
      const duplicate = await Category.findOne({
        name: name.trim(),
        _id: { $ne: category._id }
      });

      if (duplicate) {
        return res.status(400).json({
          message: "Another category with this name already exists"
        });
      }

      category.name = name.trim();
    }

    if (description !== undefined) {
      category.description = description;
    }

    if (status !== undefined) {
      category.status = status;
    }

    await category.save();

    res.json({
      message: "Category updated successfully",
      category
    });
  } catch (error) {
    console.error("Update category error:", error);

    res.status(500).json({
      message: "Failed to update category",
      error: error.message
    });
  }
});

// DELETE CATEGORY
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error("Delete category error:", error);

    res.status(500).json({
      message: "Failed to delete category",
      error: error.message
    });
  }
});

module.exports = router;