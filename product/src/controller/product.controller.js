const mongoose = require("mongoose");
const Product = require("../models/product.model");
const { uploadImage } = require("../services/imageKit.service");
const { publishToQueue } = require("../borker/borker");

async function createProduct(req, res) {
  try {
    const {
      title,
      description,
      priceAmount,
      priceCurrency = "INR",
      stock,
      category
    } = req.body;

    const seller = req.user.id;

    if (!title || !priceAmount) {
      return res.status(400).json({
        message: "Title and price are required"
      });
    }

    const price = {
      amount: Number(priceAmount),
      currency: priceCurrency
    };

    let images = [];

    if (req.files && req.files.length > 0) {
      const uploaded = await Promise.all(
        req.files.map((file) =>
          uploadImage({
            buffer: file.buffer,
            filename: file.originalname
          })
        )
      );

      images = uploaded.map((img) => ({
        url: img.url,
        thumbnail: img.thumbnail,
        id: img.id
      }));
    }

    const product = await Product.create({
      title,
      description,
      price,
      seller,
      images,
      stock: Number(stock) || 0,
      category
    });

    await Promise.all([
      publishToQueue("PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED", product),
      publishToQueue("PRODUCT_NOTIFICATION.PRODUCT_CREATED", {
        ...product.toObject(),
        email: req.user.email
      })
    ]);

    return res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
}

async function getProducts(req, res) {
  try {
    const { q, minprice, maxprice, skip = 0, limit = 20 } = req.query;

    const filter = {};

    if (q) {
      filter.$text = { $search: q };
    }

    if (minprice) {
      filter["price.amount"] = {
        ...filter["price.amount"],
        $gte: Number(minprice)
      };
    }

    if (maxprice) {
      filter["price.amount"] = {
        ...filter["price.amount"],
        $lte: Number(maxprice)
      };
    }

    const products = await Product.find(filter)
      .skip(Number(skip))
      .limit(Number(limit));

    return res.status(200).json({
      message: "Products fetched successfully",
      products
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
}

async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      product
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product id"
      });
    }

    const product = await Product.findOne({
      _id: id,
      seller: req.user.id
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const { title, description, priceAmount, priceCurrency, stock, category } = req.body;

    if (title) product.title = title;
    if (description) product.description = description;
    if (priceAmount) product.price.amount = Number(priceAmount);
    if (priceCurrency) product.price.currency = priceCurrency;
    if (stock !== undefined) product.stock = Number(stock);
    if (category) product.category = category;

    if (req.files && req.files.length > 0) {
      const uploaded = await Promise.all(
        req.files.map((file) =>
          uploadImage({
            buffer: file.buffer,
            filename: file.originalname
          })
        )
      );

      product.images = uploaded.map((img) => ({
        url: img.url,
        thumbnail: img.thumbnail,
        id: img.id
      }));
    }

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product id"
      });
    }

    const product = await Product.findOne({
      _id: id,
      seller: req.user.id
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    await Product.deleteOne({ _id: id });

    return res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
}

async function getProductBySeller(req, res) {
  try {
    const products = await Product.find({ seller: req.user.id });

    return res.status(200).json({
      message: "Seller products fetched successfully",
      products
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductBySeller
};