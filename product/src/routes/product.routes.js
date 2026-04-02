const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
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

// GET /api/products
router.get("/", getProducts);

// GET /api/products/:id
router.get("/:id", getProductById);


router.patch("/:id", createAuthMiddleware(["admin", "seller"]), updateProduct);

router.delete(
  "/:id",
  createAuthMiddleware(["admin", "seller"]),
  deleteProduct
);

module.exports = router;