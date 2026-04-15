const { subscribeToQueue } = require("./borker");
const sendEmail = require("../email");

function setListeners() {
  // USER REGISTER EVENT
  subscribeToQueue("AUTH_NOTIFICATION.USER_CREATED", async (data) => {
    const emailHTMLTemplate = `
      <h1>Welcome to our platform, ${data.fullname.firstname} ${data.fullname.lastname || ""}!</h1>
      <p>Thank you for registering with us. We're excited to have you on board.</p>
      <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
      <p>Best regards,<br/>The Team</p>
    `;

    await sendEmail(
      data.email,
      "Welcome to Our Platform",
      emailHTMLTemplate
    );
  });

  // ORDER CREATED EVENT
  subscribeToQueue("ORDER_NOTIFICATION.ORDER_CREATED", async (data) => {
  console.log("Received order created event:", data);

  const emailHTMLTemplate = `
    <h1>Order Placed Successfully 🛒</h1>
    <p>Your order has been placed successfully.</p>

    <p><strong>Order ID:</strong> ${data._id}</p>
    <p><strong>Total Amount:</strong> ${data.totalPrice.amount} ${data.totalPrice.currency}</p>
    <p><strong>Status:</strong> ${data.status}</p>

    <p>We will notify you once your order is shipped.</p>
  `;

  await sendEmail(
    data.email,
    "Order Placed Successfully",
    emailHTMLTemplate
  );
});

  // PAYMENT INITIATED EVENT
  subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_INITIATED", async (payment) => {
    console.log("Received payment initiated event:", payment);

    const emailHTMLTemplate = `
      <h1>Payment Initiated</h1>
      <p>Your payment has been initiated and is currently being processed.</p>
      <p><strong>Order ID:</strong> ${payment.order}</p>
      <p><strong>Payment ID:</strong> ${payment._id}</p>
      <p><strong>Amount:</strong> ${payment.price.amount} ${payment.price.currency}</p>
      <p><strong>Status:</strong> ${payment.status}</p>
      <p>We will notify you once the payment is completed. Thank you for your patience.</p>
    `;

    await sendEmail(
      payment.email,
      "Payment Initiated",
      emailHTMLTemplate
    );
  });

  // PRODUCT CREATED EVENT
  subscribeToQueue("PRODUCT_NOTIFICATION.PRODUCT_CREATED", async (product) => {
    console.log("Received product created event:", product);

    const emailHTMLTemplate = `
      <h1>New Product Created</h1>
      <p>A new product has been created in the seller dashboard.</p>
      <p><strong>Product Name:</strong> ${product.title}</p>
      <p><strong>Description:</strong> ${product.description}</p>
      <p><strong>Price:</strong> ${product.price.amount} ${product.price.currency}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <p>Check it out in the seller dashboard.</p>
    `;

    await sendEmail(
      product.email,
      "New Product Created",
      emailHTMLTemplate
    );
  });

  // PAYMENT COMPLETED EVENT
  subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_COMPLETED", async (data) => {
    console.log("Received payment completed event:", data);

    const paymentHTMLTemplate = `
      <h1>Payment Successful 🎉</h1>
      <p>Your payment has been completed successfully.</p>
      <p><strong>Order ID:</strong> ${data.orderId}</p>
      <p><strong>Payment ID:</strong> ${data.paymentId}</p>
      <p><strong>Amount:</strong> ${data.amount} ${data.currency}</p>
      <p><strong>Status:</strong> ${data.status}</p>
      <p>Thank you for shopping with us ❤️</p>
    `;

    await sendEmail(
      data.email,
      "Payment Successful",
      paymentHTMLTemplate
    );
  });
}

module.exports = setListeners;