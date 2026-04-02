const express = require("express");
const router = express.Router();

const { createProduct } = require("../controller/product.controller");
const upload = require("../middleware/upload");
const createAuthMiddleware = require("../middleware/auth.middleware");
const {
  createProductValidator,
  handleValidationErrors
} = require("../middleware/product.validator");

router.post(
  "/",
  createAuthMiddleware(["admin", "seller"]),
  upload.array("images", 5),
  createProductValidator,
  handleValidationErrors,
  createProduct
);

module.exports = router;