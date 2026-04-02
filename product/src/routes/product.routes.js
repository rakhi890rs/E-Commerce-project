const express = require("express");
const router = express.Router();

const { createProduct, getProducts } = require("../controller/product.controller");
const upload = require("../middleware/upload");
const createAuthMiddleware = require("../middleware/auth.middleware");
const {
  createProductValidator,
  handleValidationErrors
} = require("../middleware/product.validator");

// POST /api/products
router.post(
  "/",
  createAuthMiddleware(["admin", "seller"]),
  upload.array("images", 5),
  createProductValidator,
  handleValidationErrors,
  createProduct
);

// GET /api/products
router.get("/", getProducts);

module.exports = router;