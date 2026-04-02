const Product = require("../models/product.model");
const { uploadImage } = require("../services/imageKit.service");

async function createProduct(req, res) {
  try {
    const {
      title,
      description,
      priceAmount,
      priceCurrency = "INR"
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
    // upload images
    let images = [];

    if (req.files && req.files.length > 0) {
      const uploaded = await Promise.all(
        req.files.map(file =>
          uploadImage({
            buffer: file.buffer,
            filename: file.originalname
          })
        )
      );

      images = uploaded.map(img => ({
        url: img.url,
        thumbnail: img.thumbnail,
        id: img.id
      }));
    }

    // create product
    const product = await Product.create({
      title,
      description,
      price,
      seller,
      images
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
}

module.exports = { createProduct };