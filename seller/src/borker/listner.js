const { subscribeToQueue } = require("../borker/borker");
const userModel = require("../models/user.model");
const productModel = require("../models/product.model");
const orderModel = require("../models/order.model");
const paymentModel = require("../models/payment.model");

module.exports = function () {
  subscribeToQueue("AUTH_SELLER_DASHBOARD.USER_CREATED", async (user) => {
    try {
      await userModel.create(user);
      console.log("User created in seller dashboard:", user);
    } catch (error) {
      console.error("Error creating user in seller dashboard:", error.message);
    }
  });

  subscribeToQueue("PRODUCT_SELLER_DASHBOARD.PRODUCT_CREATED", async (product) => {
    try {
      await productModel.create(product);
      console.log("Product created in seller dashboard:", product);
    } catch (error) {
      console.error("Error creating product in seller dashboard:", error.message);
    }
  });

  subscribeToQueue("ORDER_SELLER_DASHBOARD.ORDER_CREATED", async (order) => {
    try {
      await orderModel.create(order);
      console.log("Order created in seller dashboard:", order);
    } catch (error) {
      console.error("Error creating order in seller dashboard:", error.message);
    }
  });

  subscribeToQueue("PAYMENT_SELLER_DASHBOARD.PAYMENT_UPDATED", async (payment) => {
    try {
      await paymentModel.findOneAndUpdate(
        { _id: payment._id },
        payment,
      );
      console.log("Payment updated in seller dashboard:", payment);
    } catch (error) {
      console.error("Error updating payment in seller dashboard:", error.message);
    }
  });
};