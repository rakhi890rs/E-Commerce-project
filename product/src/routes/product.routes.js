const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductBySeller
} = require("../controller/product.controller");

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

// seller route MUST come before /:id
router.get(
  "/seller",
  createAuthMiddleware(["admin", "seller"]),
  getProductBySeller
);

// GET all products
router.get("/", getProducts);

// GET product by id
router.get("/:id", getProductById);

// UPDATE
router.patch(
  "/:id",
  createAuthMiddleware(["admin", "seller"]),
  updateProduct
);

// DELETE
router.delete(
  "/:id",
  createAuthMiddleware(["admin", "seller"]),
  deleteProduct
);

module.exports = router;