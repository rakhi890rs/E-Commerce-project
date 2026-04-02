const express = require("express");
const router = express.Router();

const { createProduct } = require("../controllers/product.controller");
const upload = require("../middlewares/upload");
const createAuthMiddleware = require("../middlewares/auth.middleware");
const {
  createProductValidator,
  handleValidationErrors
} = require("../middlewares/product.validator");

router.post(
  "/",
  createAuthMiddleware(["admin", "seller"]),
  upload.array("images", 5),
  createProductValidator,
  handleValidationErrors,
  createProduct
);

module.exports = router;