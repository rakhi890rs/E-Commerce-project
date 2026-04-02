const express = require("express");
const router = express.Router();

const { createProduct } = require("../controller/product.controller");
const upload = require("../middlewares/upload");
const createAuthMiddleware = require("../middlewares/auth.middleware");

//  only admin & seller can create product
router.post(
  "/",
  createAuthMiddleware(["admin", "seller"]), 
  upload.array("images",5),
  createProduct
);

module.exports = router;